import { createClient } from "redis";

class RedisUtil {
  private static instance: RedisUtil;
  private client: ReturnType<typeof createClient>;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => console.error("Redis Client Error", err));
  }

  public static getInstance(): RedisUtil {
    if (!RedisUtil.instance) {
      RedisUtil.instance = new RedisUtil();
    }
    return RedisUtil.instance;
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  async set(key: string, value: any, expireInSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    await this.client.set(key, stringValue);
    if (expireInSeconds) {
      await this.client.expire(key, expireInSeconds);
    }
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setLock(
    key: string,
    value: string,
    expireInSeconds: number
  ): Promise<boolean> {
    const result = await this.client.set(key, value, {
      NX: true,
      EX: expireInSeconds,
    });
    return result === "OK";
  }

  async releaseLock(key: string, value: string): Promise<boolean> {
    const script = `
      if redis.call("get",KEYS[1]) == ARGV[1] then
        return redis.call("del",KEYS[1])
      else
        return 0
      end
    `;

    const result = await this.client.eval(script, {
      keys: [key],
      arguments: [value],
    });

    return result === 1;
  }
}

export const redisUtil = RedisUtil.getInstance();
