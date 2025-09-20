import { Schema, model, Document } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: "password_reset" | "email_verification" | "login";
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: { 
      type: String, 
      required: true, 
      lowercase: true,
      trim: true,
      index: true 
    },
    otp: { 
      type: String, 
      required: true,
      length: 6 
    },
    type: { 
      type: String, 
      enum: ["password_reset", "email_verification", "login"],
      required: true 
    },
    expiresAt: { 
      type: Date, 
      required: true,
      index: { expireAfterSeconds: 0 } // TTL index
    },
    isUsed: { 
      type: Boolean, 
      default: false 
    },
    attempts: { 
      type: Number, 
      default: 0,
      max: 3 
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "otps",
  }
);

// Compound index for efficient queries
otpSchema.index({ email: 1, type: 1, isUsed: 1 });

export const OTP = model<IOTP>("OTP", otpSchema);
