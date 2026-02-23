import { getCache, setCache, deleteCache, invalidatePattern } from "../cache/cache.utils.js";
import { cacheKeys, cacheTTL } from "./redis.service.js";
import { connectRedis } from "../config/redis.js";

export const getCachedNotesList = ({ page, limit }) => getCache(cacheKeys.notesList(page, limit));
export const setCachedNotesList = ({ page, limit }, payload) => setCache(cacheKeys.notesList(page, limit), payload, cacheTTL.notesList);

export const getCachedNoteById = (id) => getCache(cacheKeys.noteById(id));
export const setCachedNoteById = (id, payload) => setCache(cacheKeys.noteById(id), payload, cacheTTL.noteById);

export const getCachedUserNotes = ({ userId, page, limit }) => getCache(cacheKeys.userNotes(userId, page, limit));
export const setCachedUserNotes = ({ userId, page, limit }, payload) => setCache(cacheKeys.userNotes(userId, page, limit), payload, cacheTTL.userNotes);

export const getCachedPopularNotes = (limit) => getCache(cacheKeys.popularNotes(limit));
export const setCachedPopularNotes = (limit, payload) => setCache(cacheKeys.popularNotes(limit), payload, cacheTTL.popularNotes);

export const bumpPopularScore = async (noteId, by = 1) => {
  const client = await connectRedis();
  if (!client) return false;
  try {
    await client.zincrby("app:notes:download_rank", by, String(noteId));
    return true;
  } catch (error) {
    console.error("[cache] bumpPopularScore failed", error.message);
    return false;
  }
};

export const getPopularIds = async (limit = 10) => {
  const client = await connectRedis();
  if (!client) return [];
  try {
    return await client.zrevrange("app:notes:download_rank", 0, limit - 1);
  } catch (error) {
    console.error("[cache] getPopularIds failed", error.message);
    return [];
  }
};

export const invalidateNotesCache = async ({ noteId, userId } = {}) => {
  if (noteId) await deleteCache(cacheKeys.noteById(noteId));
  if (userId) await invalidatePattern(`app:notes:user:${userId}:*`);
  await invalidatePattern("app:notes:list:*");
  await invalidatePattern("app:notes:popular:*");
};
