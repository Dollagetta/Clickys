import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';
import { Resend } from 'resend';
import { createClient } from '../../../prismicio';

export async function POST(req) {
  try {
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    const body = await req.json();
    console.log('Prismic Webhook received:', body);

    // Verify Prismic Webhook Secret
    const PRISMIC_SECRET = 'Dollagetta#2003';
    if (body.secret !== PRISMIC_SECRET) {
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

    // Step 1: Identify if any "product" was published
    // For now, fetch the latest product from Prismic to see if it's new
    const client = createClient();
    const productsRes = await client.getByType('product', {
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc',
      },
      limit: 1,
    });

    if (productsRes.results.length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 200 });
    }

    const latestProduct = productsRes.results[0];
    const productName = latestProduct.data.title || 'New Product';
    // Hardcode the site URL to avoid environment variable issues in standard node (like punycode errors)
    const productUrl = `https://www.clickys.in/products/${latestProduct.uid}`;
    const productExcerpt = latestProduct.data.description?.[0]?.text || 'Check out our latest update!';
    const productImage = latestProduct.data.image?.url;

    // Step 2: Fetch all active subscribers from Firestore using Admin SDK to bypass security rules
    let emails = [];
    try {
      const subscribersSnap = await adminDb
        .collection('subscribers')
        .where('isActive', '==', true)
        .get();

      emails = subscribersSnap.docs.map(doc => doc.data().email);
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

    const BATCH_SIZE = 50;
    const emailBatches = [];
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      emailBatches.push(emails.slice(i, i + BATCH_SIZE));
    }

    const htmlTemplate = (email) => `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #f97316; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Clickys New Arrival!</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; font-size: 24px; margin-top: 0; margin-bottom: 20px; text-align: center;">${productName}</h2>
          
          ${productImage ? `
            <div style="text-align: center; margin-bottom: 25px;">
              <img src="${productImage}" alt="${productName}" style="display: block; max-width: 100%; height: auto; max-height: 300px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); object-fit: cover;" />
              <p style="color: #64748b; font-size: 13px; font-style: italic; margin-top: 15px; font-weight: 500;">Product Title: ${productName}</p>
            </div>
          ` : ''}
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">${productExcerpt}</p>
          
          <div style="text-align: center; margin-top: 10px;">
            <a href="${productUrl}" style="background-color: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px; transition: background-color 0.2s;">
              View on Clickys
            </a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0;">You're receiving this individual email because you subscribed to Clickys updates.</p>
          <p style="margin: 0; display: inline-block;">Sent to <a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a></p>
          <p style="margin: 12px 0 0 0;">&copy; ${new Date().getFullYear()} Clickys. All rights reserved.</p>
        </div>
      </div>
    `;

    let finalData = null;

    try {
      if (resend.batch && resend.batch.send) {
        for (const batch of emailBatches) {
          const payload = batch.map(email => ({
            from: process.env.RESEND_FROM_EMAIL || 'Clickys <noreply@clickys.in>',
            to: email,
            subject: `New Arrival on Clickys: ${productName}`,
            html: htmlTemplate(email)
          }));
          const { data, error } = await resend.batch.send(payload);
          if (error) throw error;
          finalData = data;
        }
      } else {
        // Fallback to sequential emails for older SDK versions
        const emailPromises = emails.map(email => 
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Clickys <noreply@clickys.in>',
            to: email,
            subject: `New Arrival on Clickys: ${productName}`,
            html: htmlTemplate(email)
          })
        );
        const results = await Promise.all(emailPromises);
        finalData = results;
      }
    } catch (sendError) {
      console.error('Resend error:', sendError);
      return NextResponse.json({ error: sendError.message || sendError }, { status: 500 });
    }

    return NextResponse.json({ message: 'Notifications sent successfully', data: finalData }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
