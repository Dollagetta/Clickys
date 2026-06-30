import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

let ai;
function getAIClient() {
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'dummy-key-to-prevent-crash',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

export async function POST(req) {
  try {
    const { prompt, type } = await req.json();

    const systemInstruction = type === 'compare' 
      ? "You are a friendly, knowledgeable shopping expert. Help the user compare these products and make a suggestion. Be conversational, concise, and helpful. Format your response cleanly using markdown bullets. Do NOT use words like 'AI', 'assistant', 'bot', or 'AI shop'."
      : "You are a friendly, knowledgeable personal shopper. Give the user a quick, warm suggestion for their gift search. Be conversational, concise, and helpful. Format your response cleanly using markdown. Do NOT use words like 'AI', 'assistant', 'bot', or 'AI shop'.";

    const aiClient = getAIClient();
    if (!process.env.GEMINI_API_KEY) {
       console.warn('GEMINI_API_KEY is missing, returning default suggestion.');
       return NextResponse.json({ suggestion: "I'm having a little trouble thinking of a suggestion right now, but the options above look great!" }, { status: 200 });
    }

    const response = await aiClient.models.generateContent({
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
