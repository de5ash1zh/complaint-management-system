import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
