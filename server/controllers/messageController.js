import roomModel from "../models/roomModel.js";

export const addMessage = async (roomId, message) => {
  try {
    const MAX_MESSAGES = 250;

    // Step 1: Add the new message
    const updatedRoom = await roomModel.findOneAndUpdate(
      { roomId },
      { $push: { messages: message } },
      { new: true, upsert: true }
    );

    // Step 2: Check if messages exceed the limit
    if (updatedRoom.messages.length > MAX_MESSAGES) {
      const excess = updatedRoom.messages.length - MAX_MESSAGES;

      // Remove oldest messages
      updatedRoom.messages.splice(0, excess);

      // Save updated document with limited messages
      await updatedRoom.save();
    }

  } catch (error) {
    console.log("Error adding message:", error.message);
  }
};


export const fetchMessages = async (req, res) => {
    try {
        const { id } = req.params;

    const room = await roomModel.findOne({ roomId : id }).populate('messages.sender', 'name profileImg')

    if (!room) {
      return res.json({ success: false, messages : [] });
    }

     res.json({success : true, messages : room.messages})
    } catch (error) {
      res.json({succsess : true, message : error.message})
    }
}
