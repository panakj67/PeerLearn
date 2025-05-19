const express = require('express');
const {test, login, register, isAuthorised, logout, downloadNote, updateUser} = require('../controllers/userController.js');
const { authUser } = require('../middleware/authUser.js');
const upload = require('../config/multer.js');

const userRouter = express.Router()

userRouter.get('/test', authUser, test);
userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.get('/is-auth', authUser, isAuthorised);
userRouter.get('/logout', logout);
userRouter.post('/download', authUser, downloadNote);
userRouter.post('/update', upload.single('file'), authUser, updateUser);

module.exports = userRouter