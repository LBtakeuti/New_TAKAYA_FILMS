import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const mockStorage = require('@/lib/mock-storage');

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabaseクライアントの取得
const getSupabase = () => {
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'your_supabase_url_here' || 
      supabaseKey === 'your_supabase_anon_key_here') {
    console.warn('Supabase environment variables are not properly configured. Using mock storage.');
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
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
      is_published: status === 'published',
      is_featured: featured || false,
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