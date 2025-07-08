import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const videoIndex = global.videoStore.videos.findIndex((video: any) => video.id === id);
    
    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const updatedVideo = {
      ...global.videoStore.videos[videoIndex],
      title: body.title,
      description: body.description || '',
      video_url: body.youtube_url || body.video_url || '',
      video_file_path: body.video_file_path || global.videoStore.videos[videoIndex].video_file_path || null,
      thumbnail_url: body.thumbnail_url || null,
      thumbnail_file_path: body.thumbnail_file_path || global.videoStore.videos[videoIndex].thumbnail_file_path || null,
      video_type: body.video_type || global.videoStore.videos[videoIndex].video_type || 'youtube',
      file_size: body.file_size || global.videoStore.videos[videoIndex].file_size || null,
      duration: body.duration || global.videoStore.videos[videoIndex].duration || null,
      mime_type: body.mime_type || global.videoStore.videos[videoIndex].mime_type || null,
      category: body.category || 'Other',
      client: body.client || '',
      project_date: body.project_date || null,
      status: body.status || 'published',
      is_published: body.status !== 'draft',
      featured: body.featured || false,
      is_featured: body.featured || false,
      sort_order: body.sort_order || 0,
      updated_at: new Date().toISOString()
    };

    global.videoStore.videos[videoIndex] = updatedVideo;
    
    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    const videoIndex = global.videoStore.videos.findIndex((video: any) => video.id === id);
    
    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    global.videoStore.videos.splice(videoIndex, 1);
    
    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}