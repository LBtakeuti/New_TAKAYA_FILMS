import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { corsHeaders, handleCorsOptions } from '@/app/api/middleware/cors';
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

// GET: 動画一覧取得
export async function GET(request: NextRequest) {
  try {
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);
    
    const supabase = getSupabase();
    
    if (!supabase) {
      console.log('Using mock storage for videos');
      // モックストレージを使用
      const videos = mockStorage.videos.getAll();
      const response = NextResponse.json(videos || []);
      return corsHeaders(response);
    }
    
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const response = NextResponse.json(data || []);
    return corsHeaders(response);
  } catch (err: any) {
    const response = NextResponse.json({ error: err.message }, { status: 500 });
    return corsHeaders(response);
  }
}

// POST: 動画作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, youtube_url, video_url, category, client, status, featured, sort_order } = body;
    
    console.log('Creating video with data:', body);
    
    if (!title) {
      const response = NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
      return corsHeaders(response);
    }
    
    const insertData = {
      title,
      description: description || '',
      video_url: youtube_url || video_url || '',
      category: category || '',
      client: client || '',
      is_published: status === 'published',
      is_featured: featured || false,
      sort_order: sort_order || 0
    };
    
    console.log('Inserting data:', insertData);
    
    const supabase = getSupabase();
    
    if (!supabase) {
      // モックストレージを使用
      const newVideo = mockStorage.videos.create(insertData);
      const response = NextResponse.json({ 
        id: newVideo.id, 
        message: 'Video created successfully', 
        data: newVideo 
      });
      return corsHeaders(response);
    }
    
    const { data, error } = await supabase
      .from('videos')
      .insert([insertData])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      const response = NextResponse.json({ 
        error: error.message,
        details: error.details || 'データベースエラーが発生しました'
      }, { status: 500 });
      return corsHeaders(response);
    }
    
    if (!data || data.length === 0) {
      const response = NextResponse.json({ error: 'データの保存に失敗しました' }, { status: 500 });
      return corsHeaders(response);
    }
    
    const response = NextResponse.json({ 
      id: data[0].id, 
      message: 'Video created successfully', 
      data: data[0] 
    });
    return corsHeaders(response);
  } catch (err: any) {
    console.error('Server error:', err);
    const response = NextResponse.json({ 
      error: err.message || 'サーバーエラーが発生しました' 
    }, { status: 500 });
    return corsHeaders(response);
  }
}

// OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions();
}