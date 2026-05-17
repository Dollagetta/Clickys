import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Resend } from 'resend';
import { createClient } from '../../../../prismicio';

export async function POST(req) {
  try {
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    const body = await req.json();
    console.log('Prismic Webhook received:', body);

    // Prismic webhooks send a list of document IDs that were changed
    // We care about "api:publish" and "test-trigger"
    if (body.type !== 'api-update' && body.type !== 'test-trigger') {
      return NextResponse.json({ message: 'Ignored event type' }, { status: 200 });
    }

    // Step 1: Identify if any "product" was published
    // The payload format varies, but usually contains masterRef or documents
    // For now, let's just fetch the latest product from Prismic to see if it's new
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
    const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://clickys.in'}/products/${latestProduct.uid}`;
    const productExcerpt = latestProduct.data.description?.[0]?.text || 'Check out our latest update!';
    const productImage = latestProduct.data.image?.url;

    // Step 2: Fetch all active subscribers from Firestore
    const subscribersSnap = await getDocs(
      query(collection(db, 'subscribers'), where('isActive', '==', true))
    );

    const emails = subscribersSnap.docs.map(doc => doc.data().email);

    if (emails.length === 0) {
      return NextResponse.json({ message: 'No subscribers to notify' }, { status: 200 });
    }

    // Step 3: Send emails via Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is missing. Skipping email sending.');
      return NextResponse.json({ message: 'Webhook processed, but emails not sent (no API key)' }, { status: 200 });
    }

    // Resend batch sending (limit 100 per call for free tier often)
    // We'll send them one by one or in small batches for better delivery
    // For this applet, we'll try a single call if possible or loop
    // Resend supports a list of emails in 'to'
    
    const { data, error } = await resend.emails.send({
      from: 'Clickys Updates <onboarding@resend.dev>', // You should use your verified domain later
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
