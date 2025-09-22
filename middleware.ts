import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// No-op middleware: auth removed
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
