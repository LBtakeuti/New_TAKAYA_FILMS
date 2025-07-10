import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { getVideos, createVideo } from '@/lib/supabase-videos';
import { handleApiError, ValidationError, AuthenticationError } from '@/middleware/error';
import { handleCors, corsHeaders } from '@/middleware/cors';
import { verifyAuth } from '@/lib/auth';

// GET: 公開されている動画一覧を取得
export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    // 認証チェックで取得内容を変更
    const authHeader = request.headers.get('authorization');
    let publishedOnly = true;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const isValid = await verifyAuth(token);
      if (isValid) {
        publishedOnly = false; // 認証済みの場合は全て取得
      }
    }
    
    const videos = await getVideos(publishedOnly);
    
    // CORSとキャッシュヘッダーを組み合わせる
    const headers = {
      ...corsHeaders(request),
      'Cache-Control': 'public, max-age=60'
    };
    
    return NextResponse.json(videos, { headers });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST: 新しい動画を作成
export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('認証が必要です');
    }

    const token = authHeader.split(' ')[1];
    const isValid = await verifyAuth(token);
    if (!isValid) {
      throw new AuthenticationError('無効なトークンです');
    }
    
    const body = await request.json();
    
    // バリデーション
    if (!body.title) {
      throw new ValidationError('タイトルは必須です');
    }
    
    if (body.video_type === 'youtube' && !body.youtube_url && !body.video_url) {
      throw new ValidationError('YouTube URLは必須です');
    }
    
    // 動画データの準備
    const videoData = {
      title: body.title,
      description: body.description || '',
      video_url: body.youtube_url || body.video_url || '',
      video_file_path: body.video_file_path,
      thumbnail_url: body.thumbnail_url,
      thumbnail_file_path: body.thumbnail_file_path,
      video_type: body.video_type || 'youtube',
      file_size: body.file_size,
      duration: body.duration,
      mime_type: body.mime_type,
      category: body.category || 'Other',
      client: body.client || '',
      project_date: body.project_date,
      status: body.status || 'published',
      featured: body.featured || false,
      sort_order: body.sort_order || 0,
    };

    const video = await createVideo(videoData);
    
    if (!video) {
      throw new Error('動画の作成に失敗しました');
    }
    
    return NextResponse.json(video, { 
      status: 201,
      headers: corsHeaders(request)
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// OPTIONS: CORS preflight
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 });
}