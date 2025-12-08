import { addMessage } from "../controllers/messageController.js";
import userModel from "../models/userModel.js";

export const initSocket = (io) => {

  // Listen for new client connections
  io.on("connection", (socket) => {

    console.log(`✅ New user connected: ${socket.id}`);

    // When a user joins a specific chat room (roomId = id)
    socket.on("join-room", (id) => {
      console.log(`🚪 User ${socket.id} joined room: ${id}`);
      socket.join(id);
    });

    // When a user sends a message to the room
    socket.on("send-message", async ({ id, message }) => {
      console.log(`📨 User ${socket.id} sent message to room: ${id}`);

      // Save the message to the database
      await addMessage(id, message);

      // Fetch sender's details for displaying in the chat
      const senderDets = await userModel.findById(message.sender).select("name profileImg");

      // Emit the message to all clients in the room
      io.to(id).emit("receive-message", {
        sender: {
          _id: message.sender,
          name: senderDets?.name || "Unknown",
          profileImg: senderDets?.profileImg,
        },
        text: message.text,
        time: new Date(),
      });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });

  });
};
