import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createProductValidator,
  updateProductValidator,
} from "../validators/product.validator";
import { checkPermission, Permissions } from "../middleware/rbac.middleware";

const router = Router();
const controller = new ProductController();

router.post(
  "/",
  validate(createProductValidator),
  checkPermission(Permissions.MANAGE_PRODUCTS),
  controller.create.bind(controller)
);

router.get(
  "/",
  checkPermission(Permissions.VIEW_PRODUCTS),
  controller.list.bind(controller)
);

router.get(
  "/:id",
  checkPermission(Permissions.VIEW_PRODUCTS),
  controller.getById.bind(controller)
);

router.put(
  "/:id",
  validate(updateProductValidator),
  checkPermission(Permissions.MANAGE_PRODUCTS),
  controller.update.bind(controller)
);

router.delete(
  "/:id",
  checkPermission(Permissions.MANAGE_PRODUCTS),
  controller.delete.bind(controller)
);

export default router;
