import express from "express";
import cors from "cors";
import { errorHandler } from "../middleware/error.middleware";
import { NextFunction, Request, Response } from "express";
import { ProductController } from "../controllers/product.controller";
import { BomController } from "../controllers/bom.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createProductValidator,
  updateProductValidator,
} from "../validators/product.validator";
import {
  createBOMValidator,
  updateBOMValidator,
} from "../validators/bom.validator";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        permissions: string[];
      };
    }
  }
}

// Mock auth middleware for tests
const mockAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Always set mock user for tests
  req.user = {
    _id: "mockUserId",
    permissions: ["MANAGE_PRODUCTS", "VIEW_PRODUCTS", "MANAGE_BOMS", "VIEW_BOMS", "ACTIVATE_BOMS", "VIEW_INVENTORY"],
  };
  next();
};

// Mock RBAC middleware for tests
const mockRBACMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip RBAC checks in tests
  next();
};

const app = express();

app.use(cors());
app.use(express.json());

// Apply mock auth middleware for tests
app.use(mockAuthMiddleware);

// Create controllers
const productController = new ProductController();
const bomController = new BomController();

// Define test routes without RBAC middleware
app.post(
  "/api/products",
  validate(createProductValidator),
  productController.create.bind(productController)
);

app.get(
  "/api/products",
  productController.list.bind(productController)
);

app.get(
  "/api/products/:id",
  productController.getById.bind(productController)
);

app.put(
  "/api/products/:id",
  validate(updateProductValidator),
  productController.update.bind(productController)
);

app.delete(
  "/api/products/:id",
  productController.delete.bind(productController)
);

// Note: Inventory functionality is handled by separate inventory controller
// For now, we'll skip this route in tests

// BOM routes
app.post(
  "/api/bom",
  validate(createBOMValidator),
  bomController.create.bind(bomController)
);

app.get(
  "/api/bom",
  bomController.list.bind(bomController)
);

app.get(
  "/api/bom/:id",
  bomController.getById.bind(bomController)
);

app.put(
  "/api/bom/:id",
  validate(updateBOMValidator),
  bomController.update.bind(bomController)
);

app.delete(
  "/api/bom/:id",
  bomController.delete.bind(bomController)
);

app.post(
  "/api/bom/:id/toggle-active",
  bomController.toggleActive.bind(bomController)
);

app.get(
  "/api/bom/:id/cost",
  bomController.calculateCost.bind(bomController)
);

app.get(
  "/api/bom/product/:id/usage",
  bomController.getUsage.bind(bomController)
);

app.use(errorHandler);

export { app };
