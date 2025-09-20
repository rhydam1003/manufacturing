import { Request, Response, NextFunction } from "express";
import { WorkOrderService } from "../services/work-order.service";
import { RequestWithUser } from "../types";

export class WorkOrderController {
  private workOrderService: WorkOrderService;

  constructor() {
    this.workOrderService = new WorkOrderService();
  }

  async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const data = {
        ...req.body,
        createdBy: req.user?._id,
        updatedBy: req.user?._id
      };
      const workOrder = await this.workOrderService.create(data);
      res.status(201).json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.workOrderService.list(req.query);
      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workOrder = await this.workOrderService.getById(id);
      res.json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workOrder = await this.workOrderService.update(
        id,
        req.body,
        req.user?._id.toString() || ""
      );
      res.json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async start(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { operatorId } = req.body;
      const workOrder = await this.workOrderService.startWorkOrder(
        id,
        operatorId,
        req.user?._id.toString() || ""
      );
      res.json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async pause(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { comments } = req.body;
      const workOrder = await this.workOrderService.pauseWorkOrder(
        id,
        req.user?._id.toString() || "",
        comments
      );
      res.json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async complete(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { actualMinutes, comments } = req.body;
      const workOrder = await this.workOrderService.completeWorkOrder(
        id,
        req.user?._id.toString() || "",
        actualMinutes,
        comments
      );
      res.json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const workOrder = await this.workOrderService.cancelWorkOrder(
        id,
        req.user?._id.toString() || "",
        reason
      );
      res.json({
        success: true,
        data: workOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.workOrderService.delete(id);
      res.json({
        success: true,
        message: "Work order deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.workOrderService.getWorkOrderStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
