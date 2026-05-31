// File: /app/api/guides/route.js

import { NextResponse } from 'next/server';
import { fetchGuidesFromSheet } from '../../../lib/guides';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'recent';
  const category = searchParams.get('category');
  const platform = searchParams.get('platform');
  const searchQuery = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '24', 10);

  try {
    let guides = await fetchGuidesFromSheet(false);

    // Filtering
    if (category) {
      guides = guides.filter(g => g.category.toLowerCase() === category.toLowerCase());
    }
    
    if (platform) {
      guides = guides.filter(g => g.platform && g.platform.toLowerCase() === platform.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      guides = guides.filter(g => 
        (g.title && g.title.toLowerCase().includes(q)) || 
        (g.description && g.description.toLowerCase().includes(q))
      );
    }

    // Sorting (simplified for Sheets data)
    if (sort === 'title_asc') {
      guides.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'title_desc') {
      guides.sort((a, b) => b.title.localeCompare(a.title));
    }

    const total = guides.length;
    const offset = (page - 1) * limit;
    guides = guides.slice(offset, offset + limit);

    // Map to a lighter format for listing as requested
    const listings = guides.map(g => ({
      slug: g.slug,
      title: g.title,
      image: g.image,
      price: g.price,
      discount: g.discount,
      description: g.description,
      category: g.category,
      platform: g.platform
    }));

    return NextResponse.json({
      guides: listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('API Guides error:', error);
    return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 });
  }
}
