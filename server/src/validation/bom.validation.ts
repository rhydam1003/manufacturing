import { body } from "express-validator";

export const createBomValidator = [
  body("productId").isMongoId().withMessage("Valid product ID is required"),
  body("name").isString().trim().notEmpty().withMessage("BOM name is required"),
  body("description").optional().isString().trim(),
  body("components")
    .isArray()
    .withMessage("Components must be an array")
    .notEmpty()
    .withMessage("At least one component is required"),
  body("components.*.productId")
    .isMongoId()
    .withMessage("Valid component product ID is required"),
  body("components.*.quantity")
    .isFloat({ gt: 0 })
    .withMessage("Component quantity must be greater than 0"),
  body("components.*.unit")
    .isString()
    .notEmpty()
    .withMessage("Component unit is required"),
  body("version").optional().isString().trim(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const updateBomValidator = [
  body("name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("BOM name cannot be empty"),
  body("description").optional().isString().trim(),
  body("components")
    .optional()
    .isArray()
    .withMessage("Components must be an array")
    .notEmpty()
    .withMessage("At least one component is required"),
  body("components.*.productId")
    .optional()
    .isMongoId()
    .withMessage("Valid component product ID is required"),
  body("components.*.quantity")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Component quantity must be greater than 0"),
  body("components.*.unit")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Component unit is required"),
  body("version").optional().isString().trim(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];
