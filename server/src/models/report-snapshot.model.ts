import { Schema, model, Document, Types } from "mongoose";

export interface IReportSnapshot extends Document {
  reportType: string;
  data: any;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const reportSnapshotSchema = new Schema<IReportSnapshot>(
  {
    reportType: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "report_snapshots",
  }
);

export const ReportSnapshot = model<IReportSnapshot>(
  "ReportSnapshot",
  reportSnapshotSchema
);
