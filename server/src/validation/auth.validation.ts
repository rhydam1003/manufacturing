import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

export const registerValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("role").isMongoId().withMessage("Please provide a valid role ID"),
];
