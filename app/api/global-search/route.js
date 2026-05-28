import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio';
import * as prismic from '@prismicio/client';
import { searchAmazonProducts } from '../../../lib/amazon/search-products';
import { products as localProducts } from '../../../components/products';
import { products as flipkartProducts } from '../../../components/flipkartProducts';

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
       let title = p.data?.title || p.data?.name || p.data?.partner_name || 'Item';
       let image = p.data?.image || p.data?.meta_image || p.data?.image1 || p.data?.partner_logo || null;
       let link = p.data?.link?.url || (p.type === 'guide' ? `/deals` : p.type === 'partner' ? `/partners` : `/products/${p.uid || ''}`);

       let platform = p.data?.platform || 'Clickys';
       if (p.type === 'partner') platform = 'Partner';
       else if (link) {
          const url = link.toLowerCase();
          if (url.includes('amazon') || url.includes('amzn')) platform = 'Amazon';
          else if (url.includes('flipkart')) platform = 'Flipkart';
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
         price: p.data?.price || 0,
         imageUrl: image,
         amazonLink: link,
         platform: platform,
         discount: p.data?.discount || 0,
         description: p.data?.description || p.data?.meta_description || p.data?.partner_description || '',
         data: p.data // raw data
       }
    });

    // 3. Fetch from local products (including Daily Deals)
    const lowerQuery = queryParam.toLowerCase();
    const allLocal = [...localProducts, ...flipkartProducts].map(p => ({
      ...p,
      platform: (p.amazonLink || '').toLowerCase().includes('flipkart') || (p.amazonLink || '').toLowerCase().includes('fktr.in') ? 'Flipkart' : 'Amazon'
    }));

    const matchedLocalProducts = isBroad 
      ? allLocal 
      : allLocal.filter(p => 
          (p.name && p.name.toLowerCase().includes(lowerQuery)) || 
          (p.shortDescription && p.shortDescription.toLowerCase().includes(lowerQuery)) || 
          (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
          (p.platform && p.platform.toLowerCase().includes(lowerQuery)) ||
          (p.amazonLink && p.amazonLink.toLowerCase().includes(lowerQuery)) // Match by URL too
        );

    // 4. Fetch from Google Sheet (Daily Deals)
    let sheetProducts = [];
    try {
      const { fetchProductsFromSheet } = await import('../../../lib/products');
      const rawSheetProducts = await fetchProductsFromSheet().catch(() => []);
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
          amazonLink: p.link,
          platform: p.platform || 'Daily Deals',
          discount: p.discount,
          description: p.description
        }));
    } catch (e) {
      console.error("Sheet products search error:", e);
    }

    let combined = [...amazonProducts, ...mappedPrismic, ...matchedLocalProducts, ...sheetProducts];

    // Client-side Category Filter (since Amazon & Prismic fulltext might ignore exact category matches)
    if (category && category !== 'All') {
       const lowerCat = category.toLowerCase();
       combined = combined.filter(p => p.category && p.category.toLowerCase().includes(lowerCat));
    }

    return NextResponse.json({ results: combined });

  } catch(e) {
    console.error(e);
    return NextResponse.json({ results: [], error: true }, { status: 500 });
  }
}
