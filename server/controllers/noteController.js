import fs from "fs";
import crypto from "crypto";
import mongoose from "mongoose";
import noteModel from "../models/noteModel.js";
import cloudinary from "../config/cloudinary.js";
import userModel from "../models/userModel.js";
import { emitDomainEvent } from "../queues/producers/eventProducer.js";
import {
  getCachedNoteById,
  getCachedNotesList,
  getCachedPopularNotes,
  getCachedUserNotes,
  setCachedNoteById,
  setCachedNotesList,
  setCachedPopularNotes,
  setCachedUserNotes,
  invalidateNotesCache,
  getPopularIds,
} from "../services/notesCache.service.js";
import { searchNotes } from "../search/notes.search.js";
import { cacheMetrics, deleteCache, setCacheIfAbsent } from "../cache/cache.utils.js";
import { connectRedis } from "../config/redis.js";

const NOTE_USER_POPULATE = { path: "user", select: "name email profileImg" };

export const testNote = (req, res) => {
  res.send("Note routes is working");
};

const getFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
};

const normalizePageLimit = (page, limit, maxLimit = 50) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), maxLimit);
  return { safePage, safeLimit, skip: (safePage - 1) * safeLimit };
};

export const createNotes = async (req, res) => {
  let uploadPublicId = null;
  let dedupeLockKey = null;
  let lockEnabled = false;
  const file = req.file;

  try {
    const { title, college, degree, semester, branch, subject, description = "", tags = "" } = req.body;

    if (!file) return res.json({ success: false, message: "No file provided" });

    const hashcode = getFileHash(file.path);
    dedupeLockKey = `app:lock:note-hash:${hashcode}`;

    const redisClient = await connectRedis();
    if (redisClient) {
      lockEnabled = true;
      const lockAcquired = await setCacheIfAbsent(dedupeLockKey, { ts: Date.now() }, 30);
      if (!lockAcquired) {
        return res.json({ success: false, message: "Duplicate upload in progress. Please retry shortly." });
      }
    }

    const duplicate = await noteModel.findOne({ hashcode }).lean();
    if (duplicate) {
      return res.json({ success: false, message: "Duplicate document detected!!" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: "notes",
      access_mode: "public",
      use_filename: true,
      unique_filename: false,
      format: "pdf",
    });

    uploadPublicId = result.public_id;
    const fileUrl = result.secure_url;
    const firstPageImageUrl = fileUrl.replace(".pdf", ".jpg") + "#page=1";

    let note;
    try {
      note = await noteModel.create({
        title,
        college,
        degree,
        semester,
        branch,
        subject,
        description,
        tags: Array.isArray(tags) ? tags : String(tags).split(",").map((v) => v.trim()).filter(Boolean),
        image: firstPageImageUrl,
        fileUrl,
        hashcode,
        user: req.user.id,
      });
    } catch (dbError) {
      if (dbError?.code === 11000 && uploadPublicId) {
        await cloudinary.uploader.destroy(uploadPublicId, { resource_type: "raw", invalidate: true }).catch(() => {});
        await cloudinary.uploader.destroy(uploadPublicId, { resource_type: "image", invalidate: true }).catch(() => {});
        return res.json({ success: false, message: "Duplicate document detected!!" });
      }
      throw dbError;
    }

    await userModel.findByIdAndUpdate(req.user.id, { $addToSet: { uploads: note._id } });
    note = await note.populate(NOTE_USER_POPULATE);

    await invalidateNotesCache({ noteId: note._id, userId: req.user.id });
    await setCachedNoteById(note._id, { success: true, note });

    emitDomainEvent("NOTE_UPLOADED", {
      userId: req.user.id,
      email: note?.user?.email,
      title: note.title,
      noteId: String(note._id),
    });

    return res.json({ success: true, message: "Document submitted successfully", note });
  } catch (error) {
    console.error("Error in createNotes:", error);
    return res.json({ success: false, message: error.message });
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      try { fs.unlinkSync(file.path); } catch {}
    }
    if (dedupeLockKey && lockEnabled) {
      await deleteCache(dedupeLockKey);
    }
  }
};

export const getNotes = async (req, res) => {
  try {
    const { safePage, safeLimit, skip } = normalizePageLimit(req.query.page, req.query.limit);
    const cacheQuery = { page: safePage, limit: safeLimit };
    const cached = await getCachedNotesList(cacheQuery);
    if (cached) return res.json(cached);

    const [notes, total] = await Promise.all([
      noteModel.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit).populate(NOTE_USER_POPULATE).lean(),
      noteModel.countDocuments(),
    ]);

    const payload = { success: true, notes, page: safePage, limit: safeLimit, total };
    await setCachedNotesList(cacheQuery, payload);

    return res.json(payload);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cached = await getCachedNoteById(id);
    if (cached) return res.json(cached);

    const note = await noteModel.findById(id).populate(NOTE_USER_POPULATE).lean();
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    const payload = { success: true, note };
    await setCachedNoteById(id, payload);
    return res.json(payload);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getUserNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { safePage, safeLimit, skip } = normalizePageLimit(req.query.page, req.query.limit);

    const cacheQuery = { userId, page: safePage, limit: safeLimit };
    const cached = await getCachedUserNotes(cacheQuery);
    if (cached) return res.json(cached);

    const [notes, total] = await Promise.all([
      noteModel.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).populate(NOTE_USER_POPULATE).lean(),
      noteModel.countDocuments({ user: userId }),
    ]);

    const payload = { success: true, notes, page: safePage, limit: safeLimit, total };
    await setCachedUserNotes(cacheQuery, payload);

    return res.json(payload);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getPopularNotes = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const cached = await getCachedPopularNotes(limit);
    if (cached) return res.json(cached);

    const popularIds = await getPopularIds(limit);
    let notes;

    if (popularIds.length) {
      notes = await noteModel.find({ _id: { $in: popularIds } }).populate(NOTE_USER_POPULATE).lean();
      const orderMap = new Map(popularIds.map((id, i) => [String(id), i]));
      notes.sort((a, b) => orderMap.get(String(a._id)) - orderMap.get(String(b._id)));
    } else {
      notes = await noteModel.find().sort({ views: -1, createdAt: -1 }).limit(limit).populate(NOTE_USER_POPULATE).lean();
    }

    const payload = { success: true, notes };
    await setCachedPopularNotes(limit, payload);
    return res.json(payload);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const searchNotesHandler = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 10, sort = "relevance" } = req.query;
    const result = await searchNotes({ q, page, limit, sort });
    return res.json(result);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const handleEvent = async (req, res) => {
  try {
    const { id, event } = req.body;
    const { noteId } = req.params;

    const note = await noteModel.findById(noteId).populate(NOTE_USER_POPULATE);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    const liked = note.like.includes(id);
    const disliked = note.dislike.includes(id);

    if (event === "like") {
      if (liked) note.like.pull(id);
      else {
        note.like.push(id);
        if (disliked) note.dislike.pull(id);
      }
    } else if (event === "dislike") {
      if (disliked) note.dislike.pull(id);
      else {
        note.dislike.push(id);
        if (liked) note.like.pull(id);
      }
    }

    await note.save();
    await invalidateNotesCache({ noteId });
    return res.json({ success: true, message: "Successfully updated", note });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const temp = async (req, res) => {
  const result = await noteModel.updateMany({ hashCode: { $exists: false } }, { $set: { heshCode: String } });
  return res.json({ success: true, message: "Updated successfully!", result });
};

export const deleteNote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const note = await noteModel.findById(id).populate(NOTE_USER_POPULATE).session(session);
    if (!note) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    await noteModel.deleteOne({ _id: id }, { session });
    await userModel.updateMany(
      { $or: [{ uploads: id }, { downloads: id }] },
      { $pull: { uploads: id, downloads: id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    await invalidateNotesCache({ noteId: id, userId: note?.user?._id });

    emitDomainEvent("NOTE_DELETED", {
      userId: note?.user?._id,
      email: note?.user?.email,
      title: note?.title,
      noteId: id,
    });

    return res.json({ success: true, message: "Notes deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.json({ success: false, message: error.message });
  }
};

export const getCacheMetrics = async (req, res) => {
  return res.json({ success: true, metrics: cacheMetrics() });
};
