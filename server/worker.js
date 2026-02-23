import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { startEventConsumer } from "./queues/consumers/eventConsumer.js";

dotenv.config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const bootstrap = async () => {
  await connectDB();
  await connectRedis();

  while (true) {
    try {
      await startEventConsumer();
      console.log("[worker] consumer is running");
      break;
    } catch (error) {
      console.error("[worker] consumer bootstrap failed, retrying in 5s", error.message);
      await delay(5000);
    }
  }
};

bootstrap().catch((error) => {
  console.error("[worker] fatal error", error);
  process.exit(1);
});
