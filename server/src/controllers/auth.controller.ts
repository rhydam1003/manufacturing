import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { logger } from "../utils/logger";
import { RequestWithUser } from "../types";

export class AuthController {
  private userService: UserService;
  private authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await this.authService.login(
        email,
        password
      );

      // Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        accessToken,
        user,
      });
    } catch (error) {
      logger.error("Login failed:", error);
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      const { accessToken, refreshToken } =
        await this.authService.generateTokens(user);

      // Set refresh token in HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(201).json({
        accessToken,
        user,
      });
    } catch (error) {
      logger.error("Registration failed:", error);
      return res.status(400).json({
        message: "Registration failed",
      });
    }
  }

  async getCurrentUser(req: RequestWithUser, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Not authenticated",
        });
      }

      return res.json(req.user);
    } catch (error) {
      logger.error("Get current user failed:", error);
      return res.status(500).json({
        message: "Failed to get current user",
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({
          message: "Refresh token not found",
        });
      }

      const { accessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      // Set new refresh token in HTTP-only cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        accessToken,
      });
    } catch (error) {
      logger.error("Token refresh failed:", error);
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        await this.authService.revokeRefreshToken(refreshToken);
      }

      res.clearCookie("refreshToken");
      return res.json({
        message: "Logged out successfully",
      });
    } catch (error) {
      logger.error("Logout failed:", error);
      return res.status(500).json({
        message: "Logout failed",
      });
    }
  }
}
