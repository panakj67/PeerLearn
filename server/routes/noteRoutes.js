import express from 'express';
import { testNote, createNotes, getNotes, temp, handleEvent, deleteNote } from '../controllers/noteController.js';
import upload from '../config/multer.js';
import { authUser } from '../middleware/authUser.js';

const noteRouter = express.Router();

noteRouter.get('/test', testNote);
noteRouter.post('/create-notes', upload.single('file'), authUser, createNotes);
noteRouter.get('/get', getNotes);
noteRouter.post('/:noteId', handleEvent);
noteRouter.delete('/delete/:id', authUser, deleteNote);
noteRouter.get('/temp', temp);



export default noteRouter;
