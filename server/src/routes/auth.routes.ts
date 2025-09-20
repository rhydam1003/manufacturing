import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { authenticate } from "../middleware/auth.middleware";
import {
  loginValidation,
  registerValidation,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from "../validation/auth.validation";

const router = Router();
const controller = new AuthController();

// Login route
router.post(
  "/login",
  validate(loginValidation),
  controller.login.bind(controller)
);

// Register route
router.post(
  "/register",
  validate(registerValidation),
  controller.register.bind(controller)
);

// Get current user
router.get("/me", authenticate, controller.getCurrentUser.bind(controller));

// Refresh token
router.post("/refresh-token", controller.refreshToken.bind(controller));

// Logout
router.post("/logout", authenticate, controller.logout.bind(controller));

// Forgot password
router.post(
  "/forgot-password",
  validate(forgotPasswordValidator),
  controller.forgotPassword.bind(controller)
);

// Reset password
router.post(
  "/reset-password",
  validate(resetPasswordValidator),
  controller.resetPassword.bind(controller)
);

// Verify email
router.post(
  "/verify-email",
  validate(verifyEmailValidator),
  controller.verifyEmail.bind(controller)
);

export default router;
