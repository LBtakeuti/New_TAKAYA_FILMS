import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }

    // ファイル名の生成（タイムスタンプを使用）
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    
    // 本番環境ではS3やCloudinaryなどのクラウドストレージを使用すべき
    // ここではローカルに保存（開発環境のみ）
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // publicフォルダに保存
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(filePath, buffer);
    
    // URLを返す
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      url: fileUrl,
      message: '動画をアップロードしました' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'アップロードに失敗しました' },
      { status: 500 }
    );
  }
}