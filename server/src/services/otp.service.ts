import { OTP } from "../models/otp.model";
import { logger } from "../utils/logger";

export class OTPService {
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateOTPForEmail(
    email: string, 
    type: "password_reset" | "email_verification" | "login"
  ): Promise<string> {
    try {
      // Invalidate existing OTPs for this email and type
      await OTP.updateMany(
        { email, type, isUsed: false },
        { isUsed: true }
      );

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await OTP.create({
        email,
        otp,
        type,
        expiresAt,
      });

      logger.info(`OTP generated for ${email}, type: ${type}`);
      return otp;
    } catch (error) {
      logger.error("Error generating OTP:", error);
      throw new Error("Failed to generate OTP");
    }
  }

  async verifyOTP(
    email: string,
    otp: string,
    type: "password_reset" | "email_verification" | "login"
  ): Promise<boolean> {
    try {
      const otpRecord = await OTP.findOne({
        email,
        otp,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!otpRecord) {
        return false;
      }

      // Mark OTP as used
      otpRecord.isUsed = true;
      await otpRecord.save();

      logger.info(`OTP verified for ${email}, type: ${type}`);
      return true;
    } catch (error) {
      logger.error("Error verifying OTP:", error);
      throw new Error("Failed to verify OTP");
    }
  }

  async incrementOTPAttempts(email: string, otp: string, type: string): Promise<void> {
    try {
      await OTP.updateOne(
        { email, otp, type },
        { $inc: { attempts: 1 } }
      );
    } catch (error) {
      logger.error("Error incrementing OTP attempts:", error);
    }
  }

  async isOTPLocked(email: string, type: string): Promise<boolean> {
    try {
      const otpRecord = await OTP.findOne({
        email,
        type,
        attempts: { $gte: 3 }
      });

      return !!otpRecord;
    } catch (error) {
      logger.error("Error checking OTP lock status:", error);
      return false;
    }
  }
}
