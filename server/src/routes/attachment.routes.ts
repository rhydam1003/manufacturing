import { Router } from "express";
import multer from "multer";
import { AttachmentController } from "../controllers/attachment.controller";
import { validate } from "../middleware/validation.middleware";
import { checkPermission, Permissions } from "../middleware/rbac.middleware";
import {
  createAttachmentValidator,
  updateAttachmentValidator,
} from "../validators/attachment.validator";

// Configure multer for file uploads
// Allowed file types and size limit
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DIR || "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    cb(new Error("File type not allowed"), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

const router = Router();
const controller = new AttachmentController();

// Upload new attachment
router.post(
  "/",
  upload.single("file"),
  validate(createAttachmentValidator),
  checkPermission(Permissions.MANAGE_ATTACHMENTS),
  controller.upload.bind(controller)
);

// Get attachments by resource
router.get(
  "/resource/:resourceType/:resourceId",
  checkPermission(Permissions.VIEW_ATTACHMENTS),
  controller.getByResource.bind(controller)
);

// Get attachment by ID
router.get(
  "/:id",
  checkPermission(Permissions.VIEW_ATTACHMENTS),
  controller.getById.bind(controller)
);

// Update attachment
router.put(
  "/:id",
  validate(updateAttachmentValidator),
  checkPermission(Permissions.MANAGE_ATTACHMENTS),
  controller.update.bind(controller)
);

// Delete attachment
router.delete(
  "/:id",
  checkPermission(Permissions.MANAGE_ATTACHMENTS),
  controller.delete.bind(controller)
);

export default router;
