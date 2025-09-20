import { body } from "express-validator";
import mongoose from "mongoose";

export const adjustStockValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID format"),

  body("warehouseId")
    .notEmpty()
    .withMessage("Warehouse ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid warehouse ID format"),

  body("quantity")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity must be greater than 0"),

  body("type")
    .isIn(["increase", "decrease"])
    .withMessage("Type must be either increase or decrease"),

  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason is required")
    .isLength({ max: 200 })
    .withMessage("Reason cannot exceed 200 characters"),
];

export const transferStockValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID format"),

  body("sourceWarehouseId")
    .notEmpty()
    .withMessage("Source warehouse ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid source warehouse ID format"),

  body("targetWarehouseId")
    .notEmpty()
    .withMessage("Target warehouse ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid target warehouse ID format")
    .custom((value, { req }) => value !== req.body.sourceWarehouseId)
    .withMessage("Source and target warehouses must be different"),

  body("quantity")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity must be greater than 0"),

  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason is required")
    .isLength({ max: 200 })
    .withMessage("Reason cannot exceed 200 characters"),
];
