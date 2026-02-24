import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { startEventConsumer } from "./queues/consumers/eventConsumer.js";

dotenv.config();

const bootstrap = async () => {
  await connectDB();
  await connectRedis();
  await startEventConsumer();
};

bootstrap().catch((error) => {
  console.error("[worker] fatal error", error);
  process.exit(1);
});
