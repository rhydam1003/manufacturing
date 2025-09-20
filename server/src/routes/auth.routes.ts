import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { authenticate } from "../middleware/auth.middleware";
import {
  loginValidation,
  registerValidation,
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

export default router;
