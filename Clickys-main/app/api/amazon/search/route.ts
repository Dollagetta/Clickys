import { NextResponse } from 'next/server';
import { searchAmazonProducts } from '../../../../lib/amazon/search-products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let query = searchParams.get('q');
    
    // Default search if none provided to show some products initially
    if (!query || query.trim() === '' || query === 'All') {
      query = 'Trending Tech'; 
    }

    const products = await searchAmazonProducts(query, 8);
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('API Route Error /amazon/search:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
