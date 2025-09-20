import Joi from "joi";

export const createAttachmentValidator = Joi.object({
  resourceType: Joi.string().required().messages({
    "any.required": "Resource type is required",
    "string.empty": "Resource type cannot be empty",
  }),
  resourceId: Joi.string().required().messages({
    "any.required": "Resource ID is required",
    "string.empty": "Resource ID cannot be empty",
  }),
  description: Joi.string().optional().allow("").max(500).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  file: Joi.object({
    mimetype: Joi.string()
      .valid(
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
      .required()
      .messages({
        "any.required": "File type is required",
        "any.only": "File type not allowed",
      }),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required()
      .messages({
        "any.required": "File size is required",
        "number.max": "File size cannot exceed 5MB",
      }),
  }).optional(),
});

export const updateAttachmentValidator = Joi.object({
  fileName: Joi.string().optional().messages({
    "string.empty": "File name cannot be empty",
  }),
  description: Joi.string().optional().allow("").max(500).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
});
