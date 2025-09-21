import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
// import { connectRedis } from "./config/redis";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";
import { rateLimitMiddleware } from "./middleware/rate-limit.middleware";
import { logger } from "./utils/logger";
import routes from "./routes";

dotenv.config();

const app: Application = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    res.status(204).end();
    return;
  }
  
  next();
});

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use("/api", rateLimitMiddleware);

// API routes
app.use("/api/v1", routes);

// Swagger documentation
setupSwagger(app);

// Error handling
app.use(errorHandler);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    // Connect to databases
  await connectDatabase();
  // await connectRedis(); // Redis bypassed for local development
    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

export default app;
