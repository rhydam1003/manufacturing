import { Schema, model, Document } from "mongoose";

export interface IWarehouse extends Document {
  name: string;
  code: string;
  location: string;
  address?: string;
  capacity?: number;
  isActive: boolean;
  managerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const warehouseSchema = new Schema<IWarehouse>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      index: true 
    },
    code: { 
      type: String, 
      required: true, 
      unique: true,
      uppercase: true,
      trim: true,
      index: true 
    },
    location: { 
      type: String, 
      required: true,
      trim: true 
    },
    address: { 
      type: String, 
      trim: true 
    },
    capacity: { 
      type: Number, 
      min: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    managerId: { 
      type: String,
      trim: true 
    },
  },
  {
    timestamps: true,
    collection: "warehouses",
  }
);

// Index for efficient queries
warehouseSchema.index({ code: 1, isActive: 1 });
warehouseSchema.index({ location: 1 });

export const Warehouse = model<IWarehouse>("Warehouse", warehouseSchema);