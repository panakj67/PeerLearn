import { getCache, setCache } from "../cache/cache.utils.js";

export const cacheRoute = ({ keyBuilder, ttlSeconds = 120 } = {}) => {
  return async (req, res, next) => {
    if (!keyBuilder) return next();

    const key = keyBuilder(req);
    if (!key) return next();

    const cached = await getCache(key);
    if (cached) return res.json(cached);

    const originalJson = res.json.bind(res);
    res.json = (payload) => {
      if (payload?.success) {
        setCache(key, payload, ttlSeconds).catch(() => {});
      }
      return originalJson(payload);
    };

    next();
  };
};
