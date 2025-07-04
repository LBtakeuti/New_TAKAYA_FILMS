-- Supabaseのデータベースで実行するSQL

-- profilesテーブル
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  profile_image_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  website VARCHAR(255),
  social_links JSONB,
  skills TEXT[],
  services TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS（Row Level Security）を有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 公開用のポリシーを作成（誰でも読み取り可能）
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  TO PUBLIC 
  USING (true);

-- 管理者用のポリシー（すべての操作が可能）
-- 注意：実際の環境では、認証を使用してより厳密な制御を行ってください
CREATE POLICY "Enable all operations for authenticated users on profiles" 
  ON profiles FOR ALL 
  TO authenticated 
  USING (true);