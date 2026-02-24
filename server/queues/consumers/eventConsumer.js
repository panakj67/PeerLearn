import crypto from "crypto";
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

const parseMessage = (msg) => {
  const raw = msg.content.toString();
  const data = JSON.parse(raw);

  // Support both styles:
  // 1) domain envelope { type, payload }
  // 2) direct email job { to, subject, text, html }
  if (data?.type && data?.payload) {
    return {
      mode: "event",
      type: data.type,
      payload: data.payload,
      eventId: data.payload?.eventId || msg.properties.messageId,
      logType: data.type,
    };
  }

  return {
    mode: "email-job",
    type: "DIRECT_EMAIL_JOB",
    payload: data,
    eventId: data?.eventId || msg.properties.messageId || crypto.randomUUID(),
    logType: "DIRECT_EMAIL_JOB",
  };
};

const sendDomainEmail = async (type, payload) => {
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
      await sendEmail({ to: payload.email, subject: "Note downloaded", text: "You downloaded a note and points were updated." });
    }
    return;
  }

  if (type === "NOTE_DELETED" && payload.email) {
    await sendEmail({ to: payload.email, subject: "Note deleted", text: `Your note "${payload.title}" was deleted.` });
    return;
  }

  console.warn("[rabbitmq] unknown event type, acknowledged without action", type);
};

const handleMessage = async (job) => {
  if (job.mode === "email-job") {
    const { to, subject, text, html } = job.payload || {};
    if (!to || !subject || (!text && !html)) {
      throw new Error("Invalid direct email job payload. Required: to, subject, text|html");
    }
    await sendEmail({ to, subject, text, html });
    return;
  }

  await sendDomainEmail(job.type, job.payload || {});
};

export const startEventConsumer = async () => {
  const channel = await setupRabbitTopology();
  if (!channel) {
    console.warn("[rabbitmq] consumer not started because channel is unavailable");
    return;
  }

  channel.prefetch(10);
  console.log(`[rabbitmq] consumer subscribing to queue: ${QUEUE}`);

  const consumeResult = await channel.consume(
    QUEUE,
    async (msg) => {
      if (!msg) return;

      const headers = msg.properties.headers || {};
      const retryCount = Number(headers["x-retry-count"] || 0);

      try {
        const job = parseMessage(msg);
        const claimed = await tryClaimEvent(job.eventId);

        if (!claimed) {
          console.log("[rabbitmq] duplicate message skipped", job.eventId);
          channel.ack(msg);
          return;
        }

        await handleMessage(job);
        channel.ack(msg); // acknowledge ONLY after successful send/processing
        console.log("[rabbitmq] message processed and acked", {
          queue: QUEUE,
          type: job.logType,
          eventId: job.eventId,
          retryCount,
        });
      } catch (error) {
        console.error("[rabbitmq] consume error", {
          queue: QUEUE,
          error: error.message,
          retryCount,
          messageId: msg.properties.messageId,
        });

        if (retryCount < MAX_RETRIES) {
          channel.publish(msg.fields.exchange, msg.fields.routingKey, msg.content, {
            persistent: true,
            headers: { ...headers, "x-retry-count": retryCount + 1 },
            messageId: msg.properties.messageId,
            contentType: msg.properties.contentType,
          });
          channel.ack(msg);
        } else {
          channel.nack(msg, false, false); // dead-letter after max retries
        }
      }
    },
    { noAck: false }
  );

  console.log("[rabbitmq] consumer started", {
    queue: QUEUE,
    consumerTag: consumeResult.consumerTag,
    maxRetries: MAX_RETRIES,
  });
};
