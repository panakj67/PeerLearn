import Redis from "ioredis";

let redisClient;

export const getRedisClient = () => {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn("[redis] REDIS_URL not configured. Redis features disabled.");
    return null;
  }

  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 2,
    lazyConnect: true,
    enableAutoPipelining: true,
    retryStrategy(times) {
      const delay = Math.min(times * 200, 5000);
      return delay;
    },
  });

  redisClient.on("connect", () => console.log("[redis] connected"));
  redisClient.on("error", (err) => console.error("[redis] error", err.message));
  redisClient.on("reconnecting", () => console.warn("[redis] reconnecting..."));

  return redisClient;
};

export const connectRedis = async () => {
  const client = getRedisClient();
  if (!client) return null;

  if (client.status !== "ready") {
    try {
      await client.connect();
    } catch (error) {
      console.error("[redis] connect failed", error.message);
      return null;
    }
  }

  return client;
};
