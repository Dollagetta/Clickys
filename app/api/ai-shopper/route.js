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
      model: 'gemini-3.5-flash', 
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
    // Return friendly fallback data when Gemini hits quota or fails
    const fallbackData = [
      {
        id: "fallback-1",
        name: "Apple AirPods Pro (2nd Gen)",
        category: "Audio",
        price: "₹24,900",
        description: "Great noise cancelling earbuds, highly recommended in India.",
        imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg",
        link: "https://www.amazon.in/s?k=Apple+AirPods+Pro+2nd+Gen&tag=dollagetta-21",
        platform: "Amazon",
        rating: 4.8
      },
      {
        id: "fallback-2",
        name: "Samsung Galaxy S24 Ultra",
        category: "Smartphones",
        price: "₹1,29,999",
        description: "A premium flagship phone with excellent cameras and AI features.",
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bzkqins-thumb-539573335",
        link: "https://www.amazon.in/s?k=Samsung+Galaxy+S24+Ultra&tag=dollagetta-21",
        platform: "Amazon",
        rating: 4.7
      }
    ];
    return NextResponse.json({ data: fallbackData });
  }
}
