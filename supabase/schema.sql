-- TAKAYA FILMS Database Schema
-- 最適化されたシンプルな構造

-- 既存のテーブルを削除（必要に応じて）
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
-- 2. 自動更新トリガー
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

-- ==========================================
-- 3. Row Level Security (RLS)
-- ==========================================
-- プロフィールテーブルのRLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- 読み取りは全員可能
CREATE POLICY "Profile viewable by all" ON profile
    FOR SELECT USING (true);

-- 更新は認証されたユーザーのみ
CREATE POLICY "Profile updatable by authenticated" ON profile
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ==========================================
-- 4. 初期データ（オプション）
-- ==========================================
-- プロフィールの初期データ
INSERT INTO profile (name, title, bio, contact, social_links)
VALUES (
    '鳥谷部 貴哉',
    'Film Director',
    'プロフィールの説明文',
    '{"email": "", "phone": "", "location": ""}',
    '{"instagram": "", "youtube": "", "vimeo": ""}'
) ON CONFLICT DO NOTHING;