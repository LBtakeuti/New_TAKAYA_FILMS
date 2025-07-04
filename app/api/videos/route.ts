import { NextRequest, NextResponse } from 'next/server';

// グローバルストレージ（本番環境ではSupabaseまたはデータベースを使用）
declare global {
  var videoStore: any;
}

if (!global.videoStore) {
  global.videoStore = {
    videos: [],
    nextId: 1
  };
}

export async function GET() {
  try {
    const publishedVideos = global.videoStore.videos.filter((video: any) => video.is_published);
    return NextResponse.json(publishedVideos.sort((a: any, b: any) => a.sort_order - b.sort_order || new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // ローカルホストでは認証をスキップ
    const host = request.headers.get('host');
    const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
    
    if (!isLocalhost) {
      // 本番環境のみ認証チェック（今は省略）
      console.log('Production environment - auth required');
    }
    
    const body = await request.json();
    
    const video = {
      id: global.videoStore.nextId++,
      title: body.title,
      description: body.description || '',
      video_url: body.youtube_url || body.video_url,
      thumbnail_url: body.thumbnail_url || null,
      category: body.category || 'Other',
      client: body.client || '',
      project_date: body.project_date || null,
      status: body.status || 'published',
      is_published: body.status !== 'draft',
      featured: body.featured || false,
      is_featured: body.featured || false,
      sort_order: body.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    global.videoStore.videos.push(video);
    
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}