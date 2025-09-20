import { body } from "express-validator";
import mongoose from "mongoose";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required")
    .matches(/^[A-Z0-9-]+$/)
    .withMessage(
      "SKU must contain only uppercase letters, numbers and hyphens"
    ),

  body("unit")
    .trim()
    .notEmpty()
    .withMessage("Unit is required"),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["Raw", "Finished"])
    .withMessage("Type must be either 'Raw' or 'Finished'"),

  body("defaultWarehouseId")
    .notEmpty()
    .withMessage("Default warehouse ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid warehouse ID format"),

  body("cost")
    .optional()
    .isNumeric()
    .withMessage("Cost must be a number")
    .isFloat({ min: 0 })
    .withMessage("Cost cannot be negative"),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("sku")
    .optional()
    .trim()
    .matches(/^[A-Z0-9-]+$/)
    .withMessage(
      "SKU must contain only uppercase letters, numbers and hyphens"
    ),

  body("unit").optional().trim(),

  body("type")
    .optional()
    .trim()
    .isIn(["Raw", "Finished"])
    .withMessage("Type must be either 'Raw' or 'Finished'"),

  body("defaultWarehouseId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid warehouse ID format"),

  body("cost")
    .optional()
    .isNumeric()
    .withMessage("Cost must be a number")
    .isFloat({ min: 0 })
    .withMessage("Cost cannot be negative"),
];
