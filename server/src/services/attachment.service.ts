import fs from "fs/promises";
import path from "path";
import { Attachment } from "../models/attachment.model";
import { FilterQuery } from "../types";

export class AttachmentService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || "uploads";
    // Ensure upload directory exists
    fs.mkdir(this.uploadDir, { recursive: true }).catch(console.error);
  }

  async uploadFile(file: Express.Multer.File, data: any) {
    const { resourceType, resourceId, description, uploadedBy } = data;

    // Create relative path from upload directory
    const relativePath = path.join(this.uploadDir, file.filename);

    // Create attachment record
    const attachment = new Attachment({
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: relativePath,
      resourceType,
      resourceId,
      description,
      uploadedBy,
    });

    await attachment.save();
    return attachment;
  }

  async getByResource(resourceType: string, resourceId: string) {
    return await Attachment.find({
      resourceType,
      resourceId,
      isActive: true,
    }).sort({ uploadedAt: -1 });
  }

  async getById(id: string) {
    return await Attachment.findOne({ _id: id, isActive: true });
  }

  async update(id: string, data: Partial<any>) {
    return await Attachment.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: data },
      { new: true }
    );
  }

  async delete(id: string) {
    const attachment = await Attachment.findById(id);
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    // Delete file from filesystem
    try {
      await fs.unlink(attachment.filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    // Soft delete the record
    await Attachment.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: false } }
    );

    return true;
  }
}
