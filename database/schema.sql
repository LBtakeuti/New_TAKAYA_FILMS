-- TAKAYA FILMS Portfolio Database Schema

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Videos table for portfolio management
CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
    client VARCHAR(255),
    project_date DATE,
    status VARCHAR(20) DEFAULT 'published',
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Career table for professional history
CREATE TABLE IF NOT EXISTS career (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    achievements TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Profile table for personal information
CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio TEXT,
    profile_image_url VARCHAR(500),
    email VARCHAR(100),
    phone VARCHAR(20),
    location VARCHAR(255),
    website VARCHAR(255),
    social_links JSON,
    skills JSON,
    services JSON,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO users (username, email, password_hash) 
VALUES ('admin', 'admin@takayafilms.com', '$2b$10$oSFxih2mDGX.UajpEm.qM.lYT18tVkmDD2qatgGtrF8Gd0Onqa5Te');

-- Insert default profile
INSERT OR IGNORE INTO profile (name, title, bio) 
VALUES ('TAKAYA', 'Film Creator & Director', 'Professional video creator specializing in cinematic storytelling and commercial production.');