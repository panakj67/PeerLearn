import { addMessage } from "../controllers/messageController.js";
import userModel from "../models/userModel.js";

export const initSocket = (io) => {

  io.on("connection", (socket) => {
    // id > roomId
    socket.on("join-room", (id) => {
      console.log(id);
      socket.join(id);
    });

    socket.on("send-message", async ({ id, message }) => {
      console.log("📨 send-message to room:", id);

      await addMessage(id, message);

      const senderDets = await userModel.findById(message.sender).select("name profileImg");

      io.to(id).emit("receive-message", {
        sender: {
            _id : message.sender,
            name : senderDets?.name || "Unknown",
            profileImg : senderDets?.profileImg,
        },
        text: message.text,
        time: new Date(),
      });

    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });

  });
};
