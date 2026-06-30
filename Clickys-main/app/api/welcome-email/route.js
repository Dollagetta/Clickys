import { NextResponse } from 'next/server';

export async function POST(req) {
  return NextResponse.json({ success: true, message: 'Welcome email disabled. Subscribers will only receive updates.' }, { status: 200 });
}
