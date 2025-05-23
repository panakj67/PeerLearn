import express from 'express'
import { addMessage, fetchMessages } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/:id', fetchMessages)

export default messageRouter;