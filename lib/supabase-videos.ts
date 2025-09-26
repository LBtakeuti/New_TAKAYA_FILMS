import { supabase } from './supabase-client';
import { logger } from '@/utils/logger';
import { Video } from '@/types';

// メモリキャッシュ（Supabase未設定時のフォールバック）
let memoryCache: Video[] = [];

// Supabaseが利用可能かチェック
const isSupabaseConfigured = () => {
  return supabase !== null;
};

// 動画一覧の取得
export const getVideos = async (publishedOnly = true): Promise<Video[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    // Supabase未設定時はメモリキャッシュを返す
    return publishedOnly 
      ? memoryCache.filter(v => v.is_published)
      : memoryCache;
  }

  try {
    let query = supabase.from('videos').select('*');
    
    if (publishedOnly) {
      query = query.eq('is_published', true);
    }
    
    const { data, error } = await query
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    logger.error('Error fetching videos:', error);
    // エラー時はメモリキャッシュを返す
    return publishedOnly 
      ? memoryCache.filter(v => v.is_published)
      : memoryCache;
  }
};

// 動画の作成
export const createVideo = async (videoData: Partial<Video>): Promise<Video | null> => {
  if (!isSupabaseConfigured()) {
    // Supabase未設定時はメモリに保存
    const newVideo: Video = {
      id: Date.now(),
      title: videoData.title || '',
      description: videoData.description || '',
      video_url: videoData.video_url || '',
      video_file_path: videoData.video_file_path,
      thumbnail_url: videoData.thumbnail_url,
      thumbnail_file_path: videoData.thumbnail_file_path,
      video_type: videoData.video_type || 'youtube',
      file_size: videoData.file_size,
      duration: videoData.duration,
      mime_type: videoData.mime_type,
      category: videoData.category || 'Other',
      client: videoData.client,
      project_date: videoData.project_date,
      status: videoData.status || 'published',
      is_published: videoData.status !== 'draft',
      featured: videoData.featured || false,
      is_featured: videoData.featured || false,
      sort_order: videoData.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    memoryCache.push(newVideo);
    return newVideo;
  }

  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    const { data, error } = await supabase
      .from('videos')
      .insert([{
        ...videoData,
        is_published: videoData.status !== 'draft',
        is_featured: videoData.featured || false
      }])
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    logger.error('Error creating video:', error);
    return null;
  }
};

// 動画の更新
export const updateVideo = async (id: number, videoData: Partial<Video>): Promise<Video | null> => {
  if (!isSupabaseConfigured()) {
    // メモリキャッシュを更新
    const index = memoryCache.findIndex(v => v.id === id);
    if (index !== -1) {
      memoryCache[index] = {
        ...memoryCache[index],
        ...videoData,
        updated_at: new Date().toISOString()
      };
      return memoryCache[index];
    }
    return null;
  }

  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    const { data, error } = await supabase
      .from('videos')
      .update({
        ...videoData,
        is_published: videoData.status !== 'draft',
        is_featured: videoData.featured || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    logger.error('Error updating video:', error);
    return null;
  }
};

// 動画の削除
export const deleteVideo = async (id: number): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    // メモリキャッシュから削除
    const index = memoryCache.findIndex(v => v.id === id);
    if (index !== -1) {
      memoryCache.splice(index, 1);
      return true;
    }
    return false;
  }

  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    logger.error('Error deleting video:', error);
    return false;
  }
};