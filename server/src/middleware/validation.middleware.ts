import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { ObjectSchema } from "joi";
import { CustomError } from "./error.middleware";

export function validate(validations: ValidationChain[] | ObjectSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (Array.isArray(validations)) {
        // Express-validator validation
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          return next();
        }
        const error = new Error("Validation failed") as CustomError;
        error.statusCode = 400;
        error.details = errors.array();
        return next(error);
      } else {
        // Joi validation
        const { error } = validations.validate(req.body, { abortEarly: false });
        if (!error) {
          return next();
        }
        const validationError = new Error("Validation failed") as CustomError;
        validationError.statusCode = 400;
        validationError.details = error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
        return next(validationError);
      }
    } catch (err) {
      return next(err);
    }
  };
}
