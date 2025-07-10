-- 動画テーブルの作成
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT,
  video_file_path TEXT,
  thumbnail_url TEXT,
  thumbnail_file_path TEXT,
  video_type VARCHAR(20) DEFAULT 'youtube' CHECK (video_type IN ('youtube', 'file')),
  file_size BIGINT,
  duration INTEGER,
  mime_type VARCHAR(100),
  category VARCHAR(50) NOT NULL DEFAULT 'Other',
  client VARCHAR(255),
  project_date DATE,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  is_published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured);
CREATE INDEX IF NOT EXISTS idx_videos_sort_order ON videos(sort_order);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) の有効化
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 読み取り用ポリシー（公開されている動画は誰でも読める）
CREATE POLICY "Public videos are viewable by everyone" ON videos
  FOR SELECT USING (is_published = true);

-- 管理者用ポリシー（認証されたユーザーは全操作可能）
CREATE POLICY "Authenticated users can manage videos" ON videos
  FOR ALL USING (auth.role() = 'authenticated');

-- サンプルデータの挿入（オプション）
/*
INSERT INTO videos (title, description, video_url, category, status, featured)
VALUES 
  ('Welcome to TAKAYA FILMS', 'Introduction video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Commercial', 'published', true),
  ('Wedding Highlights 2024', 'Beautiful wedding ceremony', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Wedding', 'published', false);
*/