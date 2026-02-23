# PeerLearn Backend: Redis + RabbitMQ + MongoDB Search

## Architecture
- **API layer (Express)**: Handles synchronous user/note APIs.
- **Redis cache-aside**: Used by note list, note-by-id, user notes, and popular notes.
- **RabbitMQ event bus**: Domain events are published by API and consumed by worker for async notifications and points update.
- **MongoDB search layer**: Regex-based notes search with pagination and date sorting.
- **Fallback model**:
  - Redis unavailable → direct MongoDB read/write.
  - RabbitMQ unavailable → request still succeeds; async side effects are skipped with logs.

## Event Flow
1. API writes source of truth in MongoDB.
2. API invalidates Redis keys.
3. API publishes event (`USER_REGISTERED`, `NOTE_UPLOADED`, `NOTE_DELETED`, `NOTE_DOWNLOADED`).
4. Worker consumes and applies async tasks:
   - Sends emails.
   - Updates points (`+10` upload, `-10` download).
5. Idempotency uses processed-event Redis key `app:events:processed:{eventId}`.

## Search Flow
1. `GET /api/note/search?q=...` executes MongoDB regex query.
2. Results are paginated and sorted by date.
