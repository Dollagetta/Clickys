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

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Clickys Contact <updates@clickys.in>';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: ['teamclickys@gmail.com'], // Sent to your team email
      reply_to: email,
      subject: `New Contact Request: ${subject || 'No Subject'}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
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
