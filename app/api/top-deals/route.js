import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio';
import * as prismic from '@prismicio/client';

export async function GET(request) {
  try {
    const client = createClient();
    
    // Fetch all products from Prismic
    // We fetch a generous amount to find enough for each platform/category combo
    const prismicRes = await client.get({
      filters: [prismic.filter.at('document.type', 'product')],
      pageSize: 200,
      orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
    });

    const mappedProducts = (prismicRes.results || []).map(p => {
       let title = p.data?.title || p.data?.name || 'Item';
       let image = p.data?.image || p.data?.meta_image || p.data?.image1 || null;
       let link = p.data?.link?.url || `/products/${p.uid || ''}`;

       let platform = p.data?.platform || 'Amazon';
       const url = link.toLowerCase();
       if (url.includes('flipkart')) platform = 'Flipkart';
       else if (url.includes('myntra')) platform = 'Myntra';
       else if (url.includes('ajio')) platform = 'Ajio';
       else if (url.includes('amazon')) platform = 'Amazon';

       return {
         id: p.id,
         title: typeof title === 'string' ? title : (Array.isArray(title) && title[0]?.text ? title[0].text : 'Item'),
         category: p.data?.category || 'General',
         price: p.data?.price || '',
         oldPrice: p.data?.old_price || p.data?.original_price || '',
         image: image?.url || image,
         link: link,
         platform: platform,
         discount: p.data?.discount || ''
       };
    });

    const categories = ['Fashion', 'Electronics', 'Beauty', 'Health', 'Gifts', 'Mobiles', 'Laptops'];
    const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Ajio'];

    const dealsByCategory = {};

    categories.forEach(cat => {
      dealsByCategory[cat.toLowerCase()] = {};
      platforms.forEach(plat => {
        // Filter products for this category and platform
        const filtered = mappedProducts.filter(p => 
          p.category?.toLowerCase() === cat.toLowerCase() && 
          p.platform?.toLowerCase() === plat.toLowerCase()
        ).slice(0, 4);
        
        dealsByCategory[cat.toLowerCase()][plat.toLowerCase()] = filtered;
      });
    });

    return NextResponse.json({ dealsByCategory });
  } catch (error) {
    console.error('Top deals fetch error:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}
