import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio';
import * as prismic from '@prismicio/client';
import { searchAmazonProducts } from '../../../lib/amazon/search-products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    let queryParam = query;
    let isBroad = false;

    if (!queryParam || queryParam.trim() === '' || queryParam === 'All') {
      isBroad = true;
      queryParam = 'Trending';
    }

    // 1. Fetch from Prismic (Any matching document)
    const client = createClient();
    let prismicPromise;
    if (isBroad) {
      prismicPromise = client.get({
        pageSize: 40,
        orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
      });
    } else {
      prismicPromise = client.get({
        filters: [prismic.filter.fulltext('document', queryParam)],
        pageSize: 40
      });
    }

    prismicPromise = prismicPromise.catch(e => {
      console.error("Prismic global search error:", e);
      return { results: [] };
    });

    // 2. Fetch from Amazon Partners (PAAPI)
    // Wrap to prevent Amazon failures from crashing the request
    const amazonPromise = searchAmazonProducts(queryParam, 12).catch(e => {
      console.error("Amazon global search error:", e);
      return [];
    });

    const [prismicRes, amazonProducts] = await Promise.all([prismicPromise, amazonPromise]);

    const mappedPrismic = (prismicRes.results || []).map(p => {
       // Helper to extract a usable title/image/link
       const title = p.data?.title || p.data?.name || 'Item';
       const image = p.data?.image || p.data?.meta_image || p.data?.image1 || null;
       const link = p.data?.link?.url || (p.type === 'guide' ? `/deals` : `/products/${p.uid || ''}`);

       return {
         id: p.id,
         type: p.type,
         name: typeof title === 'string' ? title : 
               (Array.isArray(title) && title[0]?.text) ? title[0].text : 'Item',
         category: p.data?.category || p.type,
         price: p.data?.price || 0,
         imageUrl: image,
         amazonLink: link,
         platform: p.data?.platform || 'Clickys',
         discount: p.data?.discount || 0,
         description: p.data?.description || p.data?.meta_description || '',
         data: p.data // raw data
       }
    });

    const combined = [...amazonProducts, ...mappedPrismic];
    return NextResponse.json({ results: combined });

  } catch(e) {
    console.error(e);
    return NextResponse.json({ results: [], error: true }, { status: 500 });
  }
}
