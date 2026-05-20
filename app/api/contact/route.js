import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize without enforcing immediately, so build doesn't fail setup
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req) {
  if (!resend) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY environment variable is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    let cleanEmail = 'updates@clickys.in';
    if (process.env.RESEND_FROM_EMAIL) {
      const match = process.env.RESEND_FROM_EMAIL.match(/<([^>]+)>/);
      cleanEmail = match ? match[1] : process.env.RESEND_FROM_EMAIL.trim();
    }
    const fromEmail = `Clickys <${cleanEmail}>`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: ['teamclickys@gmail.com'], // Sent to your team email
      reply_to: email,
      subject: `New Contact Form Request: ${subject || 'No Subject'}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #f0f0f0;">
            <img src="https://www.clickys.in/clickysbg.png" alt="Clickys Logo" style="height: 60px; display: block; margin: 0 auto;" />
          </div>
          <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Message</h1>
          </div>
          <div style="padding: 30px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
            <h3 style="color: #666; margin-top: 0;">Message:</h3>
            <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
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
