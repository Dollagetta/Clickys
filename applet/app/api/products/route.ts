import { NextResponse } from 'next/server';
import { fetchProductsFromSheet } from '@/lib/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryQuery = searchParams.get('category');
    
    const products = await fetchProductsFromSheet(categoryQuery);

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || 'Failed', stack: error.stack }, { status: 500 });
  }
}
