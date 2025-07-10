import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

// JWT_SECRETが設定されていない場合は警告
if (!JWT_SECRET) {
  logger.error('JWT_SECRET is not configured. Authentication will not work properly.');
}

interface DecodedToken {
  username: string;
  id: number;
  iat?: number;
  exp?: number;
}

// トークン検証関数
export const verifyToken = (token: string): DecodedToken => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// 認証ミドルウェアヘルパー
export const withAuth = async (
  request: NextRequest,
  handler: (request: NextRequest, user: DecodedToken) => Promise<Response>
): Promise<Response> => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Access denied. No token provided.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const decoded = verifyToken(token);
    return handler(request, decoded);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// 認証をスキップする開発用ヘルパー
export const withOptionalAuth = async (
  request: NextRequest,
  handler: (request: NextRequest, user?: DecodedToken) => Promise<Response>
): Promise<Response> => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      return handler(request, decoded);
    } catch (error) {
      // トークンが無効でも処理を続行
    }
  }
  
  return handler(request, undefined);
};