import { Schema, model, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      index: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    permissions: [{ 
      type: String, 
      required: true 
    }],
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  {
    timestamps: true,
    collection: "roles",
  }
);

// Index for efficient permission queries
roleSchema.index({ permissions: 1 });
roleSchema.index({ isActive: 1 });

export const Role = model<IRole>("Role", roleSchema);