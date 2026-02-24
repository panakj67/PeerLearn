import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import noteModel from "../models/noteModel.js";
import { emitDomainEvent } from "../queues/producers/eventProducer.js";
import { bumpPopularScore, invalidateNotesCache } from "../services/notesCache.service.js";

export const test = (req, res) => {
  return res.json({ message: "Note routes is working", id: req.user.id });
};

export const login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const { password } = req.body;

  try {
    const user = await userModel.findOne({ email }).populate("uploads").populate("downloads").populate("bookmarks");
    if (!user) {
      return res.json({ success: false, message: "User does not exist." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "2d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const accessToken = await setAuthCookies(res, user);
    return res.json({ success: true, message: "LoggedIn successfully!", user, accessToken });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const { password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user) return res.json({ success: false, message: "User already exists." });

    const user = await userModel.findOne({ email });
    if (user) return res.json({ success: false, message: "User already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "2d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    emitDomainEvent("USER_REGISTERED", { userId: newUser._id, email: newUser.email, name: newUser.name });

    return res.json({ success: true, message: "User created successfully!", user: newUser });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    if (!req.user) return res.json({ success: false, message: "You are not authorised" });

    const user = await userModel.findById(req.user.id).select("-password").populate("uploads").populate("downloads").populate("bookmarks");
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ success: true, message: "Logout Successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const downloadNote = async (req, res) => {
  try {
    const { id } = req.body;

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.user.id, downloads: { $ne: id } },
      { $addToSet: { downloads: id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "Note already downloaded!" });
    }

    const note = await noteModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate("user");

    await bumpPopularScore(id, 1);
    await invalidateNotesCache({ noteId: id, userId: req.user.id });

    emitDomainEvent("NOTE_DOWNLOADED", {
      userId: req.user.id,
      email: updatedUser.email,
      noteId: id,
      noteTitle: note?.title,
    });

    return res.json({ success: true, message: "Note downloaded successfully!", user: updatedUser });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const bookmarkNote = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const { id } = req.body;

    if (user.bookmarks.includes(id)) return res.json({ success: false, message: "Note already exists in bookmark!" });

    user.bookmarks.push(id);
    await user.save();
    return res.json({ success: true, message: "Note bookmarked successfully!", user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const { id } = req.body;

    if (!user.bookmarks.includes(id)) return res.json({ success: false, message: "Note does not exists in bookmark!" });

    user.bookmarks.pull(id);
    await user.save();
    return res.json({ success: true, message: "Note removed from bookmarked!", user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, degree, college, branch, semester } = req.body;
    const file = req.file;

    let result = null;
    if (file) {
      result = await cloudinary.uploader.upload(file.path, {
        folder: "note",
        resource_type: "auto",
        access_mode: "public",
      });
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.user.id,
        { name, email, degree, college, branch, semester, profileImg: result?.secure_url || "" },
        { new: true }
      )
      .populate("downloads")
      .populate("uploads")
      .populate("bookmarks");

    res.json({ success: true, message: "User updated successfully!", user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const temp = async (req, res) => {
  const result = await User.updateMany({ messages: { $exists: false } }, { $set: { messages: [] } });
  res.json({ success: true, message: "Updated successfully!", result });
};

export const addMsg = async (req, res) => {
  const { messages } = req.body;
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    messages.forEach((msg) => user.messages.push(msg));
    await user.save();
    res.json({ success: true, message: "Messages added successfully!", messages: user.messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const clearMsg = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  try {
    user.messages = [];
    await user.save();
    res.json({ success: true, message: "Chat history cleared successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const listUser = async (req, res) => {
  try {
    const users = await User.aggregate([{ $sort: { points: -1 } }, { $project: { name: 1, points: 1 } }]);
    return res.json({ success: true, users });
  } catch (err) {
    return res.json({ succes: false, message: "Internal Server Error!" });
  }
};
