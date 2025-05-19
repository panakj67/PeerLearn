const noteModel = require('../models/noteModel')
const cloudinary = require("../config/cloudinary");
const userModel = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const { log } = require('console');
const Note = require('../models/noteModel');



const testNote = (req, res) => {
    res.send("Note routes is working");
}

const createNotes = async (req, res) => {
  try {
    const { title, college, degree, semester, branch, subject } = req.body;
    const file = req.file;   
   
    if (!file) {
      return res.json({ success: false, message: "No file provided" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto',    // auto detects image, raw, video, etc.
      folder: 'notes',     // optional folder
      access_mode: 'public',    // IMPORTANT: makes file publicly accessible
      use_filename: true,
      unique_filename: false,
      format: 'pdf',
  });

    const fileUrl = result.secure_url;


    // -------------- NEW PART START ----------------
    const firstPageImageUrl = fileUrl.replace('.pdf', '.jpg') + '#page=1';
    console.log("firstPageImageUrl", firstPageImageUrl);
    


 
 
     // -------------- NEW PART END ----------------

    const note =  await noteModel.create({
      title,
      college,
      degree,
      semester,
      branch,
      subject,
      image : firstPageImageUrl,
      fileUrl,
      user : req.user.id,
    });

    let user = await userModel.findById(req.user.id);
    user.uploads.push(note._id);
    user.points += 10;
    await user.save();

    res.json({
      success: true,
      message: "Document submitted successfully",
      note
    });
  } catch (error) {
    console.error("Error in createNotes:", error);
    res.json({ success: false, message: error.message });
  }
}

const getNotes = async (req, res) => {
    try {

      const notes = await noteModel.find().populate('user')
      res.json({success : true, notes})
    } catch (error) {
      return res.json({success : false, message : error.message})
    }
}

const handleEvent = async (req, res) => {
    try {
        const { id, event } = req.body;
        const {noteId} = req.params;

        const note = await noteModel.findById(noteId)

        const liked = note.like.includes(id);
        const disliked = note.dislike.includes(id);
        console.log(liked, ":", id);

        if(event === 'like'){
           if(liked){
              note.like.pull(id);
              await note.save()
           }else {
            note.like.push(id);
            await note.save()
          }
           if(disliked){
              note.dislike.pull(id)
           }
        }

        else if(event === 'dislike'){
           if(disliked){
              note.dislike.pull(id);
           }else note.dislike.push(id);
           if(liked){
              note.like.pull(id)
           }
        }

        await note.save();
        res.json({ success: true, message: "successfully updated", note });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



const temp = async(req, res) => {
   console.log('hui')
   res.json({message : "Hui Hui Hui"})
}




module.exports = {testNote, createNotes, getNotes, temp, handleEvent}