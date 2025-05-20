import express from 'express';
import { test, login, register, isAuthorised, logout, downloadNote, updateUser, temp, addMsg, clearMsg } from '../controllers/userController.js';
import { authUser } from '../middleware/authUser.js';
import upload from '../config/multer.js';

const userRouter = express.Router();

userRouter.get('/test', authUser, test);
userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.get('/is-auth', authUser, isAuthorised);
userRouter.get('/logout', logout);
userRouter.post('/download', authUser, downloadNote);
userRouter.post('/update', upload.single('file'), authUser, updateUser);
userRouter.get('/temp', temp);
userRouter.post('/addmsg', authUser, addMsg);
userRouter.post('/clear', authUser, clearMsg);

export default userRouter;
