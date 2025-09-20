import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  sku: string;
  name: string;
  unit: string;
  type: "Raw" | "Finished";
  defaultWarehouseId: Types.ObjectId;
  cost?: number;
  category?: string;
}

const productSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    type: { type: String, enum: ["Raw", "Finished"], required: true },
    defaultWarehouseId: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    cost: { type: Number, default: 0 },
    category: { type: String },
  },
  {
    collection: "products",
  }
);

export const Product = model<IProduct>("Product", productSchema);
