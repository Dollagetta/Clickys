import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const systemInstruction = `You are an expert AI personal shopping assistant for "Clickys", an affiliate product recommendation site.
Your goal is to parse user queries or images and return the top 4 product recommendations in the exact JSON format specified.
You MUST search the web to find real, currently available products based on the query that can be purchased in India (Amazon.in, Flipkart, Myntra, etc.).
Do not return conversational text outside of the JSON block.
Ensure prices are formatted as INR (₹).

JSON Format Required:
[
  {
    "id": "generate-unique-id",
    "name": "Exact Product Title",
    "category": "e.g., Electronics, Fashion, Home",
    "price": "e.g., ₹1,499.00",
    "description": "1 short sentence explaining why it's a good fit",
    "imageUrl": "Direct high-quality image URL (use Google Search Google Images). MUST NOT BE EMPTY.",
    "link": "Direct link to buy the product",
    "platform": "e.g., Amazon, Flipkart",
    "rating": 4.5
  }
]`;

export async function POST(req) {
  try {
    const { userQuery, imageBase64, imageMimeType } = await req.json();
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is missing.' }, { status: 500 });
    }

    let parts = [];
    if (userQuery) parts.push({ text: userQuery });
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: imageBase64
        }
      });
    }

    if (parts.length === 1 && imageBase64) {
      parts.unshift({ text: "Find products like this image" });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      }
    });

    const jsonText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonText);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in AI Shopper route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
