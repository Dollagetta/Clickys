import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req) {
  if (!resend) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY environment variable is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    let cleanEmail = 'updates@clickys.in';
    if (process.env.RESEND_FROM_EMAIL) {
      const match = process.env.RESEND_FROM_EMAIL.match(/<([^>]+)>/);
      cleanEmail = match ? match[1] : process.env.RESEND_FROM_EMAIL.trim();
    }
    const fromEmail = `Clickys <${cleanEmail}>`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Welcome to Clickys!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #f0f0f0;">
            <img src="https://www.clickys.in/clickysbg.png" alt="Clickys Logo" style="height: 60px; display: block; margin: 0 auto;" />
          </div>
          <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Clickys!</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <h2 style="color: #333;">Welcome to the Clickys Club! 🎉</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Thank you for subscribing to our newsletter. We're thrilled to have you.</p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">You'll be the first to know about exclusive deals, new arrivals, and the best product recommendations.</p>
            <br/>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Happy Shopping!<br/><strong>The Clickys Team</strong></p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
