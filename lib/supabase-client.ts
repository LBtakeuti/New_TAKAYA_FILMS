import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Supabase Storageが利用可能かチェック
export const isSupabaseAvailable = () => {
  return supabase !== null;
};

// 動画ファイルアップロード用のバケット名
export const VIDEO_BUCKET = 'videos';
export const THUMBNAIL_BUCKET = 'thumbnails';