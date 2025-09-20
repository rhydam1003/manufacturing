import mongoose from "mongoose";
import { logger } from "../utils/logger";

export async function connectDatabase() {
  const uri = process.env.MONGO_URI || "";
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGO_DB || undefined,
  } as any;
  try {
    await mongoose.connect(uri, options);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    throw error;
  }
}
