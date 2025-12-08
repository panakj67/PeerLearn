import { GoogleGenAI } from "@google/genai" ;
import 'dotenv/config';
console.log("API key is:", process.env.GEMINI_API_KEY);


const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

const main = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "meaning of pankaj",
  });
  console.log(response.text);
}

const generate = async () => {
    try {
        const result = await main();
        console.log(result);
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

generate();