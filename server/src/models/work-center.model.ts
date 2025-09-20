import { Schema, model, Document } from "mongoose";

export interface IWorkCenter extends Document {
  name: string;
  location: string;
  costPerHour: number;
  isActive: boolean;
  capacity: number;
  downtime: number;
}

const workCenterSchema = new Schema<IWorkCenter>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    costPerHour: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    capacity: { type: Number, required: true },
    downtime: { type: Number, default: 0 },
  },
  {
    collection: "work_centers",
  }
);

export const WorkCenter = model<IWorkCenter>("WorkCenter", workCenterSchema);
