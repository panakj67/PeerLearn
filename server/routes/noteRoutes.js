import express from "express";
import {
  testNote,
  createNotes,
  getNotes,
  temp,
  handleEvent,
  deleteNote,
  getNoteById,
  getUserNotes,
  getPopularNotes,
  searchNotesHandler,
  getCacheMetrics,
} from "../controllers/noteController.js";
import upload from "../config/multer.js";
import { authUser } from "../middleware/authUser.js";
import { cacheRoute } from "../middleware/cacheRoute.js";

const noteRouter = express.Router();

noteRouter.get("/test", testNote);
noteRouter.post("/create-notes", upload.single("file"), authUser, createNotes);
noteRouter.get(
  "/get",
  cacheRoute({
    keyBuilder: (req) => {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
      return `app:notes:list:page:${page}:limit:${limit}`;
    },
    ttlSeconds: Number(process.env.REDIS_TTL_NOTES_LIST || 180),
  }),
  getNotes
);
noteRouter.get("/popular", getPopularNotes);
noteRouter.get("/search", searchNotesHandler);
noteRouter.get("/cache-metrics", getCacheMetrics);
noteRouter.get("/id/:id", getNoteById);
noteRouter.get("/user/:userId", getUserNotes);
noteRouter.post("/:noteId", handleEvent);
noteRouter.delete("/delete/:id", authUser, deleteNote);
noteRouter.get("/temp", temp);

export default noteRouter;
