-- TAKAYA FILMS Database Schema
-- 最適化されたシンプルな構造

-- 既存のテーブルを削除（必要に応じて）
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

-- ==========================================
-- 1. プロフィールテーブル（1レコードのみ）
-- ==========================================
CREATE TABLE profile (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- 基本情報
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    
    -- 連絡先（JSONBで柔軟に管理）
    contact JSONB DEFAULT '{}',
    -- 例: {"email": "xxx@example.com", "phone": "090-xxxx-xxxx", "location": "Tokyo"}
    
    -- SNSリンク（JSONBで拡張可能）
    social_links JSONB DEFAULT '{}',
    -- 例: {"instagram": "https://...", "youtube": "https://...", "vimeo": "https://..."}
    
    -- スキルとサービス（配列で管理）
    skills TEXT[] DEFAULT '{}',
    services TEXT[] DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- プロフィールは1つだけ存在するように制限
CREATE UNIQUE INDEX profile_single_row ON profile ((true));

-- ==========================================
-- 2. 動画テーブル（シンプル化）
-- ==========================================
CREATE TABLE videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 必須情報
    title TEXT NOT NULL,
    video_url TEXT NOT NULL, -- YouTube URLまたは動画ファイルURL
    
    -- オプション情報
    description TEXT,
    category TEXT, -- 例: 'MV', 'CM', 'Documentary' など
    client TEXT,
    
    -- 表示制御
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス（パフォーマンス最適化）
CREATE INDEX idx_videos_published ON videos(is_published);
CREATE INDEX idx_videos_featured ON videos(is_featured);
CREATE INDEX idx_videos_sort ON videos(sort_order, created_at DESC);

-- ==========================================
-- 3. 自動更新トリガー
-- ==========================================
-- updated_atを自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- プロフィールテーブルのトリガー
CREATE TRIGGER profile_updated_at
    BEFORE UPDATE ON profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 動画テーブルのトリガー
CREATE TRIGGER videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- 4. Row Level Security (RLS)
-- ==========================================
-- プロフィールテーブルのRLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- 読み取りは全員可能
CREATE POLICY "Profile viewable by all" ON profile
    FOR SELECT USING (true);

-- 更新は認証されたユーザーのみ
CREATE POLICY "Profile updatable by authenticated" ON profile
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 動画テーブルのRLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 公開された動画は全員閲覧可能
CREATE POLICY "Published videos viewable by all" ON videos
    FOR SELECT USING (is_published = true);

-- 認証されたユーザーは全ての動画を操作可能
CREATE POLICY "Videos manageable by authenticated" ON videos
    FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 5. 初期データ（オプション）
-- ==========================================
-- プロフィールの初期データ
INSERT INTO profile (name, title, bio, contact, social_links)
VALUES (
    '鳥谷部 貴哉',
    'Videographer / Video Director',
    'プロフィールの説明文',
    '{"email": "", "phone": "", "location": ""}',
    '{"instagram": "", "youtube": "", "vimeo": ""}'
) ON CONFLICT DO NOTHING;

-- ==========================================
-- 6. ビュー（オプション - 便利な参照用）
-- ==========================================
-- 公開動画のみを取得するビュー
CREATE VIEW public_videos AS
SELECT 
    id,
    title,
    video_url,
    description,
    category,
    client,
    is_featured,
    sort_order,
    created_at
FROM videos
WHERE is_published = true
ORDER BY sort_order ASC, created_at DESC;