import { Router } from "express";
import { WorkCenterController } from "../controllers/work-center.controller";
import { checkPermission } from "../middleware/rbac.middleware";
import { Permissions } from "../middleware/rbac.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createWorkCenterValidator,
  updateWorkCenterValidator,
  updateDowntimeValidator,
} from "../validators/work-center.validator";

const router = Router();
const controller = new WorkCenterController();

// Work Center CRUD routes
router.get(
  "/",
  checkPermission(Permissions.VIEW_WORK_CENTERS),
  controller.list.bind(controller)
);

router.post(
  "/",
  checkPermission(Permissions.MANAGE_WORK_CENTERS),
  validate(createWorkCenterValidator),
  controller.create.bind(controller)
);

router.get(
  "/stats",
  checkPermission(Permissions.VIEW_WORK_CENTERS),
  controller.getStats.bind(controller)
);

router.get(
  "/utilization",
  checkPermission(Permissions.VIEW_WORK_CENTERS),
  controller.getAllUtilization.bind(controller)
);

router.get(
  "/:id",
  checkPermission(Permissions.VIEW_WORK_CENTERS),
  controller.getById.bind(controller)
);

router.put(
  "/:id",
  checkPermission(Permissions.MANAGE_WORK_CENTERS),
  validate(updateWorkCenterValidator),
  controller.update.bind(controller)
);

router.delete(
  "/:id",
  checkPermission(Permissions.MANAGE_WORK_CENTERS),
  controller.delete.bind(controller)
);

// Work Center specific routes
router.get(
  "/:id/utilization",
  checkPermission(Permissions.VIEW_WORK_CENTERS),
  controller.getUtilization.bind(controller)
);

router.put(
  "/:id/downtime",
  checkPermission(Permissions.MANAGE_WORK_CENTERS),
  validate(updateDowntimeValidator),
  controller.updateDowntime.bind(controller)
);

export default router;