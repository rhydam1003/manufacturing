import { Schema, model, Document, Types } from "mongoose";

export interface IWorkOrder extends Document {
  moId: Types.ObjectId;
  sequence: number;
  name: string;
  workCenterId: Types.ObjectId;
  status: "Queued" | "Started" | "Completed" | "Canceled";
  plannedMinutes: number;
  actualMinutes: number;
  startedAt?: Date;
  completedAt?: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

const workOrderSchema = new Schema<IWorkOrder>(
  {
    moId: {
      type: Schema.Types.ObjectId,
      ref: "ManufacturingOrder",
      required: true,
    },
    sequence: { type: Number, required: true },
    name: { type: String, required: true },
    workCenterId: {
      type: Schema.Types.ObjectId,
      ref: "WorkCenter",
      required: true,
    },
    status: {
      type: String,
      enum: ["Queued", "Started", "Completed", "Canceled"],
      default: "Queued",
    },
    plannedMinutes: { type: Number, required: true },
    actualMinutes: { type: Number, default: 0 },
    startedAt: { type: Date },
    completedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    collection: "work_orders",
  }
);

export const WorkOrder = model<IWorkOrder>("WorkOrder", workOrderSchema);
