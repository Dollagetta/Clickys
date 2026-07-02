import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio';
import * as prismic from '@prismicio/client';
import { fetchProductsFromSheet } from '../../../lib/products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'All';
    let queryParam = query;
    let isBroad = false;

    if (!queryParam || queryParam.trim() === '' || queryParam === 'All') {
      if (category && category !== 'All') {
         queryParam = category;
      } else {
         isBroad = true;
         queryParam = 'Trending';
      }
    }

    // 1. Fetch data in parallel
    const client = createClient();
    let prismicPromise;
    if (isBroad) {
      prismicPromise = client.get({
        filters: [prismic.filter.any('document.type', ['product', 'pinterestgrid', 'guide'])],
        pageSize: 40,
        orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
      });
    } else {
      prismicPromise = client.get({
        filters: [
          prismic.filter.any('document.type', ['product', 'pinterestgrid', 'guide']),
          prismic.filter.fulltext('document', queryParam)
        ],
        pageSize: 40
      });
    }

    const sheetPromise = fetchProductsFromSheet().catch(() => []);

    // 15 seconds overall timeout for external fetches
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Search Timeout')), 15000)
    );

    const [prismicRes, rawSheetProducts] = await Promise.race([
      Promise.all([
        prismicPromise.catch(e => {
          console.error("Prismic global search error:", e);
          return { results: [] };
        }),
        sheetPromise
      ]),
      timeoutPromise.catch(() => [{ results: [] }, []])
    ]);

    const mappedPrismic = (prismicRes.results || []).map(p => {
       // Helper to extract a usable title/image/link
       let title = p.data?.title || p.data?.name || p.data?.partner_name || 'Item';
       let image = p.data?.image || p.data?.meta_image || p.data?.image1 || p.data?.partner_logo || null;
       let link = p.data?.link?.url || (p.type === 'guide' ? `/deals` : p.type === 'partner' ? `/partners` : `/products/${p.uid || ''}`);

       let platform = p.data?.platform || 'Clickys';
       if (p.type === 'partner') platform = 'Partner';
       else if (link) {
          const url = link.toLowerCase();
          if (url.includes('flipkart')) platform = 'Flipkart';
          else if (url.includes('myntra')) platform = 'Myntra';
          else if (url.includes('meesho')) platform = 'Meesho';
          else if (url.includes('ajio')) platform = 'Ajio';
       }

       return {
         id: p.id,
         type: p.type,
         name: typeof title === 'string' ? title : 
               (Array.isArray(title) && title[0]?.text) ? title[0].text : 'Item',
         category: p.data?.category || p.type,
         price: p.data?.price !== undefined && p.data?.price !== null ? p.data.price : '',
         imageUrl: image,
         amazonLink: link,
         platform: platform,
         discount: p.data?.discount !== undefined && p.data?.discount !== null ? p.data.discount : '',
         description: p.data?.description || p.data?.meta_description || p.data?.partner_description || '',
       }
    });

    const lowerQuery = (queryParam || '').toLowerCase();

    // 2. Filter Google Sheet Products (Already fetched in parallel)
    let sheetProducts = [];
    try {
      sheetProducts = rawSheetProducts
        .filter(p => {
          if (isBroad) return true;
          return (p.title && p.title.toLowerCase().includes(lowerQuery)) ||
                 (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
                 (p.platform && p.platform.toLowerCase().includes(lowerQuery)) ||
                 (p.description && p.description.toLowerCase().includes(lowerQuery));
        })
        .map((p, idx) => ({
          id: `sheet-${idx}`,
          name: p.title,
          category: p.category,
          price: p.price,
          imageUrl: p.image,
          amazonLink: p.link, // kept prop name as it might be used globally as link, even if not strictly amazon
          platform: p.platform || 'Daily Deals',
          discount: p.discount,
          description: p.description
        }));
    } catch (e) {
      console.error("Sheet products search error:", e);
    }

    let combined = [...mappedPrismic, ...sheetProducts];

    // Client-side Category Filter
    if (category && category !== 'All') {
       const lowerCat = category.toLowerCase();
       combined = combined.filter(p => p.category && p.category.toLowerCase().includes(lowerCat));
    }

    return NextResponse.json({ results: combined });

  } catch(e) {
    console.error(e);
    return NextResponse.json({ results: [], error: true, details: e.message || 'Unknown error' }, { status: 200 });
  }
}
