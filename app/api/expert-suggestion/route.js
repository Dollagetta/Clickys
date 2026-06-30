import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req) {
  try {
    const { prompt, type } = await req.json();

    const systemInstruction = type === 'compare' 
      ? "You are a friendly, knowledgeable shopping expert. Help the user compare these products and make a suggestion. Be conversational, concise, and helpful. Do NOT use words like 'AI', 'assistant', 'bot', or 'AI shop'."
      : "You are a friendly, knowledgeable personal shopper. Give the user a quick, warm suggestion for their gift search. Be conversational, concise, and helpful. Do NOT use words like 'AI', 'assistant', 'bot', or 'AI shop'.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ suggestion: response.text });
  } catch (error) {
    console.error("AI suggestion error:", error);
    return NextResponse.json({ suggestion: "I'm having a little trouble thinking of a suggestion right now, but the options above look great!" }, { status: 200 });
  }
}
