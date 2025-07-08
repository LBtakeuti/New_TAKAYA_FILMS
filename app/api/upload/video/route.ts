import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Next.js 13+の設定
export const runtime = 'nodejs';

// サポートする動画形式
const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/ogg'
];

// 最大ファイルサイズ（100MB - テスト用に縮小）
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export async function POST(request: NextRequest) {
  console.log('=== Video Upload API Started ===');
  
  try {
    // Content-Typeの確認
    const contentType = request.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ 
        error: '無効なリクエスト形式です',
        details: 'Content-Type must be multipart/form-data'
      }, { status: 400 });
    }

    // FormDataの解析
    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    
    if (!file) {
      console.error('No file found in form data');
      return NextResponse.json({ 
        error: 'ファイルが選択されていません' 
      }, { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
    });

    // ファイルタイプの検証
    if (!file.type || !SUPPORTED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: `サポートされていないファイル形式です: ${file.type || 'unknown'}`,
        supportedTypes: SUPPORTED_VIDEO_TYPES
      }, { status: 400 });
    }

    // ファイルサイズの検証
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `ファイルサイズが大きすぎます。${MAX_FILE_SIZE / (1024 * 1024)}MB以下のファイルをアップロードしてください。`,
        fileSize: file.size,
        maxSize: MAX_FILE_SIZE
      }, { status: 400 });
    }

    // Buffer取得
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイル名の生成
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // アップロードディレクトリ
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    
    // ディレクトリの作成
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
      console.log('Created upload directory:', uploadDir);
    }

    // ファイルの保存
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);
    console.log('File saved successfully:', filepath);

    // サムネイルディレクトリの作成
    const thumbnailDir = path.join(process.cwd(), 'public', 'uploads', 'thumbnails');
    try {
      await fs.access(thumbnailDir);
    } catch {
      await fs.mkdir(thumbnailDir, { recursive: true });
    }

    // レスポンス
    const response = {
      success: true,
      message: 'ファイルのアップロードが完了しました',
      data: {
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        path: `/uploads/videos/${filename}`,
        thumbnailPath: `/uploads/thumbnails/${timestamp}_thumbnail.jpg`,
        uploadedAt: new Date().toISOString()
      }
    };

    console.log('Upload complete:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('=== Upload Error ===');
    console.error(error);
    
    // エラーの詳細情報を含めて返す
    const errorResponse = {
      error: 'ファイルのアップロードに失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}