import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toggleChatVisible } from "../features/users/userSlice";

import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io("https://peerlearn.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});

const GroupChat = () => {
  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { id } = useParams();

  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const [groupMsg, setGroupMsg] = useState([]);
  //   console.log(groupMsg);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMsg]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`/api/messages/${id}`);
      setGroupMsg(res.data.messages);
    };

    fetchMessages();

    if (socket && socket.connected) {
      socket.emit("join-room", id);
      console.log("joined room", id);
    } else {
      console.warn("Socket not connected when trying to join room.");
    }

    // socket.emit("join-room", id);

    socket.on("receive-message", (data) => {
      console.log(data);

      if (data.sender._id === user._id) return;
      setGroupMsg((prev) => [...prev, data]);
    });

    dispatch(toggleChatVisible());

    return () => {
      socket.off("receive-message");
    };
  }, [id]);

  //   console.log(groupMsg);

  const handleSend = async () => {
    if (input.trim() && user) {
      socket.emit("send-message", {
        id,
        message: { sender: user._id, text: input },
      });
      setGroupMsg((prev) => [
        ...prev,
        {
          sender: {
            _id: user._id,
            name: user.name,
            profileImg: user.profileImg,
          },
          text: input,
        },
      ]);

      setInput("");
    } else toast.error("You are not authorised!!");
  };

  return (
    <div className="fixed z-50 -bottom-2 right-4 w-120 h-[99%] rounded-2xl shadow-lg overflow-hidden bg-white font-sans flex flex-col border border-gray-300">
      {/* Warning */}

      {/* Header */}

      <div className="bg-gradient-to-r from-[#2538DF] via-[#06B3FA] to-[#0596f7] text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="https://cdn-icons-png.freepik.com/512/6388/6388074.png"
            alt="agent"
            className="rounded-full w-8 h-8"
          />
          <div>
            <p className="font-semibold text-2xl">You're not alone!</p>
          </div>
        </div>
        <button
          className="text-white cursor-pointer text-2xl"
          onClick={() => dispatch(toggleChatVisible())}
        >
          ×
        </button>
      </div>

      <div className="relative p-2 bg-gradient-to-r from-[#2538DF] via-[#06B3FA] to-[#0596f7] text-white">
        {/* Header content */}
        <p className="text-sm pb-6 text-green-200 text-[20px]">
          ● join the conversation 😊!
        </p>
        {/* Wavy bottom SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full h-7 transform rotate-180"
          viewBox="0 0 500 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C150,60 350,0 500,20 L500,00 L0,0 Z"
            style={{ fill: "#f9fafb" }}
          ></path>
        </svg>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Image message with quick reply */}

        {/* Dynamic messages */}
        {groupMsg.map((msg, idx) => {
          const isCurrentUser = msg.sender._id === user._id;
          const isSameSenderAsPrevious =
            idx > 0 && groupMsg[idx - 1].sender._id === msg.sender._id;

          return (
            <div
              key={idx}
              className={`flex flex-col max-w-[80%] mb-3 ${
                isCurrentUser ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div className="flex items-start">
                {/* Avatar Column (always 40px wide) */}
                {!isCurrentUser && (
                  <div className="w-10 mr-2 flex-shrink-0">
                    {!isSameSenderAsPrevious ? (
                      <img
                        className="h-10 w-10 object-cover border-2 border-blue-600 object-top rounded-full"
                        src={
                          msg.sender.profileImg ||
                          "https://cdn-icons-png.flaticon.com/512/9815/9815472.png"
                        }
                        alt="sender"
                      />
                    ) : (
                      <div className="h-10" /> // empty div to preserve space
                    )}
                  </div>
                )}

                <div>
                  {/* Name */}
                  {!isCurrentUser && !isSameSenderAsPrevious && (
                    <h2 className="text-sm text-purple-700 text-left font-semibold mb-1">
                      {msg.sender.name?.split(" ")[0]}
                    </h2>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`px-4 py-2 rounded-xl shadow-md text-md leading-tight break-words max-w-full ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-[#2143e2] via-[#06B3FA] to-[#0596f7] text-white rounded-br-none"
                        : "bg-gray-100 text-black rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* <div className="px-2 h-[2px] bg-gray-300"></div> */}

      {/* Input */}
      <div className="pb-4 p-1 bg-gray-50 flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-full text-md font-semibold focus:outline-none"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`p-4  bottom-2 shadow-xl cursor-pointer rounded-full text-white ${
            !input.trim()
              ? "bg-blue-600"
              : "bg-gradient-to-r from-[#2538DF] via-[#0990d9] to-[#0596f7] hover:bg-blue-700"
          }`}
        >
          <svg
            className="w-5 h-5 rotate-45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
