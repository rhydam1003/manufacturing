import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { UserService } from "./user.service";
import { logger } from "../utils/logger";
import { IUser } from "../models/user.model";
import { Types } from "mongoose";

interface TokenPayload {
  id: string;
  email: string;
  role: Types.ObjectId;
}

export class AuthService {
  private userService: UserService;
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly REFRESH_TOKEN_EXPIRY: number = 7 * 24 * 60 * 60; // 7 days in seconds
  private readonly ACCESS_TOKEN_EXPIRY: number = 15 * 60; // 15 minutes in seconds

  constructor() {
    this.userService = new UserService();
    this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    this.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async generateTokens(
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = {
      id: user._id as unknown as string,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(
      { id: user._id as unknown as string },
      this.JWT_REFRESH_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    // Store refresh token in database or Redis
    await this.storeRefreshToken(user._id as unknown as string, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as {
        id: string;
      };
      const user = await this.userService.getUserById(decoded.id);

      if (
        !user ||
        !this.isRefreshTokenValid(user._id as unknown as string, refreshToken)
      ) {
        throw new Error("Invalid refresh token");
      }

      const tokens = await this.generateTokens(user);
      await this.revokeRefreshToken(refreshToken);

      return {
        accessToken: tokens.accessToken,
        newRefreshToken: tokens.refreshToken,
      };
    } catch (error) {
      logger.error("Error refreshing token:", error);
      throw new Error("Invalid refresh token");
    }
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    // Implement token revocation logic (e.g., remove from database or Redis)
    // This is a placeholder implementation
    logger.info("Revoking refresh token:", refreshToken);
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    // Implement token storage logic (e.g., store in database or Redis)
    // This is a placeholder implementation
    logger.info("Storing refresh token for user:", userId);
  }

  private async isRefreshTokenValid(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    // Implement token validation logic (e.g., check in database or Redis)
    // This is a placeholder implementation
    return true;
  }
}
