import mongoose from "mongoose";

const messageSubSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,  // makes sure no duplicate rooms
  },
  messages: [messageSubSchema],
});

export default mongoose.model("Room", roomSchema);
