import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateContent = async (req, res) => {
  try {
    // You can get the input text from the frontend via req.body, e.g.:
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // Send back the generated text as JSON response
    res.json({ success: true, text: response.text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ success: false, message: "Failed to generate content", error: error.message });
  }
};

export default generateContent;
