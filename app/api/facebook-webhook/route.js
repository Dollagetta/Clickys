import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio';

export async function POST(req) {
  try {
    const body = await req.json();

    // Verify Prismic Webhook Secret (optional but recommended for security)
    const { PRISMIC_WEBHOOK_SECRET, FACEBOOK_PAGE_ID, FACEBOOK_ACCESS_TOKEN } = process.env;

    if (PRISMIC_WEBHOOK_SECRET && body.secret !== PRISMIC_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Invalid webhook secret' }, { status: 401 });
    }

    // Prismic webhook payload check
    // "api-update" triggered when content is published
    if (body.type !== 'api-update' || !body.documents || body.documents.length === 0) {
      return NextResponse.json({ message: 'No documents published or invalid event type' }, { status: 200 });
    }

    if (!FACEBOOK_PAGE_ID || !FACEBOOK_ACCESS_TOKEN) {
      console.warn("Facebook setup incomplete. Missing FACEBOOK_PAGE_ID or FACEBOOK_ACCESS_TOKEN in env variables.");
      return NextResponse.json({ message: 'Facebook credentials missing' }, { status: 500 });
    }

    const client = createClient();

    let postedCount = 0;

    for (const docId of body.documents) {
      // Fetch the published document by ID
      const doc = await client.getByID(docId).catch(() => null);
      if (!doc) continue;

      let message = '';
      let link = `https://www.clickys.in`; // Base fallback

      // Handle different content types from Prismic
      if (doc.type === 'product' || doc.type === 'whatsnew') {
        const title = doc.data?.title?.[0]?.text || doc.data?.productname || 'Check out our new pick!';
        // Prismic typically stores descriptions or excerpts
        const description = doc.data?.excerpt || doc.data?.description?.[0]?.text || '';
        
        let urlPath = '';
        if (doc.type === 'product') {
          urlPath = `/finds/${doc.uid}`;
        } else if (doc.type === 'whatsnew') {
          urlPath = `/whats-new/${doc.uid}`;
        }

        message = `✨ ${title}\n\n${description}\n\nShop now: `;
        link = `https://www.clickys.in${urlPath}`;
      } else if (doc.type === 'guide' || doc.type === 'sliceguide1') {
        const title = doc.data?.title?.[0]?.text || 'New Guide Available';
        message = `📚 ${title}\n\nRead our latest guide here: `;
        link = `https://www.clickys.in/guide/${doc.uid}`;
      } else {
        continue; // Skip unrecognized types
      }

      // We append the URL into the message, but we can also use Facebook's "link" parameter
      const graphApiUrl = `https://graph.facebook.com/v20.0/${FACEBOOK_PAGE_ID}/feed`;
      
      const payload = {
        message: message,
        link: link,
        access_token: FACEBOOK_ACCESS_TOKEN
      };

      const res = await fetch(graphApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const fbData = await res.json();
      if (!res.ok) {
        console.error('Facebook Graph API Error:', fbData);
        continue;
      }
      
      postedCount++;
    }

    return NextResponse.json({ message: `Successfully posted ${postedCount} updates to Facebook` }, { status: 200 });

  } catch (err) {
    console.error('Facebook Webhook Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
