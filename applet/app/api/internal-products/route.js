import { createClient } from '../../../prismicio';
import { NextResponse } from 'next/server';
import * as prismic from '@prismicio/client';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  try {
    const client = createClient();
    const predicates = [prismic.predicate.at('document.type', 'product')];
    if (q) {
      predicates.push(prismic.predicate.fulltext('my.product.title', q));
    }
    
    // Also include 'deal' eventually or just 'product'? "all products in my site"
    // We'll search 'product'.

    const response = await client.getAllByType('product', {
      predicates,
      orderings: [{ field: 'document.first_publication_date', direction: 'desc' }],
      limit: 20
    });

    const products = response.map(p => {
      // Find the first valid image
      let imageUrl = p.data?.image?.url || p.data?.cover_image?.url || '';
      if (!imageUrl && p.data?.slices) {
        for (const s of p.data.slices) {
          if (s.primary?.image?.url) { imageUrl = s.primary.image.url; break; }
          if (s.primary?.product_image?.url) { imageUrl = s.primary.product_image.url; break; }
        }
      }

      return {
        id: p.uid,
        title: p.data?.title || 'Unknown Product',
        image: imageUrl,
        price: p.data?.price || '',
        category: p.data?.category || '',
        link: `/products/${p.uid}`
      };
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
