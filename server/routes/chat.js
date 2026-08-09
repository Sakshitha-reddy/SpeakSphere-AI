import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "Please say something first.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
     model: "gemini-3.6-flash",
      contents: `You are SpeakSphere, a friendly English speaking tutor.

Correct grammar politely.
Keep responses short, around 2-4 sentences.
Encourage the user to continue speaking.

User: ${message}`,
    });

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      reply: "Sorry, I'm having trouble responding right now.",
    });
  }
});

export default router;