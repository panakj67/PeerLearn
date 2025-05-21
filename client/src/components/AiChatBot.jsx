import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleVisible, setMessages, clearMessages } from "../features/users/userSlice";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const AiChatBot = () => {
  // const [messages, setMessages] = useState([]);
  const msg = useSelector((state) => state.user?.messages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const visible = useSelector((state) => state.user?.visible);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  const messages = useSelector((state) => state.user?.messages);
  console.log("messages", messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    // setMessages((prev) => [...prev, userMessage]);
    dispatch(setMessages(userMessage));
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { prompt: input });
      const botMessage = {
        sender: "bot",
        text: res.data.text,
      };
      dispatch(setMessages(botMessage));

      if (user) {
        // console.log("hello")
        try {
          axios.post("/api/user/addmsg", {
            messages: [userMessage, botMessage],
          });
        } catch (error) {
          toast.error(error.message);
        }
      }

    } catch (error) {
      console.error("Error:", error);
      dispatch(
        setMessages({
          sender: "bot",
          text: "Something went wrong. Please try again.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if(messages.length == 0){
      setShow(false);
      return;
    }
    dispatch(clearMessages());
    try {
      const {data} = await axios.post('/api/user/clear');
      if(data.success) toast.success(data.message);
      else toast.error(data.message)
    } catch (error) {
      console.log(error.message);
      toast.error(error.message)
    }
    setShow(false);
  }

  return (
    <div className="fixed z-50 bottom-1 right-4 w-92 h-[99%] rounded-2xl shadow-lg overflow-hidden bg-white font-sans flex flex-col border border-gray-300">
      {/* Warning */}
      {show && 
         <div className="h-full w-full backdrop-blur-xs absolute z-52">
             <div className="absolute text-center top-1/2 pb-2 w-55 px-2 left-1/2 rounded-2xl transform -translate-x-1/2 -translate-y-1/2 border-2 bg-gradient-to-r from-white to-orange-100 border-orange-300 text-white">
                <h1 className="text-red-500 font-bold">WARNING !!</h1>
                <p className="text-gray-900 leading-tight">Are you sure you want to clear the chat ??</p>
                <div className="flex gap-4 mt-3 justify-center">
                   <button onClick={() => setShow(false)} className="p-1 px-3 rounded cursor-pointer bg-gray-500 text-xs font-bold">cancel</button>
                   <button onClick={handleClearChat} className="p-1 px-3 rounded cursor-pointer bg-red-600 text-xs font-bold">clear</button>
                </div>
              </div>
         </div>
      }

      {/* Header */}

      <div className="bg-gradient-to-r from-[#2538DF] to-[#06B3FA] text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="https://www.shutterstock.com/image-vector/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
            alt="agent"
            className="rounded-full w-8 h-8"
          />
          <div>
            <p className="font-semibold text-2xl">Chat with us!</p>
          </div>
        </div>
        <button
          className="text-white cursor-pointer text-2xl"
          onClick={() => dispatch(toggleVisible())}
        >
          ×
        </button>
      </div>

      <div className="relative p-2 bg-gradient-to-r from-[#2538DF] to-[#06B3FA] text-white p-3">
        {/* Header content */}
        <p className="text-sm pb-6 text-green-200 text-[20px]">
          ● We're online!
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
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[80%] mb-3 ${
              msg.sender === "user"
                ? "ml-auto items-end"
                : "mr-auto items-start"
            }`}
          >
            <div
              className={`px-4 py-1 rounded-xl leading-tight text-md shadow ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-[#2143e2] to-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && <p className="text-start italic text-gray-400">Typing…</p>}

        <div ref={messagesEndRef} />
      </div>

      {/* <div className="px-2 h-[2px] bg-gray-300"></div> */}

      <div onClick={() => setShow(true)} className="absolute p-2 h-10 w-10 group right-1 top-20 shadow-xl cursor-pointer flex items-center justify-center rounded-full bg-red-500">
         <FaTrash size={20} style={{color : "white"}}/>
      </div>

      {/* Input */}
      <div className="pb-4 p-1 bg-gray-50 flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-full text-md font-semibold focus:outline-none"
        />
        
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className={`p-4  bottom-2 shadow-xl cursor-pointer rounded-full text-white ${
            loading || !input.trim()
              ? "bg-blue-600"
              : "bg-gradient-to-r from-[#2538DF] to-[#06B3FA] hover:bg-blue-700"
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

export default AiChatBot;
