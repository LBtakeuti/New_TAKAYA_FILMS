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

// GET: 動画一覧取得
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      // モックストレージを使用
      const videos = mockStorage.videos.getAll();
      return NextResponse.json(videos || []);
    }
    
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: 動画作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, youtube_url, video_url, category, client, status, featured, sort_order } = body;
    
    console.log('Creating video with data:', body);
    
    if (!title) {
      return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
    }
    
    const insertData = {
      title,
      description: description || '',
      video_url: youtube_url || video_url || '',
      thumbnail_url: '',
      category: category || '',
      client: client || '',
      status: status || 'published',
      featured: featured || false,
      sort_order: sort_order || 0
    };
    
    console.log('Inserting data:', insertData);
    
    const supabase = getSupabase();
    
    if (!supabase) {
      // モックストレージを使用
      const newVideo = mockStorage.videos.create(insertData);
      return NextResponse.json({ 
        id: newVideo.id, 
        message: 'Video created successfully', 
        data: newVideo 
      });
    }
    
    const { data, error } = await supabase
      .from('videos')
      .insert([insertData])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error.details || 'データベースエラーが発生しました'
      }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'データの保存に失敗しました' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      id: data[0].id, 
      message: 'Video created successfully', 
      data: data[0] 
    });
  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json({ 
      error: err.message || 'サーバーエラーが発生しました' 
    }, { status: 500 });
  }
}