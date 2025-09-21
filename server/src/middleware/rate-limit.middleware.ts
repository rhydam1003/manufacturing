import rateLimit from "express-rate-limit";



export const rateLimitMiddleware = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  // store: undefined // Use default in-memory store
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    error: "Too many requests, please try again later.",
  },
});
