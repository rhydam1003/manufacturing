import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class SecurityUtil {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static generateToken(payload: any, expiresIn: string = "1d"): string {
    return jwt.sign(payload, process.env.JWT_SECRET || "", { expiresIn });
  }
}

export class ValidationUtil {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    return phoneRegex.test(phone);
  }

  static isValidObjectId(id: string): boolean {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  }
}

export class DateUtil {
  static now(): Date {
    return new Date();
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static startOfDay(date: Date): Date {
    return new Date(date.setHours(0, 0, 0, 0));
  }

  static endOfDay(date: Date): Date {
    return new Date(date.setHours(23, 59, 59, 999));
  }

  static formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  static formatDateTime(date: Date): string {
    return date.toISOString();
  }
}
