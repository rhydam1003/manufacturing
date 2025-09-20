import { Types } from "mongoose";
import { WorkCenter } from "../models/work-center.model";
import { WorkOrder } from "../models/work-order.model";
import { FilterQuery } from "../types";
import { NotFoundError, ValidationError } from "../utils/error";

export class WorkCenterService {
  async create(data: any) {
    const workCenter = new WorkCenter(data);
    await workCenter.save();
    return workCenter;
  }

  async list(query: FilterQuery = {}) {
    const {
      search,
      location,
      isActive,
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }
    if (location) filter.location = { $regex: location, $options: "i" };
    if (isActive !== undefined) filter.isActive = isActive;

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [workCenters, total] = await Promise.all([
      WorkCenter.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      WorkCenter.countDocuments(filter),
    ]);

    return {
      data: workCenters,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid work center ID");
    }

    const workCenter = await WorkCenter.findById(id);
    if (!workCenter) {
      throw new NotFoundError("Work center not found");
    }

    return workCenter;
  }

  async update(id: string, data: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid work center ID");
    }

    const workCenter = await WorkCenter.findById(id);
    if (!workCenter) {
      throw new NotFoundError("Work center not found");
    }

    Object.assign(workCenter, data);
    await workCenter.save();

    return workCenter;
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid work center ID");
    }

    const workCenter = await WorkCenter.findById(id);
    if (!workCenter) {
      throw new NotFoundError("Work center not found");
    }

    // Check if work center is being used in any work orders
    const activeWorkOrders = await WorkOrder.countDocuments({
      workCenterId: id,
      status: { $nin: ["Completed", "Canceled"] }
    });

    if (activeWorkOrders > 0) {
      throw new ValidationError(
        "Cannot delete work center with active work orders"
      );
    }

    await WorkCenter.findByIdAndDelete(id);
    return true;
  }

  async getUtilization(id: string, startDate?: Date, endDate?: Date) {
    const workCenter = await WorkCenter.findById(id);
    if (!workCenter) {
      throw new NotFoundError("Work center not found");
    }

    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = startDate;
    if (endDate) dateFilter.$lte = endDate;

    const workOrders = await WorkOrder.find({
      workCenterId: id,
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
    });

    const totalPlannedMinutes = workOrders.reduce(
      (sum, wo) => sum + wo.plannedMinutes, 0
    );
    const totalActualMinutes = workOrders.reduce(
      (sum, wo) => sum + wo.actualMinutes, 0
    );

    const completedOrders = workOrders.filter(wo => wo.status === "Completed");
    const inProgressOrders = workOrders.filter(wo => 
      ["Started", "Paused"].includes(wo.status)
    );

    return {
      workCenter: {
        id: workCenter._id,
        name: workCenter.name,
        location: workCenter.location,
        costPerHour: workCenter.costPerHour,
        capacity: workCenter.capacity,
        downtime: workCenter.downtime
      },
      utilization: {
        totalPlannedMinutes,
        totalActualMinutes,
        efficiency: totalPlannedMinutes > 0 ? 
          (totalActualMinutes / totalPlannedMinutes) * 100 : 0,
        completedOrders: completedOrders.length,
        inProgressOrders: inProgressOrders.length,
        totalOrders: workOrders.length
      }
    };
  }

  async getAllUtilization(startDate?: Date, endDate?: Date) {
    const workCenters = await WorkCenter.find({ isActive: true });
    const utilizationData = [];

    for (const workCenter of workCenters) {
      try {
        const utilization = await this.getUtilization(
          workCenter._id.toString(),
          startDate,
          endDate
        );
        utilizationData.push(utilization);
      } catch (error) {
        // Skip work centers with errors
        continue;
      }
    }

    return utilizationData;
  }

  async updateDowntime(id: string, downtime: number) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid work center ID");
    }

    const workCenter = await WorkCenter.findById(id);
    if (!workCenter) {
      throw new NotFoundError("Work center not found");
    }

    if (downtime < 0) {
      throw new ValidationError("Downtime cannot be negative");
    }

    workCenter.downtime = downtime;
    await workCenter.save();

    return workCenter;
  }

  async getWorkCenterStats() {
    const stats = await WorkCenter.aggregate([
      {
        $group: {
          _id: "$isActive",
          count: { $sum: 1 },
          totalCapacity: { $sum: "$capacity" },
          totalDowntime: { $sum: "$downtime" },
          avgCostPerHour: { $avg: "$costPerHour" }
        }
      }
    ]);

    return stats.reduce((acc, stat) => {
      const key = stat._id ? "active" : "inactive";
      acc[key] = {
        count: stat.count,
        totalCapacity: stat.totalCapacity,
        totalDowntime: stat.totalDowntime,
        avgCostPerHour: stat.avgCostPerHour
      };
      return acc;
    }, {});
  }
}
