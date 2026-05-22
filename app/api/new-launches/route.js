import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const AMAZON_PARTNER_TAG = process.env.AMAZON_PARTNER_TAG || 'dollagetta-21';

function injectAffiliateTag(products) {
  if (!Array.isArray(products)) return products;
  return products.map((product) => {
    if (!product.link) return product;
    try {
      const url = new URL(product.link);
      const isAmazon = url.hostname.includes('amazon.in') ||
                       url.hostname.includes('amzn.to') ||
                       url.hostname.includes('amzn.in') ||
                       url.hostname.includes('amazon.com');
      if (isAmazon) {
        url.searchParams.set('tag', AMAZON_PARTNER_TAG);
        return { ...product, link: url.toString() };
      }
    } catch { /* ignore URL parse errors */ }
    return product;
  });
}

const systemPrompt = `You are a product launch researcher for "Clickys", an Indian affiliate shopping site.
You MUST use the googleSearch tool to find exactly 8 of the NEWEST, most recently launched products available for purchase in India right now (launched in 2026 ONLY).
Find trending ecommerce consumer products, electronics, fashion, gadgets, home products.

CRITICAL INSTRUCTION FOR DATES:
- Ensure the "launchDate" reflects the estimated release month/year (e.g., "Jan 2026"). It MUST be 2026. Do NOT invent exact unavailable release dates.

Return ONLY a valid JSON array. Do NOT include markdown or explanations. Do NOT add affiliate tags to links.

JSON Schema:
[
  {
    "id": "unique-slug-id",
    "name": "Exact Product Name",
    "brand": "Brand Name",
    "category": "e.g., Smartphones, Laptops, Audio, Fashion, Home",
    "price": "₹XX,XXX",
    "launchDate": "e.g., May 2026",
    "description": "One sentence: what makes this launch exciting",
    "affiliateKeywords": "search keywords to find this product on affiliate sites",
    "link": "Direct buy link on Amazon.in or Flipkart or brand site",
    "platform": "Amazon or Flipkart or Brand",
    "isNew": true,
    "badge": "e.g., Just Launched, Hot Drop, Exclusive"
  }
]`;

// Fallback data when Gemini is unavailable
const fallbackLaunches = [
  {
    id: "samsung-galaxy-s25-edge",
    name: "Samsung Galaxy S25 Edge",
    brand: "Samsung",
    category: "Smartphones",
    price: "₹1,09,999",
    launchDate: "May 2026",
    description: "Ultra-thin titanium design with the most powerful Galaxy processor yet.",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/2501/gallery/in-galaxy-s25-edge-sm-s937-sm-s937bzkginu-thumb-543534640",
    link: "https://www.amazon.in/s?k=Samsung+Galaxy+S25+Edge&tag=dollagetta-21",
    platform: "Amazon",
    isNew: true,
    badge: "Just Launched"
  },
  {
    id: "oneplus-13t",
    name: "OnePlus 13T",
    brand: "OnePlus",
    category: "Smartphones",
    price: "₹49,999",
    launchDate: "May 2026",
    description: "Snapdragon 8 Elite with 100W charging and a massive 6000mAh battery.",
    imageUrl: "https://image01.oneplus.net/ebp/202501/09/1-m00-52-83-cpgnwmetxp2ab1z5aatjmdtfcpa716.png",
    link: "https://www.amazon.in/s?k=OnePlus+13T&tag=dollagetta-21",
    platform: "Amazon",
    isNew: true,
    badge: "Hot Drop"
  },
  {
    id: "apple-airpods-4",
    name: "Apple AirPods 4",
    brand: "Apple",
    category: "Audio",
    price: "₹14,990",
    launchDate: "Sep 2026",
    description: "Redesigned with active noise cancellation and USB-C charging case.",
    imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MUWY3?wid=1144&hei=1144&fmt=jpeg",
    link: "https://www.amazon.in/s?k=Apple+AirPods+4&tag=dollagetta-21",
    platform: "Amazon",
    isNew: true,
    badge: "Bestseller"
  },
  {
    id: "realme-gt-7-pro",
    name: "Realme GT 7 Pro",
    brand: "Realme",
    category: "Smartphones",
    price: "₹59,999",
    launchDate: "Nov 2026",
    description: "Snapdragon 8 Elite flagship with satellite connectivity and 120W charging.",
    imageUrl: "https://image.realme.com/content/dam/realme-web/in/products/smartphone/realme-gt-7-pro/realme-gt-7-pro-submariner-blue-kv.png",
    link: "https://www.amazon.in/s?k=Realme+GT+7+Pro&tag=dollagetta-21",
    platform: "Amazon",
    isNew: true,
    badge: "Exclusive"
  },
  {
    id: "sony-wh-1000xm6",
    name: "Sony WH-1000XM6",
    brand: "Sony",
    category: "Audio",
    price: "₹34,990",
    launchDate: "Apr 2026",
    description: "Industry-leading ANC with 40hr battery life and foldable design.",
    imageUrl: "https://www.sony.co.in/image/5d02da5df552836db894cead8a68f56a?fmt=png-alpha&wid=660",
    link: "https://www.amazon.in/s?k=Sony+WH-1000XM6&tag=dollagetta-21",
    platform: "Amazon",
    isNew: true,
    badge: "Just Launched"
  },
  {
    id: "nothing-phone-3",
    name: "Nothing Phone (3)",
    brand: "Nothing",
    category: "Smartphones",
    price: "₹49,999",
    launchDate: "Apr 2026",
    description: "Revolutionary Glyph 3.0 interface with Snapdragon 8s Gen 3 power.",
    imageUrl: "https://in.nothing.tech/cdn/shop/files/Phone3_Img.jpg?v=1748430090",
    link: "https://www.amazon.in/s?k=Nothing+Phone+3&tag=dollagetta-21",
    platform: "Amazon",
    isNew: true,
    badge: "Hot Drop"
  },
  {
    id: "samsung-galaxy-watch-ultra",
    name: "Samsung Galaxy Watch Ultra",
    brand: "Samsung",
    category: "Wearables",
    price: "₹69,999",
    launchDate: "Jul 2026",
    description: "Rugged titanium build with advanced health metrics and 60hr battery.",
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/sm-l705fzsains/gallery/in-galaxy-watch-ultra-sm-l705-sm-l705fzsains-thumb-543175033",
    link: "https://www.amazon.in/s?k=Samsung+Galaxy+Watch+Ultra&tag=dollagetta-21",
    platform: "Amazon",
    isNew: true,
    badge: "Exclusive"
  },
  {
    id: "iqoo-neo-10",
    name: "iQOO Neo 10",
    brand: "iQOO",
    category: "Smartphones",
    price: "₹29,999",
    launchDate: "Dec 2026",
    description: "Snapdragon 8s Gen 3, 144Hz AMOLED and 120W flash charge in mid-range.",
    imageUrl: "https://www.vivo.com/content/dam/iqoo/products/iqoo-neo10/iqoo-neo-10-kv.png",
    link: "https://www.amazon.in/s?k=iQOO+Neo+10&tag=dollagetta-21",
    platform: "Amazon",
    isNew: true,
    badge: "Just Launched"
  }
];

export const revalidate = 43200; // 12 hours cache

export async function GET() {
  if (!ai) {
    return NextResponse.json({ launches: injectAffiliateTag(fallbackLaunches) });
  }

  const MAX_RETRIES = 2;
  let text = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: 'Find the 8 newest product launches in India in 2026 ONLY across smartphones, laptops, earbuds, smartwatches. Return only JSON array.' }] },
        config: {
          systemInstruction: systemPrompt,
          tools: [{ googleSearch: {} }],
        }
      });
      text = response.text;
      if (text) break;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        console.error('New launches Gemini error:', err.message);
        return NextResponse.json({ launches: fallbackLaunches });
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  if (!text) {
    return NextResponse.json({ launches: fallbackLaunches });
  }

  try {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const match = text.match(/\\[\\s*\\{[\\s\\S]*\\}\\s*\\]/);
      data = match ? JSON.parse(match[0]) : fallbackLaunches;
    }
    const tagged = injectAffiliateTag(Array.isArray(data) ? data : fallbackLaunches);
    
    const withImages = tagged.map(item => {
      const safeTitle = item.name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      const safeCategory = item.category.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      
      const prompt = `Professional ecommerce product photography of ${safeTitle} ${safeCategory}, premium studio lighting, clean white background`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=400&nologo=true`;

      return {
        ...item,
        imageUrl: imageUrl
      };
    });

    return NextResponse.json({ launches: withImages });
  } catch {
    return NextResponse.json({ launches: fallbackLaunches });
  }
}
