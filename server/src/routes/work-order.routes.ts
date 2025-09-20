import { Router } from "express";
import { WorkOrderController } from "../controllers/work-order.controller";
import { checkPermission } from "../middleware/rbac.middleware";
import { Permissions } from "../middleware/rbac.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createWorkOrderValidator,
  updateWorkOrderValidator,
  startWorkOrderValidator,
  completeWorkOrderValidator,
  pauseWorkOrderValidator,
  cancelWorkOrderValidator,
} from "../validators/work-order.validator";

const router = Router();
const controller = new WorkOrderController();

// Work Order CRUD routes
router.get(
  "/",
  checkPermission(Permissions.VIEW_WORK_ORDERS),
  controller.list.bind(controller)
);

router.post(
  "/",
  checkPermission(Permissions.MANAGE_WORK_ORDERS),
  validate(createWorkOrderValidator),
  controller.create.bind(controller)
);

router.get(
  "/stats",
  checkPermission(Permissions.VIEW_WORK_ORDERS),
  controller.getStats.bind(controller)
);

router.get(
  "/:id",
  checkPermission(Permissions.VIEW_WORK_ORDERS),
  controller.getById.bind(controller)
);

router.put(
  "/:id",
  checkPermission(Permissions.MANAGE_WORK_ORDERS),
  validate(updateWorkOrderValidator),
  controller.update.bind(controller)
);

router.delete(
  "/:id",
  checkPermission(Permissions.MANAGE_WORK_ORDERS),
  controller.delete.bind(controller)
);

// Work Order status management routes
router.post(
  "/:id/start",
  checkPermission(Permissions.UPDATE_WORK_STATUS),
  validate(startWorkOrderValidator),
  controller.start.bind(controller)
);

router.post(
  "/:id/pause",
  checkPermission(Permissions.UPDATE_WORK_STATUS),
  validate(pauseWorkOrderValidator),
  controller.pause.bind(controller)
);

router.post(
  "/:id/complete",
  checkPermission(Permissions.UPDATE_WORK_STATUS),
  validate(completeWorkOrderValidator),
  controller.complete.bind(controller)
);

router.post(
  "/:id/cancel",
  checkPermission(Permissions.UPDATE_WORK_STATUS),
  validate(cancelWorkOrderValidator),
  controller.cancel.bind(controller)
);

export default router;