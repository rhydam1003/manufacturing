import { Request, Response, NextFunction } from "express";
import { BOMService } from "../services/bom.service";
import { logger } from "../utils/logger";
import { FilterQuery } from "../types";
import { NotFoundError } from "../utils/error";

export class BomController {
  private bomService: BOMService;

  constructor() {
    this.bomService = new BOMService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bom = await this.bomService.create(req.body);
      return res.status(201).json({
        success: true,
        data: bom,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as FilterQuery;
      const result = await this.bomService.list(query);
      return res.json({
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
      const bom = await this.bomService.getById(id);

      if (!bom) {
        throw new NotFoundError("BOM not found");
      }

      return res.json({
        success: true,
        data: bom,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const bom = await this.bomService.update(id, req.body);

      if (!bom) {
        throw new NotFoundError("BOM not found");
      }

      return res.json({
        success: true,
        data: bom,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const success = await this.bomService.delete(id);

      if (!success) {
        throw new NotFoundError("BOM not found");
      }

      return res.json({
        success: true,
        message: "BOM deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const bom = await this.bomService.toggleActive(id);

      if (!bom) {
        throw new NotFoundError("BOM not found");
      }

      return res.json({
        success: true,
        data: bom,
      });
    } catch (error) {
      next(error);
    }
  }

  async calculateCost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cost = await this.bomService.calculateCost(id);

      if (cost === null) {
        throw new NotFoundError("BOM not found");
      }

      return res.json({
        success: true,
        data: cost,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const usage = await this.bomService.getUsage(id);

      return res.json({
        success: true,
        data: usage,
      });
    } catch (error) {
      next(error);
    }
  }
}
