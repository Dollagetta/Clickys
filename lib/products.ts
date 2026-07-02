import { GoogleAuth } from 'google-auth-library';
import { unstable_cache } from 'next/cache';
import { createClient } from '../prismicio';
import * as prismic from '@prismicio/client';

async function _fetchProductsFromSheet() {
  let clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  let sheetId = process.env.PRODUCT_SHEET_ID;
  
  if (sheetId && sheetId.includes('docs.google.com/spreadsheets/d/')) {
    const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      sheetId = match[1];
    }
  }

  // Robust Fallback: If GOOGLE credentials are not set directly, check FIREBASE_SERVICE_ACCOUNT_KEY
  if (!clientEmail || !privateKey) {
    const serviceAccountKeyStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKeyStr) {
      try {
        const sa = JSON.parse(serviceAccountKeyStr);
        if (sa.client_email) clientEmail = sa.client_email;
        if (sa.private_key) privateKey = sa.private_key;
        console.log('[Products] Successfully extracted Google credentials from FIREBASE_SERVICE_ACCOUNT_KEY');
      } catch (e) {
        console.error("[Products] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY for Google Sheets authentication:", e);
      }
    }
  }

  if (!clientEmail || !privateKey) {
    console.warn('[Products] Missing Google Auth environment variables (GOOGLE_CLIENT_EMAIL/GOOGLE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT_KEY). Returning empty products list.');
    return [];
  }

  if (!sheetId) {
    console.warn('[Products] Missing PRODUCT_SHEET_ID environment variable. Returning empty products list.');
    return [];
  }

  // Global timeout for the entire operation to prevent "eternal loading"
  const fetchPromise = (async () => {
    try {
      console.log('[Products] Starting fetch operation...');
      const auth = new GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      let accessToken;
      try {
        const tokenResult: any = await Promise.race([
          auth.getAccessToken(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Auth Timeout')), 10000))
        ]);
        accessToken = typeof tokenResult === 'string' ? tokenResult : tokenResult.token;
        console.log('[Products] Got access token');
      } catch (tokenError) {
        console.error('[Products] Access token error:', tokenError);
        throw tokenError;
      }

      console.log(`[Products] Fetching sheet: ${sheetId}`);
      
      const response = await auth.request({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:I`,
        method: 'GET'
      });
      
      console.log(`[Products] Response: ${response.status}`);
      if (response.status !== 200) {
          console.error(`[Products] Google Sheets API Error: ${response.status} ${response.statusText}`);
          return [];
      }

      const data: any = response.data;
      const rows = data.values || [];
      console.log(`[Products] Fetched ${rows.length} rows`);
    
      // Map rows to structured objects (ensure we filter out empty rows/headers)
      let products = rows
          .filter((row: any[]) => row && row[0] && row[0].toLowerCase() !== 'title')
          .reverse()
          .map((row: any[]) => ({
            title: row[0] || '',
            price: row[1] || '',
            link: row[2] || '',
            image: row[3] || '',
            category: row[4] || 'Uncategorized',
            discount: row[5] || '',
            platform: row[6] || '',
            description: row[7] || row[8] || ''
          }));

      return products;
    } catch (error) {
      console.error('[Products] Error fetching products:', error);
      return [];
    }
  })();

  return fetchPromise;
}

async function _fetchProductsFromPrismic() {
  try {
    const client = createClient();
    const response = await client.get({
      filters: [prismic.filter.at('document.type', 'product')],
      pageSize: 100,
      orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
    });

    return (response.results || []).map((p: any) => {
      let title = p.data?.title || p.data?.name || p.data?.product_name || 'Item';
      if (Array.isArray(title)) {
        title = title[0]?.text || 'Item';
      }
      
      let image = p.data?.image?.url || p.data?.meta_image?.url || p.data?.image1?.url || '';
      if (!image && p.data?.image) image = p.data.image; // Handle case where image might be a string or object

      let link = p.data?.link?.url || p.data?.amazon_link?.url || `/products/${p.uid || p.id}`;
      
      let platform = p.data?.platform || p.data?.platform_name || 'Amazon';
      if (typeof platform === 'object' && platform?.id) {
         // It might be a relationship field, we'll try to guess from UID or just use Amazon
         platform = 'Amazon'; 
      }

      const url = String(link || '').toLowerCase();
      if (url.includes('flipkart') || url.includes('fktr.in')) platform = 'Flipkart';
      else if (url.includes('myntra')) platform = 'Myntra';
      else if (url.includes('ajio')) platform = 'Ajio';
      else if (url.includes('amazon') || url.includes('amzn')) platform = 'Amazon';
      else if (url.includes('meesho')) platform = 'Meesho';

      const price = p.data?.price || '';
      const discount = p.data?.discount || '';
      
      // Calculate old price if discount is available
      let oldPrice = p.data?.old_price || null;
      let savings = null;
      
      if (!oldPrice && discount && price) {
        const parsedPrice = parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
        const parsedDiscount = parseFloat(String(discount).replace(/[^0-9.]/g, "")) || 0;
        if (parsedDiscount > 0) {
            oldPrice = parsedPrice + parsedDiscount;
            savings = `Save ₹${parsedDiscount}`;
        }
      }

      return {
        id: p.id,
        title: title,
        name: title, // Support both name and title
        price: price,
        oldPrice: oldPrice ? (String(oldPrice).startsWith('₹') ? oldPrice : `₹${oldPrice}`) : null,
        savings: savings,
        link: link,
        amazonLink: link, // Support both amazonLink and link
        image: image,
        imageUrl: image, // Support both imageUrl and image
        category: p.data?.category || 'Uncategorized',
        discount: discount,
        platform: platform,
        description: p.data?.description || '',
        rating: p.data?.rating || 4.5,
        reviewCount: p.data?.review_count || 100,
        featured: p.data?.featured === true
      };
    });
  } catch (error) {
    console.error('[Products] Prismic fetch error:', error);
    return [];
  }
}

let _productsCache: any[] | null = null;
let _productsCacheTime = 0;

export async function fetchProductsFromSheet(categoryQuery: string | null = null) {
  const cacheAge = Date.now() - _productsCacheTime;
  // Use cache if it exists and is less than 10 minutes old
  if (_productsCache && _productsCache.length > 0 && cacheAge < 600000) {
    let products = _productsCache;
    if (categoryQuery) {
      products = products.filter((p: any) => p.category && p.category.toLowerCase() === categoryQuery.toLowerCase());
    }
    return products;
  }

  try {
    let products = await _fetchProductsFromSheet();
    if (products && products.length > 0) {
      _productsCache = products;
      _productsCacheTime = Date.now();
    } else if (_productsCache && _productsCache.length > 0) {
      // Graceful fallback to stale cache if current fetch fails or returns empty rows
      console.warn('[Products] Fetch returned empty, falling back to stale cache');
      products = _productsCache;
    }
    
    if (categoryQuery) {
      products = products.filter((p: any) => p.category && p.category.toLowerCase() === categoryQuery.toLowerCase());
    }
    return products;
  } catch (error) {
    console.error('[Products] Error fetching products, attempting stale cache fallback:', error);
    if (_productsCache && _productsCache.length > 0) {
      let products = _productsCache;
      if (categoryQuery) {
        products = products.filter((p: any) => p.category && p.category.toLowerCase() === categoryQuery.toLowerCase());
      }
      return products;
    }
    return [];
  }
}

export async function fetchAllProducts(categoryQuery: string | null = null) {
  try {
    const [sheetProducts, prismicProducts] = await Promise.all([
      fetchProductsFromSheet(),
      _fetchProductsFromPrismic()
    ]);
    
    let products = [...sheetProducts, ...prismicProducts];
    
    if (categoryQuery) {
      products = products.filter((p: any) => p.category && p.category.toLowerCase() === categoryQuery.toLowerCase());
    }
    return products;
  } catch (error) {
    console.error('[Products] Error fetching all products:', error);
    return fetchProductsFromSheet(categoryQuery);
  }
}
