-- TAKAYA FILMS Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profile table (single row for the portfolio owner)
CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'TAKAYA FILMS',
  title VARCHAR(255) DEFAULT 'Film Director & Video Creator',
  bio TEXT DEFAULT 'プロフェッショナルなビデオグラファーとして、CM、ミュージックビデオ、ドキュメンタリーを専門に制作しています。',
  email VARCHAR(255) DEFAULT 'contact@takayafilms.com',
  phone VARCHAR(50) DEFAULT '090-1234-5678',
  location VARCHAR(255) DEFAULT 'Tokyo, Japan',
  website VARCHAR(255) DEFAULT 'https://takayafilms.com',
  social_links JSONB DEFAULT '{
    "instagram": "https://instagram.com/takayafilms",
    "youtube": "https://youtube.com/@takayafilms",
    "vimeo": "https://vimeo.com/takayafilms",
    "linkedin": "https://linkedin.com/in/takayafilms",
    "twitter": ""
  }'::jsonb,
  skills TEXT[] DEFAULT ARRAY['Video Production', 'Directing', 'Editing', 'Color Grading', 'Motion Graphics'],
  services TEXT[] DEFAULT ARRAY['Commercial Production', 'Music Video', 'Documentary', 'Corporate Video', 'Event Coverage'],
  profile_image_url VARCHAR(500),
  instagram_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'commercial',
  client VARCHAR(255),
  project_date DATE,
  video_url VARCHAR(500),
  youtube_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'published',
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default profile if not exists
INSERT INTO profile (id, name, title, bio, email, phone, location, website)
VALUES (1, 'TAKAYA FILMS', 'Film Director & Video Creator', 
        'プロフェッショナルなビデオグラファーとして、CM、ミュージックビデオ、ドキュメンタリーを専門に制作しています。',
        'contact@takayafilms.com', '090-1234-5678', 'Tokyo, Japan', 'https://takayafilms.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample video
INSERT INTO videos (title, description, category, youtube_url, video_url, featured, sort_order)
VALUES ('サンプル動画 - TAKAYA FILMS', 
        'これはサンプル動画です。管理画面から動画を追加・編集できます。',
        'commercial',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        true,
        1)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies (Row Level Security)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profile and videos
CREATE POLICY "Public profiles are viewable by everyone" ON profile
  FOR SELECT USING (true);

CREATE POLICY "Public videos are viewable by everyone" ON videos
  FOR SELECT USING (true);

-- Allow authenticated users to update profile and manage videos
CREATE POLICY "Authenticated users can update profile" ON profile
  FOR ALL USING (true);

CREATE POLICY "Authenticated users can manage videos" ON videos
  FOR ALL USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON profile, videos TO anon;
GRANT ALL ON profile, videos TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;