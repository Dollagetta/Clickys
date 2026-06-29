import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { productTitle, description, category } = await req.json();

    if (!productTitle) {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }

    const prompt = `You are an AI Shopping Assistant for Clickys.in. 
    Analyze the following product and provide a concise (max 2 sentences) "AI Insight" on why a user might want to buy it. 
    Focus on value, use-case, or unique features.
    
    Product: ${productTitle}
    Category: ${category}
    Description: ${description}
    
    Response format: Just the insight text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = response.text || "No insight available.";

    return NextResponse.json({ insight: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
