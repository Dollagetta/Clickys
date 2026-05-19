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
    const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clickys.in'}/products/${latestProduct.uid}`;
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

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Clickys Updates <updates@clickys.in>', // Using verified domain
      to: emails,
      subject: `New Arrival on Clickys: ${productName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Clickys New Arrival!</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333;">${productName}</h2>
            ${productImage ? `<img src="${productImage}" alt="${productName}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" />` : ''}
            <p style="color: #666; font-size: 16px; line-height: 1.6;">${productExcerpt}</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${productUrl}" style="background-color: #f97316; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
                View on Clickys
              </a>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>You're receiving this because you subscribed to Clickys updates.</p>
            <p>&copy; ${new Date().getFullYear()} Clickys. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Notifications sent successfully', data }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
