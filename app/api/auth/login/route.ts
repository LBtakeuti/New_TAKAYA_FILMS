import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { handleApiError, ValidationError, AuthenticationError, ServerError } from '@/middleware/error';
import { handleCors, corsHeaders } from '@/middleware/cors';

// 環境変数から認証情報を取得
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

// 環境変数の検証
if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
  logger.error('Missing required environment variables for authentication');
}

export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    // 環境変数が設定されていない場合はエラー
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
      logger.error('Authentication not configured properly');
      throw new ServerError('認証システムが正しく設定されていません');
    }

    const body = await request.json();
    const { username, password } = body;

    // 認証情報の検証
    if (!username || !password) {
      throw new ValidationError('ユーザー名とパスワードを入力してください');
    }

    // ユーザー名の確認
    if (username !== ADMIN_USERNAME) {
      throw new AuthenticationError('ユーザー名またはパスワードが正しくありません');
    }

    // パスワードの検証（bcryptでハッシュ値と比較）
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (!isValidPassword) {
      throw new AuthenticationError('ユーザー名またはパスワードが正しくありません');
    }

    // JWTトークンの生成
    const token = jwt.sign(
      { 
        id: 1, 
        username: ADMIN_USERNAME,
        role: 'admin' 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 成功レスポンス
    return NextResponse.json({
      message: 'ログインに成功しました',
      token,
      user: {
        id: 1,
        username: ADMIN_USERNAME,
        email: `${ADMIN_USERNAME}@takayafilms.com`,
        role: 'admin'
      }
    }, {
      headers: corsHeaders(request)
    });

  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 });
}