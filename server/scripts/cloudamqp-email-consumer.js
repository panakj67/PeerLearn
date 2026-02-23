import amqp from "amqplib";
import nodemailer from "nodemailer";

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EMAIL_QUEUE = process.env.RABBITMQ_QUEUE || "email_queue";
const PREFETCH = Number(process.env.RABBITMQ_PREFETCH || 5);
const MAX_RETRIES = Number(process.env.RABBITMQ_MAX_RETRIES || 3);

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER || "no-reply@example.com";

if (!RABBITMQ_URL) {
  console.error("[email-consumer] Missing RABBITMQ_URL");
  process.exit(1);
}

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("[email-consumer] Missing SMTP config (SMTP_HOST/SMTP_USER/SMTP_PASS)");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const validateJob = (payload) => {
  return Boolean(payload?.to && payload?.subject && (payload?.text || payload?.html));
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const start = async () => {
  while (true) {
    let connection;
    let channel;
    try {
      console.log("[email-consumer] connecting to CloudAMQP...");
      connection = await amqp.connect(RABBITMQ_URL, { heartbeat: 30 });
      channel = await connection.createChannel();

      connection.on("error", (err) => console.error("[email-consumer] connection error", err.message));
      connection.on("close", () => console.warn("[email-consumer] connection closed"));

      await channel.assertQueue(EMAIL_QUEUE, { durable: true });
      await channel.prefetch(PREFETCH);

      const qInfo = await channel.checkQueue(EMAIL_QUEUE);
      console.log("[email-consumer] connected", {
        queue: EMAIL_QUEUE,
        consumers: qInfo.consumerCount,
        messages: qInfo.messageCount,
        prefetch: PREFETCH,
      });

      await channel.consume(
        EMAIL_QUEUE,
        async (msg) => {
          if (!msg) return;

          const headers = msg.properties.headers || {};
          const retryCount = Number(headers["x-retry-count"] || 0);

          try {
            const payload = JSON.parse(msg.content.toString());
            if (!validateJob(payload)) {
              throw new Error("Invalid payload. Required: to, subject, text|html");
            }

            await transporter.sendMail({
              from: MAIL_FROM,
              to: payload.to,
              subject: payload.subject,
              text: payload.text,
              html: payload.html,
            });

            channel.ack(msg); // ack only after successful send
            console.log("[email-consumer] email sent + ack", {
              to: payload.to,
              subject: payload.subject,
              messageId: msg.properties.messageId,
              retryCount,
            });
          } catch (error) {
            console.error("[email-consumer] consume failed", {
              error: error.message,
              retryCount,
              messageId: msg.properties.messageId,
            });

            if (retryCount < MAX_RETRIES) {
              channel.sendToQueue(EMAIL_QUEUE, msg.content, {
                persistent: true,
                headers: { ...headers, "x-retry-count": retryCount + 1 },
                messageId: msg.properties.messageId,
                contentType: msg.properties.contentType || "application/json",
              });
              channel.ack(msg);
            } else {
              // discard after max retries; if DLX configured on queue, it will be dead-lettered
              channel.nack(msg, false, false);
            }
          }
        },
        { noAck: false }
      );

      console.log("[email-consumer] consuming... (press Ctrl+C to stop)");
      return;
    } catch (error) {
      console.error("[email-consumer] startup error, retrying in 5s", error.message);
      try {
        await channel?.close();
      } catch {}
      try {
        await connection?.close();
      } catch {}
      await sleep(5000);
    }
  }
};

start().catch((error) => {
  console.error("[email-consumer] fatal", error);
  process.exit(1);
});
