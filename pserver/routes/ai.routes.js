// Defines routes for AI content generation endpoints
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import generateAI from "../controllers/ai.controller.js";

const router = express.Router();

// Generate an AI response (protected — requires valid session)
router.post("/generate", authMiddleware, generateAI);

export default router;