import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import noteModel from "../models/noteModel.js";
import { OAuth2Client } from "google-auth-library";
import { emitDomainEvent } from "../queues/producers/eventProducer.js";
import { bumpPopularScore, invalidateNotesCache } from "../services/notesCache.service.js";
import { sendEmail } from "../services/email.service.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getGoogleAudiences = () => {
  const single = process.env.GOOGLE_CLIENT_ID ? [process.env.GOOGLE_CLIENT_ID] : [];
  const multi = (process.env.GOOGLE_CLIENT_IDS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return [...new Set([...single, ...multi])];
};
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const signAccessToken = (userId) => jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" });
const signRefreshToken = (userId) => jwt.sign({ id: userId, type: "refresh" }, process.env.SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" });

const hashToken = (value) => crypto.createHash("sha256").update(value).digest("hex");

const setAuthCookies = async (res, user) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};

const sendVerificationOtp = async (user) => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.emailOtpHash = hashToken(otp);
  user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "PeerLearn Email Verification OTP",
    text: `Hi ${user.name}, your OTP is ${otp}. It expires in 10 minutes.`,
  });
};

export const test = (req, res) => {
  return res.json({ message: "Note routes is working", id: req.user.id });
};

export const login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const { password } = req.body;

  try {
    const user = await userModel.findOne({ email }).populate("uploads").populate("downloads").populate("bookmarks");
    if (!user) return res.json({ success: false, message: "User does not exist." });

    if (!user.password) return res.json({ success: false, message: "This account uses Google login. Please continue with Google." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Invalid email or password." });

    if (!user.isEmailVerified) {
      await sendVerificationOtp(user);
      return res.json({ success: false, message: "Email not verified. OTP sent to your email.", requiresVerification: true, email: user.email });
    }

    const accessToken = await setAuthCookies(res, user);
    return res.json({ success: true, message: "LoggedIn successfully!", user, accessToken });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const { password } = req.body;

  try {
    if (!PASSWORD_REGEX.test(password || "")) {
      return res.json({ success: false, message: "Password must be 8+ chars with uppercase, lowercase, number and special character." });
    }

    const user = await userModel.findOne({ email });
    if (user) return res.json({ success: false, message: "User already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({ name, email, password: hashedPassword, isEmailVerified: false });
    await sendVerificationOtp(newUser);

    emitDomainEvent("USER_REGISTERED", { userId: newUser._id, email: newUser.email, name: newUser.name });
    return res.json({ success: true, message: "User created. Verify OTP sent to your email.", requiresVerification: true, email: newUser.email });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found." });

    if (!user.emailOtpHash || !user.emailOtpExpires || user.emailOtpExpires < new Date()) {
      return res.json({ success: false, message: "OTP expired. Please request again." });
    }

    if (hashToken(otp) !== user.emailOtpHash) {
      return res.json({ success: false, message: "Invalid OTP." });
    }

    user.isEmailVerified = true;
    user.emailOtpHash = "";
    user.emailOtpExpires = null;
    const accessToken = await setAuthCookies(res, user);

    const populated = await userModel.findById(user._id).populate("uploads").populate("downloads").populate("bookmarks");
    return res.json({ success: true, message: "Email verified successfully!", user: populated, accessToken });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resendEmailOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found." });

    await sendVerificationOtp(user);
    return res.json({ success: true, message: "OTP resent successfully." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: true, message: "If account exists, reset instructions sent." });

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordTokenHash = hashToken(rawToken);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/?resetToken=${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "PeerLearn Password Reset",
      text: `Reset your password with this link: ${resetUrl}`,
    });

    return res.json({ success: true, message: "If account exists, reset instructions sent." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body.token || "");
    const password = String(req.body.password || "");

    if (!PASSWORD_REGEX.test(password)) {
      return res.json({ success: false, message: "Password must be 8+ chars with uppercase, lowercase, number and special character." });
    }

    const hashed = hashToken(token);
    const user = await userModel.findOne({ resetPasswordTokenHash: hashed, resetPasswordExpires: { $gt: new Date() } });
    if (!user) return res.json({ success: false, message: "Invalid or expired reset token." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordTokenHash = "";
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ success: true, message: "Password reset successful. Please login." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "Missing refresh token" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded?.type !== "refresh") {
      return res.status(401).json({ success: false, message: "Invalid token type" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user || !user.refreshTokenHash || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    const accessToken = signAccessToken(user._id);
    const nextRefreshToken = signRefreshToken(user._id);
    user.refreshTokenHash = hashToken(nextRefreshToken);
    await user.save();

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", nextRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, accessToken });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Refresh token expired" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const audiences = getGoogleAudiences();
    if (!audiences.length) return res.json({ success: false, message: "Google login is not configured on server." });

    const credential = req.body.credential || req.body.token;
    if (!credential) return res.json({ success: false, message: "Missing Google credential." });

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: audiences });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.json({ success: false, message: "Unable to fetch Google profile." });
    if (payload.email_verified === false) return res.json({ success: false, message: "Google email is not verified." });

    const normalizedEmail = String(payload.email).trim().toLowerCase();
    let user = await userModel.findOne({ email: normalizedEmail }).populate("uploads").populate("downloads").populate("bookmarks");

    if (!user) {
      user = await userModel.create({
        name: payload.name || payload.email.split("@")[0],
        email: normalizedEmail,
        googleId: payload.sub || "",
        profileImg: payload.picture || "",
        isEmailVerified: true,
      });
      emitDomainEvent("USER_REGISTERED", { userId: user._id, email: user.email, name: user.name });
      user = await user.populate("uploads").populate("downloads").populate("bookmarks");
    }

    const updates = {};
    if (!user.googleId && payload.sub) updates.googleId = payload.sub;
    if (!user.profileImg && payload.picture) updates.profileImg = payload.picture;
    if (!user.isEmailVerified) updates.isEmailVerified = true;
    if (Object.keys(updates).length) {
      user = await userModel.findByIdAndUpdate(user._id, updates, { new: true }).populate("uploads").populate("downloads").populate("bookmarks");
    }

    const accessToken = await setAuthCookies(res, user);
    return res.json({ success: true, message: "Google login successful", user, accessToken });
  } catch (error) {
    return res.json({ success: false, message: `Google login failed: ${error.message}` });
  }
};

export const isAuthorised = async (req, res) => {
  try {
    if (!req.user) return res.json({ success: false, message: "You are not authorised" });

    const user = await userModel.findById(req.user.id).select("-password -refreshTokenHash -emailOtpHash -resetPasswordTokenHash").populate("uploads").populate("downloads").populate("bookmarks");
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (req.user?.id) {
      await userModel.findByIdAndUpdate(req.user.id, { refreshTokenHash: "" });
    } else if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
        if (decoded?.id) {
          await userModel.findByIdAndUpdate(decoded.id, { refreshTokenHash: "" });
        }
      } catch {
        // ignore invalid/expired refresh token during logout
      }
    }

    res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ success: true, message: "Logout Successfully!" });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
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

    if (!updatedUser) return res.json({ success: false, message: "Note already downloaded!" });

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
