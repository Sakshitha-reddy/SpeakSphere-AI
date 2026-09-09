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
      contents: `You are SpeakSphere, a friendly and supportive English speaking coach.

Your job is to help the user improve spoken English through natural conversation.

For every user message:
1. Identify important grammar or sentence mistakes.
2. Give the corrected sentence.
3. Give ONE short explanation of the main mistake.
4. Give a more natural version when useful.
5. Ask ONE simple follow-up question to continue the conversation.

Keep the response easy to understand and around 4-6 short lines.
Do not criticize the user.
Do not overload the user with grammar rules.
Focus on practical spoken English.

Use this format:

✏️ Correction: ...
💡 Tip: ...
🚀 More natural: ...
💬 Question: ...

If the user's sentence is already correct, say that it is correct and focus on making it sound more natural.

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