import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export async function GET(request: Request) {
  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;
    const sheetId = process.env.PRODUCT_SHEET_ID;

    // Fetching A:F based on our data format (Title, Price, Link, Image, Category, Discount)
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:F`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        // Cache data for 1 hour to heavily optimize load times & avoid rate limits
        next: { revalidate: 3600 } 
      }
    );

    if (!response.ok) throw new Error(`Google Sheets API Error`);

    const data = await response.json();
    console.log(data);
    const rows = data.values || [];

    // Map rows to structured objects (ensure we filter out empty rows/headers)
    const products = rows
        .filter((row: any[]) => row[0] && row[0] !== 'Title')
        .map((row: any[]) => ({
          title: row[0] || '',
          price: row[1] || '',
          link: row[2] || '',
          image: row[3] || '',
          category: row[4] || 'Uncategorized',
          discount: row[5] || ''
        }));

    //console.log(products);
    // Handle optional Category filtering
    const { searchParams } = new URL(request.url);
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      return NextResponse.json(
        products.filter((p: any) => p.category.toLowerCase() === categoryQuery.toLowerCase())
      );
    }

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || 'Failed', stack: error.stack }, { status: 500 });
  }
}
