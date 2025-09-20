import { body } from "express-validator";

export const createManufacturingOrderValidator = [
  body("productId").isMongoId().withMessage("Valid product ID is required"),
  body("quantity")
    .isFloat({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),
  body("plannedStartDate")
    .optional()
    .isISO8601()
    .withMessage("Planned start date must be a valid date"),
  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid date"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("notes").optional().isString().trim(),
  body("bomId").optional().isMongoId().withMessage("Valid BOM ID is required"),
];

export const updateManufacturingOrderValidator = [
  body("quantity")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),
  body("plannedStartDate")
    .optional()
    .isISO8601()
    .withMessage("Planned start date must be a valid date"),
  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid date"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
  body("notes").optional().isString().trim(),
];
