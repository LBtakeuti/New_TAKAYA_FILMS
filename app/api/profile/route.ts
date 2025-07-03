import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const mockStorage = require('@/lib/mock-storage');
import { verifyToken } from '@/app/api/middleware/auth';

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

// GET: プロフィール取得（公開）
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      // モックストレージを使用
      const profile = mockStorage.profile.get();
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      return NextResponse.json(profile);
    }
    
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: プロフィール更新（認証必要）
export async function PUT(request: NextRequest) {
  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Access denied. No token provided.' }, { status: 401 });
    }
    
    // トークン検証
    try {
      verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
    
    const body = await request.json();
    console.log('Profile update request received:', body);
    
    const {
      name,
      title,
      bio,
      email,
      phone,
      location,
      website,
      social_links,
      skills,
      services,
      instagram_url
    } = body;

    const supabase = getSupabase();
    
    if (!supabase) {
      // モックストレージを使用
      const updateData = {
        name,
        title,
        bio,
        contact: {
          email: email || '',
          phone: phone || '',
          location: location || '',
          website: website || ''
        },
        social_links: {
          ...social_links,
          instagram: instagram_url || social_links?.instagram || ''
        },
        skills,
        services,
        updated_at: new Date().toISOString()
      };
      
      const currentProfile = mockStorage.profile.get();
      if (currentProfile) {
        const updated = mockStorage.profile.update(updateData);
        return NextResponse.json({ 
          message: 'Profile updated successfully', 
          data: updated 
        });
      } else {
        const created = mockStorage.profile.create(updateData);
        return NextResponse.json({ 
          id: created.id,
          message: 'Profile created successfully', 
          data: created 
        }, { status: 201 });
      }
    }

    // 既存のプロフィールデータを取得
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profile')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();

    if (currentProfile) {
      // 既存プロフィールの更新
      const updateData = {
        name,
        title,
        bio,
        contact: {
          email: email || '',
          phone: phone || '',
          location: location || '',
          website: website || ''
        },
        social_links: {
          ...social_links,
          instagram: instagram_url || social_links?.instagram || ''
        },
        skills,
        services,
        updated_at: new Date().toISOString()
      };

      console.log('Updating profile with data:', updateData);

      const { data, error } = await supabase
        .from('profile')
        .update(updateData)
        .eq('id', currentProfile.id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log('Profile updated successfully:', data);
      return NextResponse.json({ 
        message: 'Profile updated successfully', 
        data: data[0] 
      });
    } else {
      // 新規プロフィール作成
      const { data, error } = await supabase
        .from('profile')
        .insert([{
          name,
          title,
          bio,
          email,
          phone,
          location,
          website,
          social_links,
          skills,
          services,
          instagram_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log('Profile created successfully:', data);
      return NextResponse.json({
        id: data[0].id,
        message: 'Profile created successfully',
        data: data[0]
      }, { status: 201 });
    }
  } catch (err: any) {
    console.error('Profile update error:', err);
    return NextResponse.json({ 
      error: err.message || 'Internal server error' 
    }, { status: 500 });
  }
}