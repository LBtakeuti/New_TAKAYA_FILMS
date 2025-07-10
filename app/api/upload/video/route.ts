import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
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
  logger.log('=== Video Upload API Started ===');
  
  // 環境変数の確認
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  logger.log('Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'not set',
    isSupabaseAvailable: isSupabaseAvailable()
  });
  
  try {
    // Supabaseが利用できない場合の詳細な情報
    if (!isSupabaseAvailable()) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
      if (!supabaseKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      
      return NextResponse.json({ 
        error: '動画アップロード機能を利用するにはSupabaseの設定が必要です',
        details: 'Supabase環境変数が設定されていません',
        missingVariables: missingVars,
        instructions: [
          '1. Supabaseでプロジェクトを作成',
          '2. プロジェクト設定からAPI URLとAnon Keyを取得',
          '3. Vercelの環境変数に設定',
          '4. 再デプロイを実行'
        ],
        alternativeOption: 'YouTube URLでの動画投稿は引き続き利用可能です'
      }, { status: 503 });
    }

    // FormDataの解析
    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    
    if (!file) {
      logger.error('No file found in form data');
      return NextResponse.json({ 
        error: 'ファイルが選択されていません' 
      }, { status: 400 });
    }

    logger.log('File received:', {
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

    logger.log('Uploading to Supabase Storage...');
    
    // バケットの確認・作成
    try {
      const { data: buckets, error: listError } = await supabase!.storage.listBuckets();
      
      if (listError) {
        logger.error('Bucket list error:', listError);
        throw new Error(`ストレージバケットの確認に失敗: ${listError.message}`);
      }
      
      const videoBucketExists = buckets?.some(bucket => bucket.name === VIDEO_BUCKET);
      
      if (!videoBucketExists) {
        logger.log('Creating video bucket...');
        const { error: createError } = await supabase!.storage.createBucket(VIDEO_BUCKET, {
          public: true,
          allowedMimeTypes: SUPPORTED_VIDEO_TYPES,
          fileSizeLimit: MAX_FILE_SIZE
        });
        
        if (createError && !createError.message.includes('already exists')) {
          logger.error('Bucket creation error:', createError);
          throw new Error(`バケット作成エラー: ${createError.message}`);
        }
      }
    } catch (error) {
      logger.error('Storage setup error:', error);
      return NextResponse.json({
        error: 'ストレージの初期化に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Supabaseダッシュボードで手動でバケットを作成してください'
      }, { status: 500 });
    }

    // 動画ファイルのアップロード
    logger.log('Uploading file:', filename);
    const { data: uploadData, error: uploadError } = await supabase!.storage
      .from(VIDEO_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      logger.error('Upload error:', uploadError);
      
      // エラーの詳細な解析
      if (uploadError.message.includes('row-level security')) {
        return NextResponse.json({
          error: 'アップロード権限エラー',
          details: 'Supabaseのストレージポリシーを確認してください',
          solution: 'Supabaseダッシュボードで、Storageのポリシーを「Public」に設定してください'
        }, { status: 403 });
      }
      
      if (uploadError.message.includes('bucket')) {
        return NextResponse.json({
          error: 'ストレージバケットエラー',
          details: uploadError.message,
          solution: `Supabaseダッシュボードで"${VIDEO_BUCKET}"バケットを作成してください`
        }, { status: 500 });
      }
      
      throw uploadError;
    }

    logger.log('Upload successful:', uploadData);

    // 公開URLの取得
    const { data: urlData } = supabase!.storage
      .from(VIDEO_BUCKET)
      .getPublicUrl(filename);

    const videoUrl = urlData.publicUrl;
    logger.log('Public URL:', videoUrl);

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
        thumbnailPath: null,
        uploadedAt: new Date().toISOString()
      }
    };

    logger.log('Upload complete:', response);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('=== Upload Error ===');
    logger.error(error);
    
    // エラーの詳細情報を含めて返す
    const errorResponse = {
      error: 'ファイルのアップロードに失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString(),
      // デバッグ情報
      debug: {
        hasSupabase: isSupabaseAvailable(),
        environment: process.env.NODE_ENV
      }
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}