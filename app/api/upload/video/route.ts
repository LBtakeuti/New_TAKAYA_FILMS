import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseAvailable, VIDEO_BUCKET, THUMBNAIL_BUCKET } from '@/lib/supabase-client';

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

// 最大ファイルサイズ（100MB）
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export async function POST(request: NextRequest) {
  console.log('=== Video Upload API Started ===');
  console.log('Supabase available:', isSupabaseAvailable());
  
  try {
    // Supabaseが利用できない場合はエラー
    if (!isSupabaseAvailable()) {
      return NextResponse.json({ 
        error: '動画アップロード機能は現在利用できません。Supabase設定を確認してください。',
        details: 'Supabase環境変数が設定されていません'
      }, { status: 503 });
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

    // ファイル名の生成
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // Supabase Storageにアップロード
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Uploading to Supabase Storage...');
    
    // バケットの確認・作成
    const { data: buckets } = await supabase!.storage.listBuckets();
    const videoBucketExists = buckets?.some(bucket => bucket.name === VIDEO_BUCKET);
    
    if (!videoBucketExists) {
      console.log('Creating video bucket...');
      const { error: createError } = await supabase!.storage.createBucket(VIDEO_BUCKET, {
        public: true,
        allowedMimeTypes: SUPPORTED_VIDEO_TYPES
      });
      
      if (createError && !createError.message.includes('already exists')) {
        console.error('Bucket creation error:', createError);
        throw createError;
      }
    }

    // 動画ファイルのアップロード
    const { data: uploadData, error: uploadError } = await supabase!.storage
      .from(VIDEO_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful:', uploadData);

    // 公開URLの取得
    const { data: urlData } = supabase!.storage
      .from(VIDEO_BUCKET)
      .getPublicUrl(filename);

    const videoUrl = urlData.publicUrl;

    // サムネイル用のプレースホルダーURL
    // 実際のサムネイル生成はクライアント側で行うか、別途サービスを使用
    const thumbnailUrl = null;

    // レスポンス
    const response = {
      success: true,
      message: 'ファイルのアップロードが完了しました',
      data: {
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        path: videoUrl,
        thumbnailPath: thumbnailUrl,
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