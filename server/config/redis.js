import Redis from "ioredis";

let redisClient;
let connectPromise = null;
let hasLoggedConnectFailure = false;

export const getRedisClient = () => {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn("[redis] REDIS_URL not configured. Redis features disabled.");
    return null;
  }

  redisClient = new Redis(redisUrl, {
    // Avoid throwing `Reached the max retries per request limit` during transient outages.
    maxRetriesPerRequest: null,
    lazyConnect: true,
    enableAutoPipelining: true,
    connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 10000),
    retryStrategy(times) {
      const delay = Math.min(times * 500, 5000);
      return delay;
    },
  });

  redisClient.on("connect", () => {
    hasLoggedConnectFailure = false;
    console.log("[redis] connected");
  });

  redisClient.on("error", (err) => {
    console.error("[redis] error", err.message);
  });

  redisClient.on("reconnecting", () => {
    console.warn("[redis] reconnecting...");
  });

  redisClient.on("end", () => {
    connectPromise = null;
  });

  return redisClient;
};

export const connectRedis = async () => {
  const client = getRedisClient();
  if (!client) return null;

  // Already ready/connected enough for commands.
  if (["ready", "connect"].includes(client.status)) {
    return client;
  }

  // If a connect is already running, reuse it.
  if (client.status === "connecting" && connectPromise) {
    try {
      await connectPromise;
    } catch {
      return null;
    }
    return ["ready", "connect"].includes(client.status) ? client : null;
  }

  if (!connectPromise) {
    connectPromise = client.connect().catch((error) => {
      if (!hasLoggedConnectFailure) {
        console.error("[redis] connect failed", error.message);
        hasLoggedConnectFailure = true;
      }
      throw error;
    }).finally(() => {
      connectPromise = null;
    });
  }

  try {
    await connectPromise;
  } catch {
    return null;
  }

  return ["ready", "connect"].includes(client.status) ? client : null;
};
