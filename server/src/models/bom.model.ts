import { Schema, model, Document, Types } from "mongoose";

interface BOMItem {
  componentId: Types.ObjectId;
  qtyPerUnit: number;
}

interface BOMOperation {
  name: string;
  workCenterId: Types.ObjectId;
  duration: number; // in minutes
}

export interface IBOM extends Document {
  productId: Types.ObjectId;
  name: string;
  version: string;
  isActive: boolean;
  items: BOMItem[];
  operations: BOMOperation[];
}

const bomSchema = new Schema<IBOM>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    version: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    items: [
      {
        componentId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qtyPerUnit: { type: Number, required: true },
      },
    ],
    operations: [
      {
        name: { type: String, required: true },
        workCenterId: {
          type: Schema.Types.ObjectId,
          ref: "WorkCenter",
          required: true,
        },
        duration: { type: Number, required: true },
      },
    ],
  },
  {
    collection: "boms",
  }
);

export const BOM = model<IBOM>("BOM", bomSchema);
