import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

// サポートする動画形式
const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/ogg'
];

// 最大ファイルサイズ（500MB）
const MAX_FILE_SIZE = 500 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 });
    }

    // ファイルタイプの検証
    if (!SUPPORTED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'サポートされていないファイル形式です。MP4、MOV、AVI、WebM、OGG形式のファイルをアップロードしてください。' 
      }, { status: 400 });
    }

    // ファイルサイズの検証
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'ファイルサイズが大きすぎます。500MB以下のファイルをアップロードしてください。' 
      }, { status: 400 });
    }

    // ファイル名の生成（タイムスタンプ + 元のファイル名）
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    
    // アップロードディレクトリの確認・作成
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // ファイルの保存
    const filepath = join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // サムネイルの生成（動画の最初のフレームから）
    const thumbnailFilename = `${timestamp}_thumbnail.jpg`;
    const thumbnailDir = join(process.cwd(), 'public', 'uploads', 'thumbnails');
    if (!existsSync(thumbnailDir)) {
      await mkdir(thumbnailDir, { recursive: true });
    }

    // NOTE: 動画からサムネイルを生成するにはffmpegが必要
    // 今回はプレースホルダーとして空のサムネイルを作成
    let thumbnailPath = null;
    try {
      const thumbnailBuffer = await sharp({
        create: {
          width: 480,
          height: 360,
          channels: 3,
          background: { r: 200, g: 200, b: 200 }
        }
      })
      .png()
      .toBuffer();
      
      const thumbnailFilepath = join(thumbnailDir, thumbnailFilename);
      await writeFile(thumbnailFilepath, thumbnailBuffer);
      thumbnailPath = `/uploads/thumbnails/${thumbnailFilename}`;
    } catch (error) {
      console.error('サムネイル生成エラー:', error);
      // サムネイル生成に失敗しても動画アップロードは成功として扱う
    }

    // レスポンスデータ
    const responseData = {
      success: true,
      message: 'ファイルのアップロードが完了しました',
      data: {
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        path: `/uploads/videos/${filename}`,
        thumbnailPath,
        uploadedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    return NextResponse.json({ 
      error: 'ファイルのアップロードに失敗しました。再度お試しください。' 
    }, { status: 500 });
  }
}