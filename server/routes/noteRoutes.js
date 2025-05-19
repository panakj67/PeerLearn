const express = require('express');
const {testNote, createNotes, getNotes, temp, handleEvent} = require('../controllers/noteController');
const upload = require('../config/multer');
const { authUser } = require('../middleware/authUser');

const noteRouter = express.Router()

noteRouter.get('/test', testNote)
noteRouter.post('/create-notes',upload.single('file'), authUser, createNotes)
noteRouter.get('/get', getNotes)
noteRouter.post('/:noteId', handleEvent)
noteRouter.get('/temp', temp)

module.exports = noteRouter;