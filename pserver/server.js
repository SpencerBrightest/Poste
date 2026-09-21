// Main Express application entry point and route setup
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api/ai", aiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

// Starts the HTTP server on the configured port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});