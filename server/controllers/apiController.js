import { GoogleGenAI } from "@google/genai";
import { get_encoding } from "@dqbd/tiktoken";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const tokenizer = get_encoding("cl100k_base");

const sessionStore = {};
const MAX_INPUT_TOKENS = 2000;

// Count tokens in text using tokenizer
const getTokenCount = (text) => tokenizer.encode(text).length;

// Build trimmed chat history to keep token count under MAX_INPUT_TOKENS
const buildTrimmedContext = (sessionMessages) => {
  const systemPrompt = {
    role: "user",
    parts: [{ text: "You are a helpful AI tutor for high school and college students. Be concise and clear in your answers." }],
  };

  let totalTokens = getTokenCount(systemPrompt.parts[0].text);
  const context = [systemPrompt];

  // Add user/model messages from latest to oldest until token limit reached
  for (let i = sessionMessages.length - 1; i >= 0; i--) {
    const message = sessionMessages[i];
    // Each message parts array contains objects with a text property, sum tokens for all parts
    const messageTokens = message.parts.reduce((acc, part) => acc + getTokenCount(part.text), 0);

    if (totalTokens + messageTokens > MAX_INPUT_TOKENS) break;

    context.unshift(message);
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

    // Initialize session history if not present
    if (!sessionStore[sessionId]) {
      sessionStore[sessionId] = [];
    }

    // Push user message in SDK chat format
    sessionStore[sessionId].push({
      role: "user",
      parts: [{ text: prompt }],
    });

    // Build trimmed history including system prompt, to respect token limit
    const history = buildTrimmedContext(sessionStore[sessionId]);

    // Create chat instance with trimmed history
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
    });

    // Send user prompt with config
    const response = await chat.sendMessage({
      message: prompt,
      config: {
        maxOutputTokens: 280,
        temperature: 0.1,
      },
    });

    // Save AI response in session history
    sessionStore[sessionId].push({
      role: "model",
      parts: [{ text: response.text }],
    });

    res.json({ success: true, text: response.text });
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
