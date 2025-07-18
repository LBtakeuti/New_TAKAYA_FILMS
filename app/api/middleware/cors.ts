import { NextResponse } from 'next/server';

export function corsHeaders(response: NextResponse) {
  // CORSヘッダーを設定
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

export function handleCorsOptions() {
  const response = new NextResponse(null, { status: 200 });
  return corsHeaders(response);
}