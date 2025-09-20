import { Request, Response } from "express";
import { AttachmentService } from "../services/attachment.service";

export class AttachmentController {
  private service: AttachmentService;

  constructor() {
    this.service = new AttachmentService();
  }

  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        throw new Error("No file uploaded");
      }

      const attachment = await this.service.uploadFile(req.file, {
        resourceType: req.body.resourceType,
        resourceId: req.body.resourceId,
        description: req.body.description,
        uploadedBy: req.user?._id,
      });

      res.status(201).json({ success: true, data: attachment });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getByResource(req: Request, res: Response) {
    try {
      const attachments = await this.service.getByResource(
        req.params.resourceType,
        req.params.resourceId
      );
      res.json({ success: true, data: attachments });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const attachment = await this.service.getById(req.params.id);
      if (!attachment) {
        return res
          .status(404)
          .json({ success: false, error: "Attachment not found" });
      }
      res.json({ success: true, data: attachment });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const attachment = await this.service.update(req.params.id, req.body);
      if (!attachment) {
        return res
          .status(404)
          .json({ success: false, error: "Attachment not found" });
      }
      res.json({ success: true, data: attachment });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.service.delete(req.params.id);
      res.json({ success: true, message: "Attachment deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
