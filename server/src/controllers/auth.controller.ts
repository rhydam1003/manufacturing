import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { OTPService } from "../services/otp.service";
import { logger } from "../utils/logger";
import { RequestWithUser } from "../types";

export class AuthController {
  private userService: UserService;
  private authService: AuthService;
  private otpService: OTPService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
    this.otpService = new OTPService();
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

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      // Check if user exists
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Generate OTP
      const otp = await this.otpService.generateOTPForEmail(email, "password_reset");
      
      // In a real application, you would send this OTP via email/SMS
      // For now, we'll return it in the response (remove in production)
      logger.info(`Password reset OTP for ${email}: ${otp}`);
      
      res.json({
        success: true,
        message: "OTP sent to your email",
        // Remove this in production
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    } catch (error: any) {
      logger.error("Forgot password error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;
      
      // Verify OTP
      const isValidOTP = await this.otpService.verifyOTP(email, otp, "password_reset");
      if (!isValidOTP) {
        return res.status(400).json({
          success: false,
          error: "Invalid or expired OTP",
        });
      }

      // Update password
      await this.userService.updateUser(email, { password: newPassword });
      
      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error: any) {
      logger.error("Reset password error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      
      // Verify OTP
      const isValidOTP = await this.otpService.verifyOTP(email, otp, "email_verification");
      if (!isValidOTP) {
        return res.status(400).json({
          success: false,
          error: "Invalid or expired OTP",
        });
      }

      // Update user as verified (you might want to add a verified field to user model)
      await this.userService.updateUser(email, { isActive: true });
      
      res.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error: any) {
      logger.error("Email verification error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
