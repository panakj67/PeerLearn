import amqp from "amqplib";

let connection;
let channel;

export const getRabbitConnection = async () => {
  if (connection) return connection;

  const url = process.env.RABBITMQ_URL;
  if (!url) {
    console.warn("[rabbitmq] RABBITMQ_URL missing. Queue features disabled.");
    return null;
  }

  connection = await amqp.connect(url);
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
};

export const getRabbitChannel = async () => {
  if (channel) return channel;
  const conn = await getRabbitConnection();
  if (!conn) return null;
  channel = await conn.createChannel();
  return channel;
};
