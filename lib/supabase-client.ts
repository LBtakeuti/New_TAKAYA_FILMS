import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabaseクライアントの作成（URLとキーが有効な場合のみ）
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return !url.includes('your_supabase_url_here');
  } catch {
    return false;
  }
};

export const supabase = isValidUrl(supabaseUrl) && supabaseKey && !supabaseKey.includes('your_')
  ? createClient(supabaseUrl!, supabaseKey)
  : null;

// Supabase Storageが利用可能かチェック
export const isSupabaseAvailable = () => {
  return supabase !== null;
};

// 動画ファイルアップロード用のバケット名
export const VIDEO_BUCKET = 'videos';
export const THUMBNAIL_BUCKET = 'thumbnails';