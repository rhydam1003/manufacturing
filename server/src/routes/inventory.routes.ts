import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { validate } from "../middleware/validation.middleware";
import {
  adjustStockValidator,
  transferStockValidator,
} from "../validators/inventory.validator";
import { checkPermission, Permissions } from "../middleware/rbac.middleware";

const router = Router();
const controller = new InventoryController();

// Get inventory levels
router.get(
  "/",
  checkPermission(Permissions.VIEW_INVENTORY),
  controller.getInventoryLevels.bind(controller)
);

// Get inventory by product
router.get(
  "/product/:productId",
  checkPermission(Permissions.VIEW_INVENTORY),
  controller.getProductInventory.bind(controller)
);

// Adjust inventory
router.post(
  "/adjust",
  validate(adjustStockValidator),
  checkPermission(Permissions.MANAGE_INVENTORY),
  controller.adjustInventory.bind(controller)
);

// Transfer stock between warehouses
router.post(
  "/transfer",
  validate(transferStockValidator),
  checkPermission(Permissions.TRANSFER_STOCK),
  controller.transferStock.bind(controller)
);

// Get low stock alerts
router.get(
  "/alerts",
  checkPermission(Permissions.VIEW_INVENTORY),
  controller.getLowStockAlerts.bind(controller)
);

export default router;
