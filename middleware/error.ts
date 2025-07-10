import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  details?: string;
  userMessage?: string;
}

export class ValidationError extends Error implements ApiError {
  statusCode = 400;
  constructor(message: string, public details?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error implements ApiError {
  statusCode = 401;
  constructor(message: string = '認証が必要です') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error implements ApiError {
  statusCode = 403;
  constructor(message: string = 'アクセス権限がありません') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  constructor(message: string = 'リソースが見つかりません') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends Error implements ApiError {
  statusCode = 500;
  constructor(message: string = 'サーバーエラーが発生しました', public details?: string) {
    super(message);
    this.name = 'ServerError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  logger.error('API Error:', error);

  // Known API errors
  if (error instanceof Error && 'statusCode' in error) {
    const apiError = error as ApiError;
    return NextResponse.json(
      {
        error: apiError.message,
        details: apiError.details,
        type: error.name
      },
      { status: apiError.statusCode || 500 }
    );
  }

  // Supabase errors
  if (error instanceof Error && error.message.includes('supabase')) {
    return NextResponse.json(
      {
        error: 'データベースエラーが発生しました',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }

  // Unknown errors
  return NextResponse.json(
    {
      error: 'サーバーエラーが発生しました',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    },
    { status: 500 }
  );
}