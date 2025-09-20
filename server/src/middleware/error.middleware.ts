import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
  details?: any;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error for internal tracking
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    details: err.details,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== "production" && {
      details: err.details,
      stack: err.stack,
    }),
  });
}
