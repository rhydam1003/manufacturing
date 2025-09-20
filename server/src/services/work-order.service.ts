import { Types } from "mongoose";
import { WorkOrder } from "../models/work-order.model";
import { ManufacturingOrder } from "../models/manufacturing-order.model";
import { FilterQuery } from "../types";
import { NotFoundError, ValidationError } from "../utils/error";

export class WorkOrderService {
  // State machine for work order status transitions
  private readonly validTransitions = {
    "Queued": ["Started", "Canceled"],
    "Started": ["Paused", "Completed", "Canceled"],
    "Paused": ["Started", "Canceled"],
    "Completed": [], // Terminal state
    "Canceled": [] // Terminal state
  };

  private isValidTransition(currentStatus: string, newStatus: string): boolean {
    return this.validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  async create(data: any) {
    const workOrder = new WorkOrder(data);
    await workOrder.save();
    return workOrder;
  }

  async list(query: FilterQuery = {}) {
    const {
      moId,
      status,
      workCenterId,
      operatorId,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};
    if (moId) filter.moId = moId;
    if (status) filter.status = status;
    if (workCenterId) filter.workCenterId = workCenterId;
    if (operatorId) filter.operatorId = operatorId;

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [workOrders, total] = await Promise.all([
      WorkOrder.find(filter)
        .populate("moId", "code productId status")
        .populate("workCenterId", "name location")
        .populate("operatorId", "name email")
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      WorkOrder.countDocuments(filter),
    ]);

    return {
      data: workOrders,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid work order ID");
    }

    const workOrder = await WorkOrder.findById(id)
      .populate("moId", "code productId status")
      .populate("workCenterId", "name location costPerHour")
      .populate("operatorId", "name email")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!workOrder) {
      throw new NotFoundError("Work order not found");
    }

    return workOrder;
  }

  async update(id: string, data: any, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid work order ID");
    }

    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      throw new NotFoundError("Work order not found");
    }

    // Update fields
    Object.assign(workOrder, data);
    workOrder.updatedBy = new Types.ObjectId(userId);
    await workOrder.save();

    return workOrder;
  }

  async startWorkOrder(id: string, operatorId: string, userId: string) {
    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      throw new NotFoundError("Work order not found");
    }

    if (!this.isValidTransition(workOrder.status, "Started")) {
      throw new ValidationError(
        `Cannot start work order. Current status: ${workOrder.status}`
      );
    }

    workOrder.status = "Started";
    workOrder.startedAt = new Date();
    workOrder.operatorId = new Types.ObjectId(operatorId);
    workOrder.updatedBy = new Types.ObjectId(userId);
    await workOrder.save();

    return workOrder;
  }

  async pauseWorkOrder(id: string, userId: string, comments?: string) {
    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      throw new NotFoundError("Work order not found");
    }

    if (!this.isValidTransition(workOrder.status, "Paused")) {
      throw new ValidationError(
        `Cannot pause work order. Current status: ${workOrder.status}`
      );
    }

    workOrder.status = "Paused";
    if (comments) workOrder.comments = comments;
    workOrder.updatedBy = new Types.ObjectId(userId);
    await workOrder.save();

    return workOrder;
  }

  async completeWorkOrder(id: string, userId: string, actualMinutes: number, comments?: string) {
    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      throw new NotFoundError("Work order not found");
    }

    if (!this.isValidTransition(workOrder.status, "Completed")) {
      throw new ValidationError(
        `Cannot complete work order. Current status: ${workOrder.status}`
      );
    }

    workOrder.status = "Completed";
    workOrder.completedAt = new Date();
    workOrder.actualMinutes = actualMinutes;
    if (comments) workOrder.comments = comments;
    workOrder.updatedBy = new Types.ObjectId(userId);
    await workOrder.save();

    // Check if all work orders for the manufacturing order are completed
    await this.checkManufacturingOrderCompletion(workOrder.moId);

    return workOrder;
  }

  async cancelWorkOrder(id: string, userId: string, reason?: string) {
    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      throw new NotFoundError("Work order not found");
    }

    if (!this.isValidTransition(workOrder.status, "Canceled")) {
      throw new ValidationError(
        `Cannot cancel work order. Current status: ${workOrder.status}`
      );
    }

    workOrder.status = "Canceled";
    if (reason) workOrder.comments = reason;
    workOrder.updatedBy = new Types.ObjectId(userId);
    await workOrder.save();

    return workOrder;
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid work order ID");
    }

    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      throw new NotFoundError("Work order not found");
    }

    // Only allow deletion of queued or canceled work orders
    if (!["Queued", "Canceled"].includes(workOrder.status)) {
      throw new ValidationError(
        `Cannot delete work order with status: ${workOrder.status}`
      );
    }

    await WorkOrder.findByIdAndDelete(id);
    return true;
  }

  private async checkManufacturingOrderCompletion(moId: Types.ObjectId) {
    const incompleteWorkOrders = await WorkOrder.countDocuments({
      moId,
      status: { $nin: ["Completed", "Canceled"] }
    });

    if (incompleteWorkOrders === 0) {
      // All work orders completed, update manufacturing order status
      await ManufacturingOrder.findByIdAndUpdate(moId, {
        status: "Done",
        updatedAt: new Date()
      });
    }
  }

  async getWorkOrderStats() {
    const stats = await WorkOrder.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalPlannedMinutes: { $sum: "$plannedMinutes" },
          totalActualMinutes: { $sum: "$actualMinutes" }
        }
      }
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalPlannedMinutes: stat.totalPlannedMinutes,
        totalActualMinutes: stat.totalActualMinutes
      };
      return acc;
    }, {});
  }
}
