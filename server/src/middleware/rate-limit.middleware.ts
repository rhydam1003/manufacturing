import rateLimit, { Store } from "express-rate-limit";
import { redisUtil } from "../utils/redis.utils";

const store = {
  increment(key: string) {
    return this.incr(key);
  },
  async incr(key: string) {
    const current = Number(await redisUtil.get(key)) || 0;
    await redisUtil.set(key, current + 1, Math.floor(15 * 60)); // 15 minutes in seconds
    return current + 1;
  },
  decrement(key: string) {
    return this.decr(key);
  },
  async decr(key: string) {
    const current = Number(await redisUtil.get(key)) || 0;
    await redisUtil.set(key, Math.max(0, current - 1), Math.floor(15 * 60));
    return Math.max(0, current - 1);
  },
  async resetKey(key: string) {
    await redisUtil.del(key);
    return 0;
  },
};

export const rateLimitMiddleware = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  store,
  message: {
    status: 429,
    success: false,
    error: "Too many requests, please try again later.",
  },
});
