import crypto from "crypto";
import { publishEvent } from "../../services/rabbitmq.service.js";

export const emitDomainEvent = async (type, payload = {}) => {
  const eventId = payload.eventId || crypto.randomUUID();
  try {
    await publishEvent({ type, payload: { ...payload, eventId } });
  } catch (error) {
    console.error("[rabbitmq] publish failed", type, error.message);
  }
};
