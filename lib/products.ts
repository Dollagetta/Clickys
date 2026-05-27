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

  // Fetching A:G based on our data format (Title, Price, Link, Image, Category, Discount, Platform)
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:G`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      // Cache data for 1 hour to heavily optimize load times & avoid rate limits
      next: { revalidate: 3600 } 
    }
  );

  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Sheets API Error: ${response.status} ${response.statusText}\nDetails: ${errorText}\nSheet ID being used: ${sheetId}`);
  }

  const data = await response.json();
  const rows = data.values || [];

  // Map rows to structured objects (ensure we filter out empty rows/headers)
  let products = rows
      .filter((row: any[]) => row[0] && row[0] !== 'Title')
      .map((row: any[]) => ({
        title: row[0] || '',
        price: row[1] || '',
        link: row[2] || '',
        image: row[3] || '',
        category: row[4] || 'Uncategorized',
        discount: row[5] || '',
        platform: row[6] || ''
      }));

  if (categoryQuery) {
    products = products.filter((p: any) => p.category.toLowerCase() === categoryQuery.toLowerCase());
  }

  return products;
}
