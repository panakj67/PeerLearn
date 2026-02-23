export const cacheKeys = {
  notesList: (page = 1, limit = 20) => `app:notes:list:page:${page}:limit:${limit}`,
  noteById: (id) => `app:notes:${id}`,
  userNotes: (userId, page = 1, limit = 20) => `app:notes:user:${userId}:page:${page}:limit:${limit}`,
  popularNotes: (limit = 10) => `app:notes:popular:limit:${limit}`,
  processedEvent: (eventId) => `app:events:processed:${eventId}`,
};

export const cacheTTL = {
  notesList: Number(process.env.REDIS_TTL_NOTES_LIST || 180),
  noteById: Number(process.env.REDIS_TTL_NOTE_BY_ID || 300),
  userNotes: Number(process.env.REDIS_TTL_USER_NOTES || 180),
  popularNotes: Number(process.env.REDIS_TTL_POPULAR_NOTES || 120),
};
