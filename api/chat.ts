import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION =
  "You are Romendra's virtual assistant. You are friendly, creative, and brief. " +
  "You talk about Romendra's skills in React, Next.js, and Full-stack development as mentioned in his portfolio. " +
  "Keep answers under 3 sentences. Use a slightly casual, handwritten-note tone.";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing GOOGLE_API_KEY" });
      return;
    }

    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Invalid message" });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    res.status(200).json({ text: result.text || "" });
  } catch (err) {
    res.status(500).json({ error: "AI request failed" });
  }
}
