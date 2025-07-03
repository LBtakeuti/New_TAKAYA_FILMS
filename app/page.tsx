'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [videosResponse, profileResponse] = await Promise.all([
        api.get('/videos').catch(() => ({ data: [] })),
        api.get('/profile').catch(() => ({ data: null }))
      ]);
      
      setVideos(videosResponse.data || []);
      setProfile(profileResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(videos.map(v => v.category).filter(Boolean))];
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  // YouTube URLからサムネイルを取得
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
        </div>

        <div className="video-grid">
          {loading ? (
            <div className="loading-state">Loading portfolio...</div>
          ) : filteredVideos.length === 0 ? (
            <div className="empty-state">No videos available in this category.</div>
          ) : (
            filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="video-card"
                onClick={() => openVideoPlayer(video)}
              >
                <div className="video-thumbnail">
                  {video.video_url && (
                    <img 
                      src={getYouTubeThumbnail(video.video_url)} 
                      alt={video.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${extractYouTubeId(video.video_url)}/hqdefault.jpg`;
                      }}
                    />
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
          {profile ? (
            <div className="profile-content">
              <h3 className="profile-name">{profile.name}</h3>
              <p className="profile-title">{profile.title}</p>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              
              {profile.skills && profile.skills.length > 0 && (
                <div className="profile-section">
                  <h4>Skills</h4>
                  <div className="skills-list">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile.services && profile.services.length > 0 && (
                <div className="profile-section">
                  <h4>Services</h4>
                  <ul className="services-list">
                    {profile.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="social-links">
                {profile.social_links?.instagram && (
                  <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                )}
                {profile.social_links?.youtube && (
                  <a href={profile.social_links.youtube} target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>
                )}
                {profile.social_links?.vimeo && (
                  <a href={profile.social_links.vimeo} target="_blank" rel="noopener noreferrer">
                    Vimeo
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="profile-placeholder">
              <p>プロフィール情報を読み込んでいます...</p>
            </div>
          )}
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
          isOpen={isPlayerOpen}
          onClose={closeVideoPlayer}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
}
