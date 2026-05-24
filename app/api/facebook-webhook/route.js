import { NextResponse } from 'next/server';
import { createClient } from '../../../prismicio';
import { after } from 'next/server';

// Simple in-memory cache to prevent duplicate posts from webhook retries
const processedReleases = new Set();

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

    // Prevent duplicate webhook processing
    // Prismic webhooks sometimes retry if the response takes too long.
    const eventSignature = body.documents.join('-');
    if (processedReleases.has(eventSignature)) {
      return NextResponse.json({ message: 'Event already processed recently' }, { status: 200 });
    }
    processedReleases.add(eventSignature);
    // Clear the signature after 2 minutes so you can publish the same doc again later if needed
    setTimeout(() => processedReleases.delete(eventSignature), 2 * 60 * 1000);

    // Tell Vercel to allow this background processing after returning
    after(async () => {
      try {
        const client = createClient();
        
        for (const docId of body.documents) {
          // Fetch the published document by ID
          const doc = await client.getByID(docId).catch(() => null);
          if (!doc) continue;

          let message = '';
          let link = `https://www.clickys.in`; // Base fallback

          let urlPath = '';
          let imageUrl = null;
          
          // Handle different content types from Prismic
          if (doc.type === 'product') {
            const rawTitle = doc.data?.title || doc.data?.productname;
            const title = typeof rawTitle === 'string' ? rawTitle : rawTitle?.[0]?.text || 'Check out our new pick!';
            const rawDesc = doc.data?.description || doc.data?.excerpt;
            const description = typeof rawDesc === 'string' ? rawDesc : rawDesc?.[0]?.text || '';
            
            urlPath = `/products/${doc.uid}`;
            imageUrl = doc.data?.image?.url;
            link = `https://www.clickys.in${urlPath}`;
            message = `${title}\n\n${description}\n\nFind the product here: ${link}`;
            
          } else if (doc.type === 'whatsnew') {
            const rawTitle = doc.data?.title;
            const title = typeof rawTitle === 'string' ? rawTitle : rawTitle?.[0]?.text || 'Check out our new pick!';
            const rawDesc = doc.data?.description;
            const description = typeof rawDesc === 'string' ? rawDesc : rawDesc?.[0]?.text || '';
            
            urlPath = `/whats-new/${doc.uid}`;
            const sliceImage = doc.data?.slices?.find(s => s.slice_type === 'the_shopping_grid')?.primary?.the_items?.[0]?.product_image?.url 
                            || doc.data?.slices?.find(s => s.slice_type === 'the_shopping_grid')?.items?.[0]?.product_image?.url;
            imageUrl = doc.data?.image?.url || sliceImage;
            link = `https://www.clickys.in${urlPath}`;
            message = `${title}\n\n${description}\n\nFind the product here: ${link}`;
            
          } else if (doc.type === 'deals') {
            const rawTitle = doc.data?.dealname || doc.data?.title;
            const title = typeof rawTitle === 'string' ? rawTitle : rawTitle?.[0]?.text || 'Check out our new pick!';
            const rawDesc = doc.data?.description;
            const description = typeof rawDesc === 'string' ? rawDesc : rawDesc?.[0]?.text || '';
            
            urlPath = `/deals`;
            imageUrl = doc.data?.image?.url;
            link = `https://www.clickys.in${urlPath}`;
            message = `${title}\n\n${description}\n\nFind the product here: ${link}`;
            
          } else if (doc.type === 'guide' || doc.type === 'sliceguide1') {
            const guideSlice = doc.data?.slices?.find(s => s.slice_type === 'guide');
            
            const rawTitle = guideSlice?.primary?.title || doc.data?.title;
            const title = typeof rawTitle === 'string' ? rawTitle : rawTitle?.[0]?.text || 'New Guide Available';
            
            const rawDesc = guideSlice?.primary?.description || doc.data?.description;
            const descriptionExtracted = typeof rawDesc === 'string' ? rawDesc : rawDesc?.[0]?.text || '';
            const descriptionText = descriptionExtracted ? `\n\n${descriptionExtracted.substring(0, 150)}...` : '';
            
            imageUrl = guideSlice?.primary?.image?.url || doc.data?.image?.url;
            link = `https://www.clickys.in/guide/${doc.uid}`;
            message = `${title}${descriptionText}\n\nFind the product here: ${link}`;
            
          } else {
            continue; // Skip unrecognized types
          }

          // Extract tags
          let hashtagsArray = ['#clickys', '#Amazon', '#Ad'];
          if (doc.tags && Array.isArray(doc.tags) && doc.tags.length > 0) {
            const prismicTags = doc.tags.slice(0, 2).map(tag => `#${tag.split(' ').join('')}`);
            hashtagsArray.push(...prismicTags);
          }
          const hashtags = '\n\n' + hashtagsArray.join(' ');

          // Use the /photos endpoint for an image post
          const absoluteOgImage = imageUrl?.startsWith('http') ? imageUrl : (imageUrl ? `https://www.clickys.in${imageUrl}` : 'https://www.clickys.in/images/logosvg.svg');
          
          // Generate the OG image with ONLY the product image inside our custom frame
          const generatedOgImageUrl = `https://www.clickys.in/api/og?image=${encodeURIComponent(absoluteOgImage)}&frameOnly=true`;

          const graphApiEndpoint = `https://graph.facebook.com/v20.0/${FACEBOOK_PAGE_ID}/photos`;
          const payload = {
            message: `${message}${hashtags}`,
            url: generatedOgImageUrl,
            access_token: FACEBOOK_ACCESS_TOKEN
          };

          const res = await fetch(graphApiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const fbData = await res.json();
          if (!res.ok) {
            console.error('Facebook Graph API Error:', fbData);
            continue;
          }
          
          const postedId = fbData.post_id || fbData.id;
          if (postedId) {
            // Add a comment below the new post
            const commentEndpoint = `https://graph.facebook.com/v20.0/${postedId}/comments`;
            const commentPayload = {
              message: "Visit our Amazon store here: https://www.amazon.in/shop/clickyse",
              access_token: FACEBOOK_ACCESS_TOKEN
            };
            await fetch(commentEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(commentPayload)
            }).catch(err => {
              console.error("Failed to add Facebook comment:", err);
            });
          }
        }
      } catch (err) {
        console.error('Facebook Webhook Background Error:', err);
      }
    });

    return NextResponse.json({ message: 'Webhook received and processing started' }, { status: 200 });

  } catch (err) {
    console.error('Facebook Webhook Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

