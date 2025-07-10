import { NextRequest, NextResponse } from 'next/server';

export interface CorsOptions {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultOptions: CorsOptions = {
  allowedOrigins: ['*'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: [],
  credentials: true,
  maxAge: 86400,
};

export function corsHeaders(request: NextRequest, options: CorsOptions = {}): HeadersInit {
  const config = { ...defaultOptions, ...options };
  const origin = request.headers.get('origin');
  const headers: HeadersInit = {};

  // Handle origin
  if (config.allowedOrigins?.includes('*')) {
    headers['Access-Control-Allow-Origin'] = origin || '*';
  } else if (origin && config.allowedOrigins?.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  // Other CORS headers
  if (config.allowedMethods?.length) {
    headers['Access-Control-Allow-Methods'] = config.allowedMethods.join(', ');
  }

  if (config.allowedHeaders?.length) {
    headers['Access-Control-Allow-Headers'] = config.allowedHeaders.join(', ');
  }

  if (config.exposedHeaders?.length) {
    headers['Access-Control-Expose-Headers'] = config.exposedHeaders.join(', ');
  }

  if (config.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  if (config.maxAge !== undefined) {
    headers['Access-Control-Max-Age'] = config.maxAge.toString();
  }

  return headers;
}

export function handleCors(request: NextRequest, options: CorsOptions = {}): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(request, options),
    });
  }

  return null;
}