import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { InventoryService } from "../services/inventory.service";
import { RequestWithUser, UserDocument } from "../types";

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  async getInventoryLevels(req: Request, res: Response) {
    try {
      const { query } = req;
      const inventory = await this.inventoryService.getStock(query);
      return res.json(inventory);
    } catch (error) {
      logger.error("Failed to get inventory levels:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get inventory levels",
      });
    }
  }

  async getProductInventory(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const inventory = await this.inventoryService.getStock({ productId });

      return res.json(inventory);
    } catch (error) {
      logger.error("Failed to get product inventory:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get product inventory",
      });
    }
  }

  async adjustInventory(req: RequestWithUser, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const result = await this.inventoryService.adjustStock(
        req.body,
        req.user.id
      );
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Failed to adjust inventory:", error);
      return res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to adjust inventory",
      });
    }
  }

  async transferStock(req: RequestWithUser, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const result = await this.inventoryService.transferStock(
        req.body,
        req.user.id
      );
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Failed to transfer stock:", error);
      return res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to transfer stock",
      });
    }
  }

  async getLowStockAlerts(req: Request, res: Response) {
    try {
      const alerts = await this.inventoryService.getStock({
        minQuantity: 0,
        maxQuantity: 10, // Assuming low stock is less than 10 units
        sortBy: "quantity",
        sortOrder: "asc",
      });

      return res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      logger.error("Failed to get low stock alerts:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get low stock alerts",
      });
    }
  }

  async getInventoryMovements(req: Request, res: Response) {
    try {
      // We'll implement this when needed - it requires the stock transactions model
      return res.status(501).json({
        success: false,
        error: "Not implemented yet",
      });
    } catch (error) {
      logger.error("Failed to get inventory movements:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get inventory movements",
      });
    }
  }
}
