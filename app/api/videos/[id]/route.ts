import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const mockStorage = require('@/lib/mock-storage');

// Supabase設定
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Supabaseクライアントの取得
const getSupabase = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables are not set. Using mock storage.');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
};

// PUT: 動画更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const body = await request.json();
    const { title, description, youtube_url, video_url, category, client, status, featured, sort_order } = body;
    
    const updateData = {
      title,
      description,
      video_url: youtube_url || video_url || '',
      category: category || '',
      client: client || '',
      status: status || 'published',
      featured: featured || false,
      sort_order: sort_order || 0
    };

    const supabase = getSupabase();
    
    if (!supabase) {
      // モックストレージを使用
      const updated = mockStorage.videos.update(videoId, updateData);
      if (!updated) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Video updated successfully' });
    }

    const { data, error } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', videoId)
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Video updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: 動画削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    
    const supabase = getSupabase();
    
    if (!supabase) {
      // モックストレージを使用
      const deleted = mockStorage.videos.delete(videoId);
      if (!deleted) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Video deleted successfully' });
    }
    
    const { data, error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}