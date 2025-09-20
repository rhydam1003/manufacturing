import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  authorId: Types.ObjectId;
  refType: string;
  refId: Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refType: { type: String, required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "comments",
  }
);

export const Comment = model<IComment>("Comment", commentSchema);
