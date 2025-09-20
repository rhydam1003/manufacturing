import { Schema, model, Document, Types } from "mongoose";

export interface IAttachment extends Document {
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  resourceType: string;
  resourceId: string;
  description?: string;
  uploadedBy: Types.ObjectId;
  isActive: boolean;
  uploadedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>(
  {
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    filePath: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String, required: true },
    description: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "attachments",
  }
);

export const Attachment = model<IAttachment>("Attachment", attachmentSchema);
