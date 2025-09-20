import { Router } from "express";
import { BomController } from "../controllers/bom.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createBOMValidator,
  updateBOMValidator,
} from "../validators/bom.validator";
import { checkPermission, Permissions } from "../middleware/rbac.middleware";

const router = Router();
const controller = new BomController();

// Create new BOM
router.post(
  "/",
  validate(createBOMValidator),
  checkPermission(Permissions.MANAGE_BOMS),
  controller.create.bind(controller)
);

// Get all BOMs with optional filters
router.get(
  "/",
  checkPermission(Permissions.VIEW_BOMS),
  controller.list.bind(controller)
);

// Get BOM by ID
router.get(
  "/:id",
  checkPermission(Permissions.VIEW_BOMS),
  controller.getById.bind(controller)
);

// Update BOM
router.put(
  "/:id",
  validate(updateBOMValidator),
  checkPermission(Permissions.MANAGE_BOMS),
  controller.update.bind(controller)
);

// Delete BOM
router.delete(
  "/:id",
  checkPermission(Permissions.MANAGE_BOMS),
  controller.delete.bind(controller)
);

// Activate/Deactivate BOM
router.patch(
  "/:id/toggle-active",
  checkPermission(Permissions.ACTIVATE_BOMS),
  controller.toggleActive.bind(controller)
);

// Get BOM components cost
router.get(
  "/:id/cost",
  checkPermission(Permissions.VIEW_BOMS),
  controller.calculateCost.bind(controller)
);

// Get all products using this component
router.get(
  "/:id/usage",
  checkPermission(Permissions.VIEW_BOMS),
  controller.getUsage.bind(controller)
);

export default router;
