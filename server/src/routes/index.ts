import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import bomRoutes from "./bom.routes";
import inventoryRoutes from "./inventory.routes";
import manufacturingOrderRoutes from "./manufacturing-order.routes";
import workOrderRoutes from "./work-order.routes";
import workCenterRoutes from "./work-center.routes";
import reportRoutes from "./report.routes";
import attachmentRoutes from "./attachment.routes";
import dashboardRoutes from "./dashboard.routes";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes
router.use("/products", authenticate, productRoutes);
router.use("/bom", authenticate, bomRoutes);
router.use("/inventory", authenticate, inventoryRoutes);
router.use("/manufacturing-orders", authenticate, manufacturingOrderRoutes);
router.use("/work-orders", authenticate, workOrderRoutes);
router.use("/work-centers", authenticate, workCenterRoutes);
router.use("/reports", authenticate, reportRoutes);
router.use("/attachments", authenticate, attachmentRoutes);
router.use("/dashboard", authenticate, dashboardRoutes);

export default router;
