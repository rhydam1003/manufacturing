import { body } from "express-validator";

export const createWorkCenterValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Work center name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Work center name must be between 2 and 100 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),

  body("costPerHour")
    .isNumeric()
    .withMessage("Cost per hour must be a number")
    .isFloat({ min: 0 })
    .withMessage("Cost per hour cannot be negative"),

  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),

  body("downtime")
    .optional()
    .isNumeric()
    .withMessage("Downtime must be a number")
    .isFloat({ min: 0 })
    .withMessage("Downtime cannot be negative"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const updateWorkCenterValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Work center name must be between 2 and 100 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),

  body("costPerHour")
    .optional()
    .isNumeric()
    .withMessage("Cost per hour must be a number")
    .isFloat({ min: 0 })
    .withMessage("Cost per hour cannot be negative"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),

  body("downtime")
    .optional()
    .isNumeric()
    .withMessage("Downtime must be a number")
    .isFloat({ min: 0 })
    .withMessage("Downtime cannot be negative"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const updateDowntimeValidator = [
  body("downtime")
    .isNumeric()
    .withMessage("Downtime must be a number")
    .isFloat({ min: 0 })
    .withMessage("Downtime cannot be negative"),
];
