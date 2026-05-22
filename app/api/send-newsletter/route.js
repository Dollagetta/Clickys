import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';
import { Resend } from 'resend';
import { createClient } from '../../../prismicio';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    const body = await req.json();
    console.log('Prismic Webhook received:', body);

    // Verify Prismic Webhook Secret
    const PRISMIC_SECRET = 'Dollagetta#2003';
    if (body.secret?.trim() !== PRISMIC_SECRET) {
      console.warn('Unauthorized webhook attempt');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Prismic webhooks send a list of document IDs that were changed
    // We care about "api-update" (which is publish) and "test-trigger"
    if (body.type !== 'api-update' && body.type !== 'test-trigger') {
      return NextResponse.json({ message: 'Ignored event type' }, { status: 200 });
    }

    // Immediately handle the test trigger to prevent it from querying Prismic and Firebase.
    // This stops accidental emails when testing Prismic Webhooks in the dashboard.
    if (body.type === 'test-trigger') {
      return NextResponse.json({ message: 'Test successful.' }, { status: 200 });
    }

    // Step 1: Identify the published document from the webhook documents
    let latestDoc = null;
    const client = createClient();

    if (body.documents && body.documents.length > 0) {
      try {
        const updatedDocs = await client.getAllByIDs(body.documents);
        // We look for any of these document types
        latestDoc = updatedDocs.find(doc => 
          ['product', 'whatsnew', 'deal', 'deals', 'partner', 'partners', 'guide', 'sliceguide1'].includes(doc.type)
        );
      } catch (err) {
        console.error('Failed to fetch updated documents from Prismic', err);
      }
    }

    if (!latestDoc) {
      return NextResponse.json({ message: 'No relevant changes found in this webhook.' }, { status: 200 });
    }

    const extractText = (field) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (Array.isArray(field) && field[0] && field[0].text) return field[0].text;
      return '';
    };

    // Extract title
    let rawTitle = latestDoc.data?.title || latestDoc.data?.name;
    if (!rawTitle && latestDoc.data?.slices) {
      // Trying to find title from slices if not in static zone
      const titleSlice = latestDoc.data.slices.find(s => s.primary?.title || s.primary?.heading);
      if (titleSlice) rawTitle = titleSlice.primary.title || titleSlice.primary.heading;
    }
    const docTitle = extractText(rawTitle) || 'New Arrival';

    // Extract custom email attributes
    const customSubject = extractText(latestDoc.data?.newsletter_subject) || extractText(latestDoc.data?.email_subject);
    const finalSubject = customSubject ? customSubject : `New Arrival on Clickys: ${docTitle}`;
    const customHeader = extractText(latestDoc.data?.newsletter_header) || extractText(latestDoc.data?.email_header) || 'Clickys New Arrival!';
    
    // Dynamically determine the URL based on the document type
    let productUrl = 'https://www.clickys.in/products';
    if (latestDoc.type.includes('whatsnew') || latestDoc.type.includes('whats-new')) {
      productUrl = `https://www.clickys.in/whats-new/${latestDoc.uid}`;
    } else if (latestDoc.type.includes('deal')) {
      productUrl = `https://www.clickys.in/deals/${latestDoc.uid}`;
    } else if (latestDoc.type.includes('guide') || latestDoc.type.includes('sliceguide1')) {
      productUrl = `https://www.clickys.in/guide/${latestDoc.uid}`;
    } else if (latestDoc.type.includes('partner')) {
      productUrl = `https://www.clickys.in`;
    } else if (latestDoc.type.includes('product')) {
      productUrl = `https://www.clickys.in/products/${latestDoc.uid}`;
    }

    // Extract image
    let productImage = latestDoc.data?.image?.url || latestDoc.data?.cover_image?.url || latestDoc.data?.the_big_burner?.url || latestDoc.data?.featured_image?.url || latestDoc.data?.meta_image?.url || latestDoc.data?.partner_image?.url || latestDoc.data?.logo?.url || latestDoc.data?.brand_image?.url || '';
    if (!productImage && latestDoc.data?.slices) {
       const imageSlice = latestDoc.data.slices.find(s => s.primary?.image?.url || s.primary?.background_image?.url);
       if (imageSlice) productImage = imageSlice.primary.image?.url || imageSlice.primary.background_image?.url;
    }

    // Extract excerpt
    let productExcerpt = extractText(latestDoc.data?.description) || extractText(latestDoc.data?.short_paragraph) || extractText(latestDoc.data?.meta_description) || '';
    if (!productExcerpt && latestDoc.data?.slices) {
       const descSlice = latestDoc.data.slices.find(s => s.primary?.description || s.primary?.text);
       if (descSlice) productExcerpt = extractText(descSlice.primary.description || descSlice.primary.text);
    }
    if (!productExcerpt) {
       productExcerpt = 'Check out our latest update on Clickys!';
    }

    // Step 2: Fetch all active subscribers from Firestore using Admin SDK to bypass security rules
    let emails = [];
    try {
      const subscribersSnap = await adminDb
        .collection('subscribers')
        .where('isActive', '==', true)
        .get();

      emails = subscribersSnap.docs
        .map(doc => doc.data().email)
        .filter(email => email && typeof email === 'string' && email.trim() !== '');
    } catch (dbError) {
      console.error('Failed to fetch subscribers from Firestore:', dbError.message);
      // If code is 5 (NOT_FOUND), the Firestore database might not exist yet.
      if (dbError.code === 5) {
        console.warn('Firestore database does not exist. Please create it in the Firebase Console.');
      }
      return NextResponse.json({ 
        message: 'Webhook received, but failed to fetch subscribers.', 
        error: dbError.message 
      }, { status: 500 });
    }

    if (emails.length === 0) {
      return NextResponse.json({ message: 'No subscribers to notify' }, { status: 200 });
    }

    // Step 3: Send emails via Resend
    if (!resend) {
      console.warn('RESEND_API_KEY is missing. Skipping email sending.');
      return NextResponse.json({ message: 'Webhook processed, but emails not sent (no API key)' }, { status: 200 });
    }

    const promoSchema = `
      <script type="application/ld+json">
      [{
        "@context": "http://schema.org/",
        "@type": "Organization",
        "name": "Clickys",
        "logo": "https://www.clickys.in/images/logosvg.svg"
      },
      {
        "@context": "http://schema.org/",
        "@type": "DiscountOffer",
        "description": "${docTitle.replace(/"/g, '')}",
        "availabilityStarts": "${new Date().toISOString()}",
        "availabilityEnds": "${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}",
        "url": "${productUrl}"
      },
      {
        "@context": "http://schema.org/",
        "@type": "PromotionCard",
        "image": "${productImage || 'https://www.clickys.in/images/logosvg.svg'}"
      }]
      </script>
    `;

    let cleanEmail = 'updates@clickys.in';
    if (process.env.RESEND_FROM_EMAIL) {
      const match = process.env.RESEND_FROM_EMAIL.match(/<([^>]+)>/);
      cleanEmail = match ? match[1] : process.env.RESEND_FROM_EMAIL.trim();
    }
    
    const emailBatch = emails.map(email => ({
      from: `Clickys <${cleanEmail}>`,
      to: [email],
      subject: finalSubject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${promoSchema}
        </head>
        <body>
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #f0f0f0;">
              <img src="https://www.clickys.in/images/logosvg.svg" alt="Clickys Logo" style="height: 60px; display: block; margin: 0 auto;" />
            </div>
            <div style="background-color: #f97316; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">${customHeader}</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333;">${docTitle}</h2>
              ${productImage ? `<img src="${productImage}" alt="${docTitle}" style="display: block; width: 100%; height: auto; max-height: 400px; margin: 0 auto 20px auto; border-radius: 12px; box-shadow: 0 8px 24px rgba(249, 115, 22, 0.25); border: 2px solid #f97316; object-fit: cover;" />` : ''}
              <p style="color: #666; font-size: 16px; line-height: 1.6;">${productExcerpt}</p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${productUrl}" style="background-color: #f97316; color: white; padding: 14px 30px; font-size: 16px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
                  View on Clickys
                </a>
              </div>
            </div>
            <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; color: #999; font-size: 13px;">
              <div style="margin-bottom: 20px;">
                <a href="https://www.facebook.com/clickyse/" style="color: #64748b; font-weight: bold; text-decoration: none; margin: 0 12px; letter-spacing: 0.5px;">Facebook</a>
                <a href="https://www.instagram.com/_clickyse?igsh=bjV3YnZ6OG80MHNq" style="color: #64748b; font-weight: bold; text-decoration: none; margin: 0 12px; letter-spacing: 0.5px;">Instagram</a>
                <a href="https://www.amazon.in/shop/clickyse" style="color: #64748b; font-weight: bold; text-decoration: none; margin: 0 12px; letter-spacing: 0.5px;">Amazon</a>
              </div>
              <p style="margin-bottom: 10px;">You're receiving this because you subscribed to Clickys updates.</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Clickys. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }));

    // Resend allows max 100 emails per batch request
    const BATCH_SIZE = 100;
    let dataList = [];
    
    for (let i = 0; i < emailBatch.length; i += BATCH_SIZE) {
      const chunk = emailBatch.slice(i, i + BATCH_SIZE);
      const { data, error } = await resend.batch.send(chunk);
      if (error) {
        console.error('Resend error on chunk:', error);
        return NextResponse.json({ error }, { status: 500 });
      }
      dataList.push(data);
    }

    return NextResponse.json({ message: 'Notifications sent successfully', data: dataList }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
