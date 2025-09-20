import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { RequestWithUser, UserDocument } from "../types";

export async function authenticate(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      userId: string;
    };

    const user = (await User.findById(decoded.userId).select(
      "-password"
    )) as UserDocument;
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized - Invalid user" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized - Invalid token" });
  }
}
