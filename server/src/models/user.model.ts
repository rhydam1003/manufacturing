import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  role: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User = model<IUser>("User", userSchema);
