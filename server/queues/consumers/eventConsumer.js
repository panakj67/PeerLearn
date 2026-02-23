import { setupRabbitTopology, QUEUE } from "../../services/rabbitmq.service.js";
import { sendEmail } from "../../services/email.service.js";
import userModel from "../../models/userModel.js";
import { cacheKeys } from "../../services/redis.service.js";
import { setCacheIfAbsent } from "../../cache/cache.utils.js";

const MAX_RETRIES = Number(process.env.RABBITMQ_MAX_RETRIES || 3);

const tryClaimEvent = async (eventId) => {
  if (!eventId) return true;
  return setCacheIfAbsent(cacheKeys.processedEvent(eventId), { processed: true }, 24 * 60 * 60);
};

const handleEvent = async (event) => {
  const { type, payload } = event;

  if (type === "USER_REGISTERED" && payload.email) {
    await sendEmail({
      to: payload.email,
      subject: "Welcome to PeerLearn",
      text: `Hi ${payload.name || "Student"}, welcome to PeerLearn!`,
    });
    return;
  }

  if (type === "NOTE_UPLOADED") {
    if (payload.userId) await userModel.findByIdAndUpdate(payload.userId, { $inc: { points: 10 } });
    if (payload.email) {
      await sendEmail({ to: payload.email, subject: "Note uploaded", text: `Your note "${payload.title}" was uploaded.` });
    }
    return;
  }

  if (type === "NOTE_DOWNLOADED") {
    if (payload.userId) await userModel.findByIdAndUpdate(payload.userId, { $inc: { points: -10 } });
    if (payload.email) {
      await sendEmail({ to: payload.email, subject: "Note downloaded", text: `You downloaded a note and points were updated.` });
    }
    return;
  }

  if (type === "NOTE_DELETED" && payload.email) {
    await sendEmail({ to: payload.email, subject: "Note deleted", text: `Your note "${payload.title}" was deleted.` });
  }
};

export const startEventConsumer = async () => {
  const channel = await setupRabbitTopology();
  if (!channel) return;

  channel.prefetch(10);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const headers = msg.properties.headers || {};
    const retryCount = Number(headers["x-retry-count"] || 0);

    try {
      const event = JSON.parse(msg.content.toString());
      const eventId = event?.payload?.eventId || msg.properties.messageId;

      const claimed = await tryClaimEvent(eventId);
      if (!claimed) {
        channel.ack(msg);
        return;
      }

      await handleEvent(event);
      channel.ack(msg);
    } catch (error) {
      console.error("[rabbitmq] consume error", error.message);
      if (retryCount < MAX_RETRIES) {
        channel.publish(msg.fields.exchange, msg.fields.routingKey, msg.content, {
          persistent: true,
          headers: { ...headers, "x-retry-count": retryCount + 1 },
          messageId: msg.properties.messageId,
          contentType: msg.properties.contentType,
        });
        channel.ack(msg);
      } else {
        channel.nack(msg, false, false);
      }
    }
  });

  console.log("[rabbitmq] consumer started");
};
