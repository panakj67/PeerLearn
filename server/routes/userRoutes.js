import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  test, login, register, googleLogin, verifyEmailOtp, resendEmailOtp,
  forgotPassword, resetPassword, refreshAccessToken,
  isAuthorised, logout, downloadNote, updateUser, temp, addMsg, clearMsg, bookmarkNote, removeBookmark, listUser
} from '../controllers/userController.js';
import { authUser } from '../middleware/authUser.js';
import upload from '../config/multer.js';

const userRouter = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 20),
  message: { success: false, message: 'Too many auth attempts. Please try again later.' },
});

userRouter.get('/test', authUser, test);
userRouter.post('/login', authLimiter, login);
userRouter.post('/register', authLimiter, register);
userRouter.post('/google-login', authLimiter, googleLogin);
userRouter.post('/verify-email-otp', authLimiter, verifyEmailOtp);
userRouter.post('/resend-email-otp', authLimiter, resendEmailOtp);
userRouter.post('/forgot-password', authLimiter, forgotPassword);
userRouter.post('/reset-password', authLimiter, resetPassword);
userRouter.post('/refresh-token', refreshAccessToken);

userRouter.get('/is-auth', authUser, isAuthorised);
userRouter.get('/logout', logout);
userRouter.post('/download', authUser, downloadNote);

userRouter.post('/bookmark', authUser, bookmarkNote);
userRouter.post('/removebookmark', authUser, removeBookmark);

userRouter.post('/update', upload.single('file'), authUser, updateUser);
userRouter.get('/temp', temp);
userRouter.post('/addmsg', authUser, addMsg);
userRouter.post('/clear', authUser, clearMsg);
userRouter.get('/listUser', authUser, listUser);

export default userRouter;
