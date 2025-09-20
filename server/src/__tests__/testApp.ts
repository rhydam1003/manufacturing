import express from "express";
import cors from "cors";
import { errorHandler } from "../middleware/error.middleware";
import productRoutes from "../routes/product.routes";
import bomRoutes from "../routes/bom.routes";
import { NextFunction, Request, Response } from "express";

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
  // Allow GET requests without authentication for better test isolation
  if (req.method === "GET") {
    req.user = {
      _id: "mockUserId",
      permissions: ["VIEW_PRODUCTS", "VIEW_BOM", "VIEW_INVENTORY"],
    };
    return next();
  }

  // For non-GET requests, check auth header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "No token provided",
    });
  }

  // Mock successful auth
  req.user = {
    _id: "mockUserId",
    permissions: ["MANAGE_PRODUCTS", "VIEW_PRODUCTS", "MANAGE_BOM", "VIEW_BOM"],
  };
  next();
};

const app = express();

app.use(cors());
app.use(express.json());

// Apply mock auth middleware for tests
app.use(mockAuthMiddleware);

// Only mount the routes we're testing
app.use("/api/products", productRoutes);
app.use("/api/bom", bomRoutes);

app.use(errorHandler);

export { app };
