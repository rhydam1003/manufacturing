import { Schema, model, Document, Types } from "mongoose";

export interface IManufacturingOrder extends Document {
  code: string;
  productId: Types.ObjectId;
  qtyPlanned: number;
  qtyProduced: number;
  status: "Planned" | "In Progress" | "Done" | "Canceled";
  scheduleStart: Date;
  scheduleEnd: Date;
  assigneeId: Types.ObjectId;
  priority: "Low" | "Medium" | "High" | "Urgent";
  notes?: string;
  bomId?: Types.ObjectId;
  workOrders?: Types.ObjectId[];
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const manufacturingOrderSchema = new Schema<IManufacturingOrder>(
  {
    code: { type: String, required: true, unique: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qtyPlanned: { type: Number, required: true, min: 1 },
    qtyProduced: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Done", "Canceled"],
      default: "Planned",
      index: true,
    },
    scheduleStart: { type: Date, required: true },
    scheduleEnd: { type: Date, required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User" },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    notes: String,
    bomId: { type: Schema.Types.ObjectId, ref: "BOM" },
    workOrders: [{ type: Schema.Types.ObjectId, ref: "WorkOrder" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    collection: "manufacturing_orders",
  }
);

manufacturingOrderSchema.index({ status: 1, scheduleStart: 1 });
manufacturingOrderSchema.index({ productId: 1, status: 1 });
manufacturingOrderSchema.index({ assigneeId: 1, status: 1 });

export const ManufacturingOrder = model<IManufacturingOrder>(
  "ManufacturingOrder",
  manufacturingOrderSchema
);
