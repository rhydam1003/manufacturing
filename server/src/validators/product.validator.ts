import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Product code is required")
    .matches(/^[A-Z0-9-]+$/)
    .withMessage(
      "Product code must contain only uppercase letters, numbers and hyphens"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("unitOfMeasure")
    .trim()
    .notEmpty()
    .withMessage("Unit of measure is required"),

  body("cost")
    .isNumeric()
    .withMessage("Cost must be a number")
    .isFloat({ min: 0 })
    .withMessage("Cost cannot be negative"),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Each tag cannot exceed 20 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("code")
    .optional()
    .trim()
    .matches(/^[A-Z0-9-]+$/)
    .withMessage(
      "Product code must contain only uppercase letters, numbers and hyphens"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("unitOfMeasure").optional().trim(),

  body("cost")
    .optional()
    .isNumeric()
    .withMessage("Cost must be a number")
    .isFloat({ min: 0 })
    .withMessage("Cost cannot be negative"),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Each tag cannot exceed 20 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
