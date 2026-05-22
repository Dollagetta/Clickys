import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ 
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const systemInstruction = `You are an expert AI personal shopping assistant for "Clickys", an affiliate product recommendation site.
Your goal is to parse user queries or images and return exactly 4 product recommendations in valid JSON format.
You MUST search the web to find real, currently available products based on the query that can be purchased in India (Amazon.in, Flipkart, Myntra, AJIO etc.).
Return ONLY a JSON array of objects.

JSON Schema:
[
  {
    "id": "generate-unique-id",
    "name": "Exact Product Title",
    "category": "e.g., Electronics, Fashion, Home",
    "price": "e.g., ₹1,499.00",
    "description": "1 short sentence explaining why it's a good fit",
    "imageUrl": "Direct high-quality image URL. MUST NOT BE EMPTY.",
    "link": "Direct link to buy the product (use affiliate tag 'tag=dollagetta-21' for Amazon.in)",
    "platform": "e.g., Amazon, Flipkart",
    "rating": 4.5
  }
]`;

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { userQuery, imageBase64, imageMimeType } = await req.json();
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json({ error: 'Gemini API Key is missing.' }, { status: 500 });
    }
    console.log('Gemini API Key found, proceeding with request.');

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
      parts.unshift({ text: "Identify products in this image and recommend similar ones available in India." });
    }

    const contents = { parts };

    console.log('Sending request to Gemini with parts:', parts.length);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    console.log('Response text received from Gemini:', text ? text.substring(0, 100) + '...' : 'empty');

    if (!text) {
        throw new Error('Model returned an empty response.');
    }

    // Since we used responseMimeType, text should be clean JSON
    let data;
    try {
        data = JSON.parse(text);
    } catch (parseErr) {
        // Fallback for non-json response if it happens
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
            data = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('Failed to parse model response as JSON: ' + text);
        }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in AI Shopper route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
