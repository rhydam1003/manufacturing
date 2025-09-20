import { Schema, model, Document } from "mongoose";

export interface IWarehouse extends Document {
  name: string;
  code: string;
}

const warehouseSchema = new Schema<IWarehouse>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
  },
  {
    collection: "warehouses",
  }
);

export const Warehouse = model<IWarehouse>("Warehouse", warehouseSchema);
