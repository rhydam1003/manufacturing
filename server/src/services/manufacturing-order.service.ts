import { Types } from "mongoose";
import { ManufacturingOrder } from "../models/manufacturing-order.model";
import { WorkOrder } from "../models/work-order.model";
import { BOM } from "../models/bom.model";
import { NotFoundError, ValidationError } from "../utils/error";
import { FilterQuery } from "../types";

export class ManufacturingOrderService {
  async create(data: any) {
    const bom = await BOM.findById(data.bomId);
    if (!bom) {
      throw new NotFoundError("BOM not found");
    }

    return await ManufacturingOrder.create({
      ...data,
      status: "Planned",
    });
  }

  async list(query: FilterQuery) {
    const filter: any = {};
    if (query.status) filter.status = query.status;
    if (query.productId) filter.productId = query.productId;
    if (query.startDate)
      filter.scheduleStart = { $gte: new Date(query.startDate) };
    if (query.endDate) filter.scheduleEnd = { $lte: new Date(query.endDate) };

    return await ManufacturingOrder.find(filter)
      .populate("productId")
      .populate("bomId")
      .sort({ createdAt: -1 });
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid manufacturing order ID");
    }

    return await ManufacturingOrder.findById(id)
      .populate("productId")
      .populate("bomId")
      .populate({
        path: "workOrders",
        populate: {
          path: "workCenterId",
        },
      });
  }

  async update(id: string, data: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid manufacturing order ID");
    }

    const order = await ManufacturingOrder.findById(id);
    if (!order) {
      throw new NotFoundError("Manufacturing order not found");
    }

    if (order.status !== "Planned" && data.qtyPlanned !== undefined) {
      throw new ValidationError(
        "Cannot modify quantity after production has started"
      );
    }

    return await ManufacturingOrder.findByIdAndUpdate(id, data, { new: true })
      .populate("productId")
      .populate("bomId");
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid manufacturing order ID");
    }

    const order = await ManufacturingOrder.findById(id);
    if (!order) {
      throw new NotFoundError("Manufacturing order not found");
    }

    if (order.status !== "Planned" && order.status !== "Canceled") {
      throw new ValidationError("Cannot delete an active manufacturing order");
    }

    await WorkOrder.deleteMany({ manufacturingOrderId: id });
    await ManufacturingOrder.findByIdAndDelete(id);
    return true;
  }

  async startProduction(id: string) {
    const order = await ManufacturingOrder.findById(id);
    if (!order) {
      throw new NotFoundError("Manufacturing order not found");
    }

    if (order.status !== "Planned") {
      throw new ValidationError(
        `Cannot start production. Current status: ${order.status}`
      );
    }

    // Create work orders based on BOM operations
    const bom = await BOM.findById(order.bomId);
    if (!bom) {
      throw new NotFoundError("BOM not found");
    }

    const workOrders = await Promise.all(
      bom.operations.map((operation) =>
        WorkOrder.create({
          moId: order._id,
          workCenterId: operation.workCenterId,
          name: operation.name,
          duration: operation.duration,
          status: "Queued",
        })
      )
    );

    order.status = "In Progress";
    order.scheduleStart = new Date();
    order.workOrders = workOrders.map((wo) => wo._id);
    await order.save();

    return order;
  }

  async completeProduction(id: string) {
    const order = await ManufacturingOrder.findById(id).populate("workOrders");
    if (!order) {
      throw new NotFoundError("Manufacturing order not found");
    }

    if (order.status !== "In Progress") {
      throw new ValidationError("Order must be in progress to complete");
    }

    // Check if all work orders are completed
    if (!order.workOrders || order.workOrders.length === 0) {
      throw new ValidationError(
        "No work orders found for this manufacturing order"
      );
    }

    const pendingWorkOrders = (order.workOrders as any[]).filter(
      (wo) => wo.status !== "Completed"
    );

    if (pendingWorkOrders.length > 0) {
      throw new ValidationError("All work orders must be completed first");
    }

    order.status = "Done";
    order.scheduleEnd = new Date();
    await order.save();

    return order;
  }

  async cancelOrder(id: string) {
    const order = await ManufacturingOrder.findById(id);
    if (!order) {
      throw new NotFoundError("Manufacturing order not found");
    }

    if (order.status === "Done") {
      throw new ValidationError("Cannot cancel a completed order");
    }

    // Cancel all associated work orders
    await WorkOrder.updateMany(
      { moId: id, status: { $ne: "Completed" } },
      { status: "Canceled" }
    );

    order.status = "Canceled";
    await order.save();

    return order;
  }

  async getWorkOrders(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid manufacturing order ID");
    }

    const order = await ManufacturingOrder.findById(id);
    if (!order) {
      throw new NotFoundError("Manufacturing order not found");
    }

    return await WorkOrder.find({ moId: id })
      .populate("workCenterId")
      .sort({ createdAt: 1 });
  }

  async getMaterialRequirements(id: string) {
    const order = await ManufacturingOrder.findById(id).populate("bomId");
    if (!order) {
      throw new NotFoundError("Manufacturing order not found");
    }

    const bom = await BOM.findById(order.bomId).populate("items.componentId");
    if (!bom) {
      throw new NotFoundError("BOM not found");
    }

    return bom.items.map((item: any) => ({
      component: item.componentId,
      requiredQuantity: item.qtyPerUnit * order.qtyPlanned,
      unit: item.unit,
    }));
  }
}
