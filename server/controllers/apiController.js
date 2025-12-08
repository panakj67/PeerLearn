import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

import { get_encoding } from "@dqbd/tiktoken";
import 'dotenv/config';

//const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ai = new Groq({ apiKey: process.env.GROQ_API_KEY});

const tokenizer = get_encoding("cl100k_base");

const sessionStore = {};
const MAX_INPUT_TOKENS = 2000;

// Count tokens in text using tokenizer
const getTokenCount = (text) => tokenizer.encode(text).length;

const normalizeRole = (role) => {
  if (!role) return "user";

  const r = role.toLowerCase();

  if (r === "system") return "system";
  if (r === "user") return "user";
  if (r === "assistant") return "assistant";

  // Gemini's "model" should map to assistant
  if (r === "model") return "assistant";

  return "user";
};


// Build trimmed chat history to keep token count under MAX_INPUT_TOKENS
const buildTrimmedContext = (sessionMessages) => {
  const systemPrompt = {
  role: "system",
  content: `
You are a helpful AI tutor for high school and college students.

You ALWAYS reply in clean, well-structured Markdown with emojis.

🎯 Formatting Rules:
1️⃣ ALWAYS start with a main heading (##)(bold) 
2️⃣ Use subheadings (###)  (medium bold)
3️⃣ Use bullet points & numbered lists  
4️⃣ Keep answers short, clear & easy  
5️⃣ Bold important terms  
6️⃣ Use emojis to make explanations engaging (Good quality colorful) 
7️⃣ NEVER reply in long plain text paragraphs  
8️⃣ ALWAYS output proper Markdown  

Follow these rules STRICTLY for every response.
  `,
};


  let totalTokens = getTokenCount(systemPrompt.content);
  const context = [systemPrompt];

  for (let i = sessionMessages.length - 1; i >= 0; i--) {
    const msg = sessionMessages[i];

    const normalized = {
      role: normalizeRole(msg.role),
      content: msg.content || "",
    };

    const messageTokens = getTokenCount(normalized.content);

    if (totalTokens + messageTokens > MAX_INPUT_TOKENS) break;

    context.unshift(normalized);
    totalTokens += messageTokens;
  }

  return context;
};


const generateContent = async (req, res) => {
  try {
    const { sessionId, prompt } = req.body;

    if (!sessionId || !prompt) {
      return res.status(400).json({ success: false, message: "Both 'sessionId' and 'prompt' are required" });
    }

    // init session
    if (!sessionStore[sessionId]) sessionStore[sessionId] = [];

    // Push user message in SDK chat format
    sessionStore[sessionId].push({
  role: "user",
  content: prompt
}
);

    // Build trimmed history including system prompt, to respect token limit
    const history = buildTrimmedContext(sessionStore[sessionId]);

    // Create chat instance with trimmed history
    // const chat = ai.chats.create({
    //   model: "gemini-2.0-flash",
    //   history,
    // });

    // Send user prompt with config
    // const response = await chat.sendMessage({
    //   message: prompt,
    //   config: {
    //     maxOutputTokens: 280,
    //     temperature: 0.1,
    //   },
    // });

    const response = await ai.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: history,
  max_tokens: 280,
  temperature: 0.1,
});

 const botReply = response.choices[0].message.content;


    // Save AI response in session history
    sessionStore[sessionId].push({
  role: "assistant",
  content: botReply
});


    res.json({ success: true, text: botReply });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate content",
      error: error.message,
    });
  }
};

export default generateContent;
