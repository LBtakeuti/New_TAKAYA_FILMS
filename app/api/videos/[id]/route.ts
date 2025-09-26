import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { updateVideo, deleteVideo } from '@/lib/supabase-videos';

// PUT: 動画を更新
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const body = await request.json();
    
    // 動画データの準備
    const videoData = {
      title: body.title,
      description: body.description || '',
      video_url: body.youtube_url || body.video_url || '',
      video_file_path: body.video_file_path,
      thumbnail_url: body.thumbnail_url,
      thumbnail_file_path: body.thumbnail_file_path,
      video_type: body.video_type,
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

    const updatedVideo = await updateVideo(id, videoData);
    
    if (!updatedVideo) {
      return NextResponse.json(
        { error: 'Video not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedVideo);
  } catch (error) {
    logger.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' }, 
      { status: 500 }
    );
  }
}

// DELETE: 動画を削除
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    
    const success = await deleteVideo(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Video not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    logger.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' }, 
      { status: 500 }
    );
  }
}