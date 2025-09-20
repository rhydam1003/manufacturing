import { Schema, model, Document, Types } from "mongoose";

export interface IInventoryItem extends Document {
  productId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  qtyOnHand: number;
  qtyReserved: number;
}

const inventoryItemSchema = new Schema<IInventoryItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    warehouseId: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    qtyOnHand: { type: Number, required: true },
    qtyReserved: { type: Number, default: 0 },
  },
  {
    collection: "inventory_items",
  }
);

export const InventoryItem = model<IInventoryItem>(
  "InventoryItem",
  inventoryItemSchema
);
