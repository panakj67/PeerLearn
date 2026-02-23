import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import noteRouter from "./routes/noteRoutes.js";
import cors from "cors";
import apiRouter from "./routes/apiRoutes.js";
import { Server } from "socket.io";
import messageRouter from "./routes/messageRoutes.js";
import { initSocket } from "./sockets/socket.js";
import { connectRedis } from "./config/redis.js";
import { setupRabbitTopology } from "./services/rabbitmq.service.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://peer-learn.vercel.app",
  "https://peer-learn-git-main-pankaj-kumars-projects-a2ff3a66.vercel.app",
  "https://peer-learn-hcaoc1416-pankaj-kumars-projects-a2ff3a66.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

connectDB();
connectRedis();
setupRabbitTopology().catch((error) => console.error("[rabbitmq] topology setup failed", error.message));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("🌐 Incoming request origin:", req.headers.origin);
  next();
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

initSocket(io);

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.API_RATE_LIMIT_MAX || 100),
    handler: (req, res) => {
      console.warn(`[${new Date().toISOString()}] Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ message: "Too many requests, please try again later." });
    },
  })
);

app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);
app.use("/api/chat", apiRouter);
app.use("/api/messages", messageRouter);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on PORT ${process.env.PORT || 3000}`);
});
