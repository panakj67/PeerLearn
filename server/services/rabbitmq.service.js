import crypto from "crypto";
import { getRabbitChannel } from "../config/rabbitmq.js";

export const EXCHANGE = process.env.RABBITMQ_EXCHANGE || "peerlearn.events";
export const QUEUE = process.env.RABBITMQ_QUEUE || "peerlearn.events.queue";
export const DLQ = process.env.RABBITMQ_DLQ || "peerlearn.events.dlq";
export const DLX = process.env.RABBITMQ_DLX || "peerlearn.events.dlx";

export const setupRabbitTopology = async () => {
  const channel = await getRabbitChannel();
  if (!channel) return null;

  await channel.assertExchange(EXCHANGE, "topic", { durable: true });
  await channel.assertExchange(DLX, "topic", { durable: true });

  await channel.assertQueue(DLQ, { durable: true });
  await channel.bindQueue(DLQ, DLX, "#");

  await channel.assertQueue(QUEUE, {
    durable: true,
    deadLetterExchange: DLX,
    deadLetterRoutingKey: "dead.letter",
  });

  await channel.bindQueue(QUEUE, EXCHANGE, "event.#");
  return channel;
};

export const publishEvent = async ({ type, payload }) => {
  const channel = await setupRabbitTopology();
  if (!channel) return false;

  const eventId = payload?.eventId || crypto.randomUUID();
  const body = {
    type,
    payload: {
      ...payload,
      eventId,
      emittedAt: new Date().toISOString(),
    },
  };

  return channel.publish(EXCHANGE, `event.${type}`, Buffer.from(JSON.stringify(body)), {
    persistent: true,
    contentType: "application/json",
    messageId: eventId,
  });
};
