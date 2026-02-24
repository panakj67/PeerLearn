import amqp from "amqplib";

let connection;
let channel;
let connectingPromise = null;

export const getRabbitConnection = async () => {
  if (connection) return connection;
  if (connectingPromise) return connectingPromise;

  const url = process.env.RABBITMQ_URL;
  if (!url) {
    console.warn("[rabbitmq] RABBITMQ_URL missing. Queue features disabled.");
    return null;
  }

  connectingPromise = amqp
    .connect(url, { heartbeat: Number(process.env.RABBITMQ_HEARTBEAT || 30) })
    .then((conn) => {
      connection = conn;
      console.log("[rabbitmq] connected");

      connection.on("error", (err) => {
        console.error("[rabbitmq] connection error", err.message);
        connection = null;
        channel = null;
      });

      connection.on("close", () => {
        console.warn("[rabbitmq] connection closed");
        connection = null;
        channel = null;
      });

      return connection;
    })
    .catch((error) => {
      console.error("[rabbitmq] connect failed", error.message);
      throw error;
    })
    .finally(() => {
      connectingPromise = null;
    });

  return connectingPromise;
};

export const getRabbitChannel = async () => {
  if (channel) return channel;
  const conn = await getRabbitConnection();
  if (!conn) return null;

  channel = await conn.createChannel();
  channel.on("error", (err) => {
    console.error("[rabbitmq] channel error", err.message);
    channel = null;
  });
  channel.on("close", () => {
    console.warn("[rabbitmq] channel closed");
    channel = null;
  });

  return channel;
};
