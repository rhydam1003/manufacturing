import { body } from "express-validator";
import mongoose from "mongoose";

export const createBOMValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID format"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("BOM name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("BOM name must be between 2 and 100 characters"),

  body("version")
    .trim()
    .notEmpty()
    .withMessage("Version is required")
    .matches(/^[0-9]+\.[0-9]+\.[0-9]+$/)
    .withMessage("Version must be in semantic versioning format (e.g., 1.0.0)"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one component is required"),

  body("items.*.componentId")
    .notEmpty()
    .withMessage("Component ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid component ID format"),

  body("items.*.qtyPerUnit")
    .isNumeric()
    .withMessage("Quantity per unit must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity per unit must be greater than 0"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

export const updateBOMValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("BOM name must be between 2 and 100 characters"),

  body("version")
    .optional()
    .trim()
    .matches(/^[0-9]+\.[0-9]+\.[0-9]+$/)
    .withMessage("Version must be in semantic versioning format (e.g., 1.0.0)"),

  body("items")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one component is required"),

  body("items.*.componentId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid component ID format"),

  body("items.*.qtyPerUnit")
    .optional()
    .isNumeric()
    .withMessage("Quantity per unit must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Quantity per unit must be greater than 0"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
