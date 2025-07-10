'use client';

import React, { useState, useEffect, useRef } from 'react';
import { logger } from '@/utils/logger';
import api from '@/utils/api';
import ContactForm from '@/components/ContactForm';
import VideoPlayer from '@/components/VideoPlayer';
import { Video, Profile } from '@/types';

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // 初回のみデータを取得
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }
    
    // データの自動更新（5分ごと）- 頻度を下げる
    const interval = setInterval(() => {
      fetchData();
    }, 300000); // 5分 = 300,000ms
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    // 既に読み込み中の場合はスキップ
    if (isFetchingRef.current) {
      logger.log('Skipping fetch - already in progress');
      return;
    }
    
    isFetchingRef.current = true;
    logger.log('Starting data fetch...');
    
    try {
      const [videosResponse, profileResponse] = await Promise.all([
        api.get('/videos').catch((error) => {
          logger.error('Videos fetch error:', error);
          return { data: [] };
        }),
        api.get('/profile').catch((error) => {
          logger.error('Profile fetch error:', error);
          return { data: null };
        })
      ]);
      
      logger.log('Data fetched successfully:', {
        videos: videosResponse.data?.length || 0,
        hasProfile: !!profileResponse.data
      });
      
      setVideos(videosResponse.data || []);
      setProfile(profileResponse.data);
    } catch (error) {
      logger.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const categories = ['all', ...new Set(videos.map(v => v.category).filter(Boolean))];
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  // サムネイルを取得
  const getThumbnail = (video: Video): string => {
    if (video.video_type === 'file' && video.thumbnail_file_path) {
      return video.thumbnail_file_path;
    }
    if (video.video_type === 'youtube' && video.video_url) {
      const videoId = extractYouTubeId(video.video_url);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    return '/placeholder-video.jpg';
  };

  // YouTube URLからVideo IDを抽出
  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // ビデオプレイヤーを開く
  const openVideoPlayer = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  // ビデオプレイヤーを閉じる
  const closeVideoPlayer = () => {
    setIsPlayerOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };


  return (
    <div className="App">
      {/* Navigation */}
      <nav className="App-nav">
        <div className="nav-container">
          <h1 className="nav-logo">TAKAYA FILMS</h1>
          <div className="nav-links">
            <a href="#portfolio">PORTFOLIO</a>
            <a href="#about">ABOUT</a>
            <a href="#contact">CONTACT</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">TAKAYA FILMS</h1>
          <p className="hero-subtitle">Cinematic Visual Storytelling</p>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio-section">
        <div className="section-header">
          <h2 className="section-title">PORTFOLIO</h2>
          {categories.length > 1 && (
            <div className="category-filter">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="video-grid">
          {loading ? (
            <div className="loading-state">Loading portfolio...</div>
          ) : filteredVideos.length === 0 ? (
            <div className="empty-state">No works available in this category.</div>
          ) : (
            filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="video-card"
                onClick={() => openVideoPlayer(video)}
              >
                <div className="video-thumbnail">
                  <img 
                    src={getThumbnail(video)} 
                    alt={video.title}
                    loading="lazy"
                    onError={(e) => {
                      if (video.video_type === 'youtube' && video.video_url) {
                        e.currentTarget.src = `https://img.youtube.com/vi/${extractYouTubeId(video.video_url)}/hqdefault.jpg`;
                      } else {
                        e.currentTarget.src = '/placeholder-video.jpg';
                      }
                    }}
                  />
                  {video.video_type === 'file' && (
                    <div className="video-type-badge">
                      📁 ファイル
                    </div>
                  )}
                  <div className="play-overlay">
                    <div className="play-button">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {video.category && (
                    <span className="video-duration">{video.category}</span>
                  )}
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  {video.client && <p className="video-client">{video.client}</p>}
                  {video.description && (
                    <p className="video-description">{video.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <h2 className="section-title">ABOUT</h2>
          <div className="profile-content">
            <h3 className="profile-name">鳥谷部 貴哉 / Takaya Toriyabe</h3>
            <p className="profile-title">Videographer / Video Director</p>
            <p className="profile-bio">
              2017年より広告出版業界にてBtoB営業に従事。チームの育成やメンバーサポート、採用・新人研修など、営業活動と並行して組織づくりにも携わる。2020年には自社のYouTubeチャンネル立ち上げに携わり、運営を通じて映像の可能性に魅了される。2024年にフリーランスとして独立。現在はウェディングムービーを中心に、企業PR動画、SNSコンテンツなど幅広い映像制作に取り組む。2025年には自身のウェディング映像ブランド「Utopia Wedding」を立ち上げる。
            </p>
            <div className="profile-instagram">
              <a 
                href="https://www.instagram.com/toriyabe_takaya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="instagram-link"
              >
                <svg className="instagram-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
                <span>@toriyabe_takaya</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2 className="section-title">CONTACT</h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="App-footer">
        <p>&copy; 2024 TAKAYA FILMS. All rights reserved.</p>
      </footer>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.video_url}
          videoFilePath={selectedVideo.video_file_path}
          videoType={selectedVideo.video_type}
          isOpen={isPlayerOpen}
          onClose={closeVideoPlayer}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
}
