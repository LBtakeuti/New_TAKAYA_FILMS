-- TAKAYA FILMS Portfolio Database Schema for Supabase
-- PostgreSQL version

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table for portfolio management
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_url VARCHAR(500),
    file_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
    client VARCHAR(255),
    project_date DATE,
    status VARCHAR(20) DEFAULT 'published',
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile table for personal information
CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio TEXT,
    profile_image_url VARCHAR(500),
    email VARCHAR(100),
    phone VARCHAR(20),
    location VARCHAR(255),
    website VARCHAR(255),
    social_links JSONB,
    skills JSONB,
    services JSONB,
    instagram_url VARCHAR(500),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash) 
VALUES ('admin', 'admin@takayafilms.com', '$2b$10$oSFxih2mDGX.UajpEm.qM.lYT18tVkmDD2qatgGtrF8Gd0Onqa5Te')
ON CONFLICT (username) DO NOTHING;

-- Insert default profile
INSERT INTO profile (name, title, bio, instagram_url) 
VALUES (
    'TAKAYA', 
    'Film Creator & Director', 
    'Professional video creator specializing in cinematic storytelling and commercial production.',
    'https://instagram.com/takaya_films'
)
ON CONFLICT DO NOTHING;