import { Router } from "express";
import { checkPermission, Permissions } from "../middleware/rbac.middleware";
import { validate } from "../middleware/validation.middleware";
import { ManufacturingOrderController } from "../controllers/manufacturing-order.controller";
import {
  createManufacturingOrderValidator,
  updateManufacturingOrderValidator,
} from "../validation/manufacturing-order.validation";

const router = Router();
const controller = new ManufacturingOrderController();

/**
 * @route POST /api/manufacturing-orders
 * @desc Create a new manufacturing order
 * @access Private
 */
router.post(
  "/",
  validate(createManufacturingOrderValidator),
  checkPermission(Permissions.MANAGE_MANUFACTURING),
  controller.create.bind(controller)
);

/**
 * @route GET /api/manufacturing-orders
 * @desc Get all manufacturing orders with filters
 * @access Private
 */
router.get(
  "/",
  checkPermission(Permissions.VIEW_MANUFACTURING),
  controller.list.bind(controller)
);

/**
 * @route GET /api/manufacturing-orders/:id
 * @desc Get manufacturing order by ID
 * @access Private
 */
router.get(
  "/:id",
  checkPermission(Permissions.VIEW_MANUFACTURING),
  controller.getById.bind(controller)
);

/**
 * @route PUT /api/manufacturing-orders/:id
 * @desc Update a manufacturing order
 * @access Private
 */
router.put(
  "/:id",
  validate(updateManufacturingOrderValidator),
  checkPermission(Permissions.MANAGE_MANUFACTURING),
  controller.update.bind(controller)
);

/**
 * @route DELETE /api/manufacturing-orders/:id
 * @desc Delete a manufacturing order
 * @access Private
 */
router.delete(
  "/:id",
  checkPermission(Permissions.MANAGE_MANUFACTURING),
  controller.delete.bind(controller)
);

/**
 * @route POST /api/manufacturing-orders/:id/start
 * @desc Start production of a manufacturing order
 * @access Private
 */
router.post(
  "/:id/start",
  checkPermission(Permissions.MANAGE_MANUFACTURING),
  controller.startProduction.bind(controller)
);

/**
 * @route POST /api/manufacturing-orders/:id/complete
 * @desc Mark a manufacturing order as completed
 * @access Private
 */
router.post(
  "/:id/complete",
  checkPermission(Permissions.MANAGE_MANUFACTURING),
  controller.completeProduction.bind(controller)
);

/**
 * @route POST /api/manufacturing-orders/:id/cancel
 * @desc Cancel a manufacturing order
 * @access Private
 */
router.post(
  "/:id/cancel",
  checkPermission(Permissions.MANAGE_MANUFACTURING),
  controller.cancelOrder.bind(controller)
);

/**
 * @route GET /api/manufacturing-orders/:id/work-orders
 * @desc Get all work orders associated with a manufacturing order
 * @access Private
 */
router.get(
  "/:id/work-orders",
  checkPermission(Permissions.VIEW_MANUFACTURING),
  controller.getWorkOrders.bind(controller)
);

/**
 * @route GET /api/manufacturing-orders/:id/materials
 * @desc Get material requirements for a manufacturing order
 * @access Private
 */
router.get(
  "/:id/materials",
  checkPermission(Permissions.VIEW_MANUFACTURING),
  controller.getMaterialRequirements.bind(controller)
);

export default router;
