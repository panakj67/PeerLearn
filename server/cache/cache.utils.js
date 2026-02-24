import { connectRedis } from "../config/redis.js";

const metrics = {
  hit: 0,
  miss: 0,
  set: 0,
  del: 0,
};

export const cacheMetrics = () => ({ ...metrics });

export const getCache = async (key) => {
  const client = await connectRedis();
  if (!client) return null;

  try {
    const value = await client.get(key);
    if (value) metrics.hit += 1;
    else metrics.miss += 1;
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("[cache] get failed", key, error.message);
    return null;
  }
};

export const setCache = async (key, payload, ttlSeconds = 300) => {
  const client = await connectRedis();
  if (!client) return false;

  try {
    await client.set(key, JSON.stringify(payload), "EX", ttlSeconds);
    metrics.set += 1;
    return true;
  } catch (error) {
    console.error("[cache] set failed", key, error.message);
    return false;
  }
};

export const setCacheIfAbsent = async (key, payload, ttlSeconds = 300) => {
  const client = await connectRedis();
  if (!client) return false;

  try {
    const result = await client.set(key, JSON.stringify(payload), "EX", ttlSeconds, "NX");
    return result === "OK";
  } catch (error) {
    console.error("[cache] set nx failed", key, error.message);
    return false;
  }
};

export const deleteCache = async (key) => {
  const client = await connectRedis();
  if (!client) return false;

  try {
    await client.del(key);
    metrics.del += 1;
    return true;
  } catch (error) {
    console.error("[cache] delete failed", key, error.message);
    return false;
  }
};

export const invalidatePattern = async (pattern, batchSize = 200) => {
  const client = await connectRedis();
  if (!client) return 0;

  try {
    let cursor = "0";
    let totalDeleted = 0;

    do {
      const [nextCursor, keys] = await client.scan(cursor, "MATCH", pattern, "COUNT", batchSize);
      cursor = nextCursor;
      if (keys.length) {
        await client.unlink(...keys);
        totalDeleted += keys.length;
      }
    } while (cursor !== "0");

    return totalDeleted;
  } catch (error) {
    console.error("[cache] invalidatePattern failed", pattern, error.message);
    return 0;
  }
};
