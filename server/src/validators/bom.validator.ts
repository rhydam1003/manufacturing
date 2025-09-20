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

  body("components")
    .isArray({ min: 1 })
    .withMessage("At least one component is required"),

  body("components.*.productId")
    .notEmpty()
    .withMessage("Component product ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid component product ID format"),

  body("components.*.quantity")
    .isNumeric()
    .withMessage("Component quantity must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Component quantity must be greater than 0"),

  body("components.*.unitOfMeasure")
    .trim()
    .notEmpty()
    .withMessage("Component unit of measure is required"),

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

  body("components")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one component is required"),

  body("components.*.productId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid component product ID format"),

  body("components.*.quantity")
    .optional()
    .isNumeric()
    .withMessage("Component quantity must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Component quantity must be greater than 0"),

  body("components.*.unitOfMeasure").optional().trim(),

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
