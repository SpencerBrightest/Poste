// Handles AI content generation requests
import askPostingAI from "../services/gemini.service.js";

// POST /api/ai/generate
// Expects: { prompt: string }
// Returns: { success: true, response: string } or { success: false, message: string }
const generateAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await askPostingAI(prompt);

    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
    });
  }
};

export default generateAI;
