import noteModel from "../models/noteModel.js";
import cloudinary from "../config/cloudinary.js";
import userModel from "../models/userModel.js";

export const testNote = (req, res) => {
  res.send("Note routes is working");
};

export const createNotes = async (req, res) => {
  try {
    const { title, college, degree, semester, branch, subject } = req.body;
    const file = req.file;

    if (!file) {
      return res.json({ success: false, message: "No file provided" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto", // auto detects image, raw, video, etc.
      folder: "notes", // optional folder
      access_mode: "public", // makes file publicly accessible
      use_filename: true,
      unique_filename: false,
      format: "pdf",
    });

    const fileUrl = result.secure_url;

    // Construct first page image URL for preview (assuming cloudinary supports this)
    const firstPageImageUrl = fileUrl.replace(".pdf", ".jpg") + "#page=1";
    console.log("firstPageImageUrl", firstPageImageUrl);

    const user = await userModel.findById(req.user.id);

    let note = await noteModel.create({
      title,
      college,
      degree,
      semester,
      branch,
      subject,
      image: firstPageImageUrl,
      fileUrl,
      user: req.user.id,
    });

    note = await note.populate("user");

    user.uploads.push(note._id);
    user.points += 10;
    await user.save();

    res.json({
      success: true,
      message: "Document submitted successfully",
      note,
    });
  } catch (error) {
    console.error("Error in createNotes:", error);
    res.json({ success: false, message: error.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find().populate("user");
    res.json({ success: true, notes });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const handleEvent = async (req, res) => {
  try {
    const { id, event } = req.body;
    const { noteId } = req.params;

    const note = await noteModel.findById(noteId).populate("user");

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const liked = note.like.includes(id);
    const disliked = note.dislike.includes(id);

    if (event === "like") {
      if (liked) {
        note.like.pull(id);
      } else {
        note.like.push(id);
        if (disliked) {
          note.dislike.pull(id);
        }
      }
      
    } else if (event === "dislike") {
      if (disliked) {
        note.dislike.pull(id);
      } else {
        note.dislike.push(id);
        if (liked) {
          note.like.pull(id);
        }
      }
    }

    await note.save();
    res.json({ success: true, message: "Successfully updated", note });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const temp = async (req, res) => {
  console.log("hui");
  res.json({ message: "Hui Hui Hui" });
};

export const deleteNote = async (req, res) => {
  try {
    console.log("hui")
    const { id } = req.params;
    
    const note = await noteModel.findByIdAndDelete(id);
    

    await userModel.updateMany(
        { $or: [{ 'uploads._id': id }, { 'downloads._id': id }] },
        {
          $pull: {
            uploads: {_id : id},
            downloads: {_id : id},
          },
        }
      );

    res.json({ success: true, message: "Notes deleted successfully" });
  } catch (error) {
    res.json({success : false, message : error.message});
  }
};
