import { createClient } from "redis";
import { logger } from "../utils/logger";

let client: ReturnType<typeof createClient>;

export async function connectRedis() {
  const url = process.env.REDIS_URL || "";
  client = createClient({ url });
  client.on("error", (err) => logger.error("Redis Client Error", err));
  await client.connect();
  logger.info("Redis connected");
}

export function getRedisClient() {
  return client;
}
