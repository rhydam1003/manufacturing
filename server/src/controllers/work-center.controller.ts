import { Request, Response, NextFunction } from "express";
import { WorkCenterService } from "../services/work-center.service";

export class WorkCenterController {
  private workCenterService: WorkCenterService;

  constructor() {
    this.workCenterService = new WorkCenterService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const workCenter = await this.workCenterService.create(req.body);
      res.status(201).json({
        success: true,
        data: workCenter,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.workCenterService.list(req.query);
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
      const workCenter = await this.workCenterService.getById(id);
      res.json({
        success: true,
        data: workCenter,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const workCenter = await this.workCenterService.update(id, req.body);
      res.json({
        success: true,
        data: workCenter,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.workCenterService.delete(id);
      res.json({
        success: true,
        message: "Work center deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getUtilization(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      
      const utilization = await this.workCenterService.getUtilization(
        id,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json({
        success: true,
        data: utilization,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUtilization(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      
      const utilizationData = await this.workCenterService.getAllUtilization(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json({
        success: true,
        data: utilizationData,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDowntime(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { downtime } = req.body;
      
      const workCenter = await this.workCenterService.updateDowntime(id, downtime);
      
      res.json({
        success: true,
        data: workCenter,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.workCenterService.getWorkCenterStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
