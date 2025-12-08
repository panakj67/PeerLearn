import express from 'express';
import { test, login, register, isAuthorised, logout, downloadNote, updateUser, temp, addMsg, clearMsg, bookmarkNote, removeBookmark, getLeaderboard } from '../controllers/userController.js';
import { authUser } from '../middleware/authUser.js';
import upload from '../config/multer.js';

const userRouter = express.Router();

userRouter.get('/test', authUser, test);
userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.get('/is-auth', authUser, isAuthorised);
userRouter.get('/logout', logout);
userRouter.post('/download', authUser, downloadNote);

userRouter.post('/bookmark', authUser, bookmarkNote);
userRouter.post('/removebookmark', authUser, removeBookmark);

userRouter.post('/update', upload.single('file'), authUser, updateUser);
userRouter.get('/temp', temp);
userRouter.post('/addmsg', authUser, addMsg);
userRouter.post('/clear', authUser, clearMsg);
userRouter.get('/getLeaderboard', getLeaderboard);

export default userRouter;
