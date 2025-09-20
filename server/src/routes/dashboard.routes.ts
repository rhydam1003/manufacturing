import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { checkPermission } from "../middleware/rbac.middleware";
import { Permissions } from "../middleware/rbac.middleware";

const router = Router();
const controller = new DashboardController();

// Dashboard routes
router.get(
  "/stats",
  checkPermission(Permissions.VIEW_REPORTS),
  controller.getStats.bind(controller)
);

router.get(
  "/recent-activity",
  checkPermission(Permissions.VIEW_REPORTS),
  controller.getRecentActivity.bind(controller)
);

router.get(
  "/alerts",
  checkPermission(Permissions.VIEW_REPORTS),
  controller.getAlerts.bind(controller)
);

export default router;
