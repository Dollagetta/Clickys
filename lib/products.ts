import { GoogleAuth } from 'google-auth-library';

export async function fetchProductsFromSheet(categoryQuery: string | null = null) {
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

  const auth = new GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  const accessToken = (await client.getAccessToken()).token;

  // Fetching A:H based on our data format (Title, Price, Link, Image, Category, Discount, Platform, Description)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:H`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        // Cache data for 24 hours to maximize speed & avoid rate limits
        next: { revalidate: 86400 } 
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google Sheets API Error: ${response.status} ${response.statusText}. Sheet ID: ${sheetId}`);
    }

    const data = await response.json();
    const rows = data.values || [];
  
    // Map rows to structured objects (ensure we filter out empty rows/headers)
    let products = rows
        .filter((row: any[]) => row && row[0] && row[0] !== 'Title')
        .map((row: any[]) => ({
          title: row[0] || '',
          price: row[1] || '',
          link: row[2] || '',
          image: row[3] || '',
          category: row[4] || 'Uncategorized',
          discount: row[5] || '',
          platform: row[6] || '',
          description: row[7] || ''
        }));

    if (categoryQuery) {
      products = products.filter((p: any) => p.category.toLowerCase() === categoryQuery.toLowerCase());
    }

    return products;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Google Sheets API request timed out (10s)');
    }
    throw error;
  }
}
