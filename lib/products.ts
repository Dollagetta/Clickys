import { GoogleAuth } from 'google-auth-library';
import { unstable_cache } from 'next/cache';

async function _fetchProductsFromSheet() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  let sheetId = process.env.PRODUCT_SHEET_ID;
  
  if (sheetId && sheetId.includes('docs.google.com/spreadsheets/d/')) {
    const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      sheetId = match[1];
    }
  }

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Auth environment variables (GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY).');
  }

  if (!sheetId) {
    throw new Error('Missing PRODUCT_SHEET_ID environment variable. Please configure it in your settings.');
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
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for sheet fetch

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:I`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          next: { revalidate: 60 } // Reduced to 60 seconds
        }
      );
      clearTimeout(timeoutId);

      console.log(`[Products] Response: ${response.status}`);
      if (!response.ok) {
          console.error(`[Products] Google Sheets API Error: ${response.status} ${response.statusText}`);
          return [];
      }

      const data = await response.json();
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

let _productsCache: any[] | null = null;
let _productsCacheTime = 0;

export async function fetchProductsFromSheet(categoryQuery: string | null = null) {
  if (_productsCache && (Date.now() - _productsCacheTime < 60000)) {
    let products = _productsCache;
    if (categoryQuery) {
      products = products.filter((p: any) => p.category.toLowerCase() === categoryQuery.toLowerCase());
    }
    return products;
  }

  let products = await _fetchProductsFromSheet();
  _productsCache = products;
  _productsCacheTime = Date.now();

  if (categoryQuery) {
    products = products.filter((p: any) => p.category.toLowerCase() === categoryQuery.toLowerCase());
  }

  return products;
}
