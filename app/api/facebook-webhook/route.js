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

      let urlPath = '';
      let imageUrl = null;

      // Handle different content types from Prismic
      if (doc.type === 'product' || doc.type === 'whatsnew' || doc.type === 'deals') {
        const rawTitle = doc.data?.title || doc.data?.productname || doc.data?.dealname;
        const title = typeof rawTitle === 'string' ? rawTitle : rawTitle?.[0]?.text || 'Check out our new pick!';
        
        const rawDesc = doc.data?.description || doc.data?.excerpt;
        const description = typeof rawDesc === 'string' ? rawDesc : rawDesc?.[0]?.text || '';
        
        if (doc.type === 'product') {
          urlPath = `/products/${doc.uid}`;
          imageUrl = doc.data?.image?.url;
        } else if (doc.type === 'whatsnew') {
          urlPath = `/whats-new/${doc.uid}`;
          // whatsnew usually uses slices for images
          const sliceImage = doc.data?.slices?.find(s => s.slice_type === 'the_shopping_grid')?.primary?.the_items?.[0]?.product_image?.url 
                          || doc.data?.slices?.find(s => s.slice_type === 'the_shopping_grid')?.items?.[0]?.product_image?.url;
          imageUrl = doc.data?.image?.url || sliceImage;
        } else if (doc.type === 'deals') {
          urlPath = `/deals/${doc.uid}`;
          imageUrl = doc.data?.image?.url; // Fallback
        }

        message = `✨ ${title}\n\n${description}\n\nShop now: `;
        link = `https://www.clickys.in${urlPath}`;
      } else if (doc.type === 'guide' || doc.type === 'sliceguide1') {
        const guideSlice = doc.data?.slices?.find(s => s.slice_type === 'guide');
        
        const rawTitle = guideSlice?.primary?.title || doc.data?.title;
        const title = typeof rawTitle === 'string' ? rawTitle : rawTitle?.[0]?.text || 'New Guide Available';
        
        const rawDesc = guideSlice?.primary?.description || doc.data?.description;
        const descriptionExtracted = typeof rawDesc === 'string' ? rawDesc : rawDesc?.[0]?.text || '';
        const descriptionText = descriptionExtracted ? `\n\n${descriptionExtracted.substring(0, 150)}...` : '';
        
        imageUrl = guideSlice?.primary?.image?.url || doc.data?.image?.url;
        
        message = `📚 ${title}${descriptionText}\n\nRead our latest guide here: `;
        link = `https://www.clickys.in/guide/${doc.uid}`;
      } else {
        continue; // Skip unrecognized types
      }

      // We append the URL into the message so it's clickable
      const finalMessage = `${message}\n${link}`;
      
      let graphApiEndpoint = `https://graph.facebook.com/v20.0/${FACEBOOK_PAGE_ID}/feed`;
      let payload = {
        message: finalMessage,
        access_token: FACEBOOK_ACCESS_TOKEN
      };

      // If we found an image, use the /photos endpoint instead to guarantee a rich image preview
      if (imageUrl) {
        graphApiEndpoint = `https://graph.facebook.com/v20.0/${FACEBOOK_PAGE_ID}/photos`;
        payload.url = imageUrl;
      } else {
        // Fallback to standard link post
        payload.link = link;
        payload.message = message; // Keep original message structure when using native 'link'
      }

      const res = await fetch(graphApiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const fbData = await res.json();
      if (!res.ok) {
        console.error('Facebook Graph API Error:', fbData);
        // Return the exact Graph build error so it shows up in Prismic Webhook UI
        return NextResponse.json({ 
          message: 'Facebook Graph API Error', 
          error: fbData,
          attemptedPayload: payload 
        }, { status: 400 });
      }
      
      postedCount++;
    }

    return NextResponse.json({ message: `Successfully posted ${postedCount} updates to Facebook` }, { status: 200 });

  } catch (err) {
    console.error('Facebook Webhook Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
