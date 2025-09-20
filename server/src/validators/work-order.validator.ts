import { body } from "express-validator";
import mongoose from "mongoose";

export const createWorkOrderValidator = [
  body("moId")
    .notEmpty()
    .withMessage("Manufacturing Order ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Manufacturing Order ID format"),

  body("sequence")
    .isInt({ min: 1 })
    .withMessage("Sequence must be a positive integer"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Work order name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Work order name must be between 2 and 100 characters"),

  body("workCenterId")
    .notEmpty()
    .withMessage("Work Center ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Work Center ID format"),

  body("plannedMinutes")
    .isNumeric()
    .withMessage("Planned minutes must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Planned minutes must be greater than 0"),

  body("operatorId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Operator ID format"),

  body("comments")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comments cannot exceed 500 characters"),
];

export const updateWorkOrderValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Work order name must be between 2 and 100 characters"),

  body("plannedMinutes")
    .optional()
    .isNumeric()
    .withMessage("Planned minutes must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Planned minutes must be greater than 0"),

  body("operatorId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Operator ID format"),

  body("comments")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comments cannot exceed 500 characters"),
];

export const startWorkOrderValidator = [
  body("operatorId")
    .notEmpty()
    .withMessage("Operator ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Operator ID format"),
];

export const completeWorkOrderValidator = [
  body("actualMinutes")
    .isNumeric()
    .withMessage("Actual minutes must be a number")
    .isFloat({ min: 0 })
    .withMessage("Actual minutes cannot be negative"),

  body("comments")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comments cannot exceed 500 characters"),
];

export const pauseWorkOrderValidator = [
  body("comments")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comments cannot exceed 500 characters"),
];

export const cancelWorkOrderValidator = [
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Reason cannot exceed 500 characters"),
];
