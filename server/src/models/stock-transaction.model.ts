import { Schema, model, Document, Types } from "mongoose";

export interface IStockTransaction extends Document {
  productId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  type: "IN" | "OUT" | "RESERVE" | "RELEASE";
  qty: number;
  refType: string;
  refId: Types.ObjectId;
  createdAt: Date;
}

const stockTransactionSchema = new Schema<IStockTransaction>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    warehouseId: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    type: {
      type: String,
      enum: ["IN", "OUT", "RESERVE", "RELEASE"],
      required: true,
    },
    qty: { type: Number, required: true },
    refType: { type: String, required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "stock_transactions",
  }
);

export const StockTransaction = model<IStockTransaction>(
  "StockTransaction",
  stockTransactionSchema
);
