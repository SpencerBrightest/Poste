// Handles AI-assisted post content generation using Google Gemini
import { GoogleGenAI } from "@google/genai";
import POSTE_AI_CONTEXT from "../prompts/poste.prompt.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Generates post suggestions based on user prompt and posting context
async function askPostingAI(userprompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${POSTE_AI_CONTEXT}

user request:
${userprompt}`,
  });

  return response.text;
}

export default askPostingAI;