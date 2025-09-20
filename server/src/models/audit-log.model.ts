import { Schema, model, Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  actorId: Types.ObjectId;
  action: string;
  entityType: string;
  entityId: Types.ObjectId;
  meta: any;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "audit_logs",
  }
);

export const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);
