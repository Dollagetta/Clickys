import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio';

export const dynamic = 'force-dynamic';

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export async function GET() {
  const client = createClient();
  const allProducts = await client.getAllByType('product', {
    limit: 20,
    orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
  });
  
  // Filter products
  const validProducts = allProducts.filter(p => p.data && p.data.title && p.data.price);
  const shuffled = shuffleArray(validProducts).slice(0, 8);
  
  const formattedLaunches = shuffled.map((p) => {
    let priceVal = p.data.price;
    if (typeof priceVal === 'number' && priceVal === 0) {
      priceVal = "Check Price";
    } else if (typeof priceVal === 'number') {
      priceVal = `₹${priceVal}`;
    }
    
    let deducedPlatform = "Amazon";
    if (p.data.platform) {
      deducedPlatform = p.data.platform;
    } else if (p.data.link?.url) {
      const url = p.data.link.url.toLowerCase();
      if (url.includes('myntra')) deducedPlatform = 'Myntra';
      else if (url.includes('ajio')) deducedPlatform = 'Ajio';
      else if (url.includes('flipkart')) deducedPlatform = 'Flipkart';
      else if (url.includes('meesho')) deducedPlatform = 'Meesho';
      else if (url.includes('amazon') || url.includes('amzn')) deducedPlatform = 'Amazon';
      else deducedPlatform = 'Store';
    }
    
    const prismicAsText = (field) => {
      if (!field) return "";
      if (typeof field === 'string') return field;
      if (Array.isArray(field)) {
        return field.map(block => block.text || "").join(" ");
      }
      return "";
    };
    
    return {
      id: p.id,
      name: p.data.title,
      brand: 'Clickys',
      category: p.data.category || 'General',
      price: priceVal,
      launchDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      description: prismicAsText(p.data.description) || prismicAsText(p.data.short_description) || "Trending product you might love.",
      imageUrl: p.data.image?.url,
      link: p.data.link?.url,
      platform: deducedPlatform,
      isNew: true,
      badge: "Trending",
    };
  });

  return NextResponse.json({ launches: formattedLaunches });
}
