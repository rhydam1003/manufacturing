import { Request, Response, NextFunction } from "express";
import { AuditLog } from "../models/audit-log.model";
import { RequestWithUser } from "../types";

export async function requestLogger(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  // Capture the original end function
  const originalEnd = res.end;
  let responseBody: any;

  // Override res.end to intercept the response data
  res.end = function (chunk: any, ...args: any[]) {
    responseBody = chunk;
    originalEnd.apply(res, [chunk, ...args]);
  };

  // Once response is sent
  res.on("finish", async () => {
    try {
      const duration = Date.now() - startTime;

      const logEntry = new AuditLog({
        userId: req.user?._id,
        method: req.method,
        path: req.path,
        query: req.query,
        params: req.params,
        body: maskSensitiveData(req.body),
        statusCode: res.statusCode,
        duration,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      });

      await logEntry.save();
    } catch (error) {
      console.error("Error saving audit log:", error);
    }
  });

  next();
}

// Helper function to mask sensitive data
function maskSensitiveData(data: any): any {
  if (!data) return data;

  const maskedData = { ...data };
  const sensitiveFields = ["password", "token", "secret", "key", "credit_card"];

  for (const field of sensitiveFields) {
    if (maskedData[field]) {
      maskedData[field] = "********";
    }
  }

  return maskedData;
}
