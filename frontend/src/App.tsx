import React, { useState, useEffect } from 'react';
import api from './utils/api';
import './App.css';
import ContactForm from './components/ContactForm';
import { Video } from './types';

interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  services: string[];
  social_links: any;
}

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [hoverTimeouts, setHoverTimeouts] = useState<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [videosRes, profileRes] = await Promise.all([
        api.get('/videos'),
        api.get('/profile')
      ]);

      const videosData = videosRes.data;
      // console.log('Videos data:', videosData); // デバッグ用
      setVideos(videosData);

      const profileData = profileRes.data;
      console.log('Profile data:', profileData); // デバッグ用
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(videos.map(video => video.category).filter(Boolean)))];
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const isYouTubeUrl = (url: string) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    
    // youtube.com/watch?v=VIDEO_ID
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&\n?#]+)/);
    if (youtubeMatch) return youtubeMatch[1];
    
    // youtu.be/VIDEO_ID
    const youtubeShortMatch = url.match(/(?:youtu\.be\/)([^&\n?#]+)/);
    if (youtubeShortMatch) return youtubeShortMatch[1];
    
    // youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/(?:youtube\.com\/embed\/)([^&\n?#]+)/);
    if (embedMatch) return embedMatch[1];
    
    return null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    
    // Use hqdefault for more reliable thumbnail display
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const handleVideoClick = (video: Video) => {
    setPlayingVideo(playingVideo?.id === video.id ? null : video);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0` : null;
  };

  const isLocalVideoFile = (url: string) => {
    return url.startsWith('/uploads/') && (url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || url.includes('.wmv'));
  };

  const getLocalVideoUrl = (url: string) => {
    const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';
    return `${baseUrl}${url}`;
  };




  return (
    <div className="App">
      {/* Navigation */}
      <nav className="App-nav">
        <div className="nav-container">
          <a href="/" className="nav-logo">TAKAYA FILMS</a>
          <ul className="nav-menu">
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Portfolio Section - Main Landing */}
      <section 
        id="portfolio" 
        className="content-section" 
        style={{ paddingTop: '200px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '120px' }}>
          <h1 className="hero-title">
            TAKAYA FILMS
          </h1>
          <p className="hero-subtitle">
            Commercial Production / Music Video / Documentary
          </p>
        </div>

        {/* Category Filter */}
        <div style={{textAlign: 'center', marginBottom: '80px'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px'}}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: selectedCategory === category ? '2px solid #000000' : '1px solid transparent',
                  padding: '12px 0',
                  color: '#000000',
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.05em',
                  opacity: selectedCategory === category ? 1 : 0.6
                }}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '0'}}>Selected Works</h2>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '60px', color: 'rgba(45, 55, 72, 0.6)'}}>
            Loading videos...
          </div>
        ) : filteredVideos.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px', color: 'rgba(45, 55, 72, 0.6)'}}>
            動画がまだ登録されていません
          </div>
        ) : (
          <div className="portfolio-grid">
            {filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="portfolio-item"
                onClick={() => handleVideoClick(video)}
                style={{cursor: 'pointer', position: 'relative'}}
              >
                <div className="portfolio-image" style={{position: 'relative', overflow: 'hidden', aspectRatio: '16/9'}}>
                  {playingVideo?.id === video.id ? (
                    // 動画プレイヤー表示
                    <div style={{width: '100%', height: '100%', aspectRatio: '16/9'}}>
                      {isYouTubeUrl(video.video_url) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(video.video_url) || ''}
                          style={{width: '100%', height: '100%', border: 'none', aspectRatio: '16/9'}}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          title={video.title}
                        />
                      ) : isLocalVideoFile(video.video_url) ? (
                        <video
                          src={getLocalVideoUrl(video.video_url)}
                          style={{width: '100%', height: '100%', aspectRatio: '16/9', objectFit: 'cover'}}
                          controls
                          autoPlay
                          title={video.title}
                        >
                          ブラウザが動画の再生をサポートしていません。
                        </video>
                      ) : (
                        <div style={{
                          width: '100%', 
                          height: '100%', 
                          aspectRatio: '16/9',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: '#f0f0f0',
                          color: '#666'
                        }}>
                          サポートされていない動画形式です
                        </div>
                      )}
                    </div>
                  ) : (
                    // サムネイル表示
                    <>
                      {isYouTubeUrl(video.video_url) ? (
                        <div style={{position: 'relative', width: '100%', height: '100%'}}>
                          <img 
                            src={getYouTubeThumbnail(video.video_url) || undefined}
                            alt={video.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: 'none !important',
                              WebkitFilter: 'none !important',
                              opacity: '1 !important',
                              background: 'transparent'
                            }}
                            onLoad={(e) => {
                              e.currentTarget.style.filter = 'none';
                              e.currentTarget.style.webkitFilter = 'none';
                              e.currentTarget.style.opacity = '1';
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const videoId = getYouTubeVideoId(video.video_url);
                              if (videoId && target.src.includes('hqdefault')) {
                                target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                              }
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0, 0, 0, 0.7)',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '24px',
                            pointerEvents: 'none',
                            transition: 'all 0.3s ease',
                            opacity: 0.8
                          }}
                          >
                            ▶
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f8f8f8',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          {video.thumbnail_url ? (
                            <img 
                              src={video.thumbnail_url} 
                              alt={video.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            '🎬 Video'
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {video.featured ? (
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255, 215, 0, 0.9)',
                      color: '#000',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      zIndex: 2
                    }}>
                      Featured
                    </span>
                  ) : null}
                  {isYouTubeUrl(video.video_url) ? (
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(255, 0, 0, 0.9)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      zIndex: 2
                    }}>
                      YouTube
                    </span>
                  ) : null}
                </div>
                <div className="portfolio-content" style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'relative',
                      cursor: 'help'
                    }}
                    onMouseEnter={(e) => {
                      // Clear any existing timeout for this video
                      const existingTimeout = hoverTimeouts.get(video.id);
                      if (existingTimeout) {
                        clearTimeout(existingTimeout);
                      }
                      
                      // Set new timeout for 1 second delay
                      const newTimeout = setTimeout(() => {
                        const tooltip = e.currentTarget.querySelector('.video-tooltip') as HTMLElement;
                        if (tooltip) {
                          tooltip.style.opacity = '1';
                          tooltip.style.visibility = 'visible';
                        }
                      }, 1000);
                      
                      // Update timeouts map
                      setHoverTimeouts(prev => {
                        const newMap = new Map(prev);
                        newMap.set(video.id, newTimeout);
                        return newMap;
                      });
                    }}
                    onMouseLeave={(e) => {
                      // Clear timeout for this video
                      const existingTimeout = hoverTimeouts.get(video.id);
                      if (existingTimeout) {
                        clearTimeout(existingTimeout);
                        setHoverTimeouts(prev => {
                          const newMap = new Map(prev);
                          newMap.delete(video.id);
                          return newMap;
                        });
                      }
                      
                      const tooltip = e.currentTarget.querySelector('.video-tooltip') as HTMLElement;
                      if (tooltip) {
                        tooltip.style.opacity = '0';
                        tooltip.style.visibility = 'hidden';
                      }
                    }}
                  >
                    <h3 
                      className="portfolio-title" 
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.4',
                        height: 'auto',
                        minHeight: '2.8em'
                      }}
                    >
                      {video.title}
                    </h3>
                    
                    <div style={{ marginBottom: '12px', flex: 1 }}>
                      <p 
                        className="portfolio-description"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.6',
                          margin: 0
                        }}
                      >
                        {video.description}
                      </p>
                    </div>
                    
                    {/* Tooltip content */}
                    <div
                      className="video-tooltip"
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '10px',
                        background: '#F8F8F8',
                        color: '#333',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        lineHeight: '1.4',
                        maxWidth: '300px',
                        minWidth: '250px',
                        opacity: '0',
                        visibility: 'hidden',
                        pointerEvents: 'none',
                        transition: 'opacity 0.3s ease, visibility 0.3s ease',
                        zIndex: 20,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem', color: '#222' }}>
                        {video.title}
                      </div>
                      {video.description && (
                        <div style={{ fontSize: '0.75rem', color: '#555', whiteSpace: 'pre-wrap' }}>
                          {video.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'rgba(45, 55, 72, 0.5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {video.category && <span>{video.category}</span>}
                      {video.client && <span>{video.client}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="content-section">
        <h2 className="section-title">About</h2>
        {loading ? (
          <div style={{textAlign: 'center', padding: '60px', color: 'rgba(45, 55, 72, 0.6)'}}>
            Loading profile...
          </div>
        ) : (
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            {/* Profile Header */}
            <div style={{textAlign: 'center', marginBottom: '80px'}}>
              <h3 style={{fontSize: '1.8rem', fontWeight: '300', color: '#2d3748', marginBottom: '16px', letterSpacing: '0.02em', lineHeight: '1.4'}}>
                {profile?.name || '鳥谷部 貴哉'} / Takaya Toriyabe
              </h3>
              <p style={{fontSize: '1rem', color: 'rgba(45, 55, 72, 0.6)', marginBottom: '0', fontWeight: '300', letterSpacing: '0.02em'}}>
                {profile?.title || 'Videographer / Video Director'}
              </p>
              {profile?.bio && (
                <p style={{fontSize: '0.95rem', lineHeight: '1.8', color: 'rgba(45, 55, 72, 0.7)', marginTop: '20px', fontWeight: '300'}}>
                  {profile.bio}
                </p>
              )}
            </div>


            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div style={{textAlign: 'center', marginBottom: '60px'}}>
                <h4 style={{fontSize: '1.1rem', color: '#2d3748', marginBottom: '40px', fontWeight: '400', letterSpacing: '0.02em'}}>Skills</h4>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', maxWidth: '600px', margin: '0 auto'}}>
                  {profile.skills.map((skill, index) => (
                    <span key={index} style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: '24px',
                      padding: '10px 20px',
                      color: 'rgba(45, 55, 72, 0.8)',
                      fontSize: '0.85rem',
                      fontWeight: '300',
                      backdropFilter: 'blur(10px)',
                      letterSpacing: '0.01em'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {profile?.services && profile.services.length > 0 && (
              <div style={{textAlign: 'center'}}>
                <h4 style={{fontSize: '1.1rem', color: '#2d3748', marginBottom: '40px', fontWeight: '400', letterSpacing: '0.02em'}}>Services</h4>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', maxWidth: '600px', margin: '0 auto'}}>
                  {profile.services.map((service, index) => (
                    <span key={index} style={{
                      background: 'rgba(232, 245, 232, 0.8)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      borderRadius: '24px',
                      padding: '10px 20px',
                      color: 'rgba(45, 55, 72, 0.8)',
                      fontSize: '0.85rem',
                      fontWeight: '300',
                      backdropFilter: 'blur(10px)',
                      letterSpacing: '0.01em'
                    }}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="content-section">
        <h2 className="section-title">Contact</h2>
        <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
          <p style={{fontSize: '1.1rem', color: '#666', marginBottom: '3rem', lineHeight: '1.8'}}>
            プロジェクトのご相談やお問い合わせは、お気軽にご連絡ください。
          </p>
          <ContactForm />
          
          {/* Instagram Logo - Central Position */}
          {profile?.social_links?.instagram && (
            <div style={{
              marginTop: '3rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <a
                href={profile.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '1px solid #999',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  background: 'transparent',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#999';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="24" 
                  height="24" 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  fill="none" 
                  stroke="#666" 
                  strokeWidth="1.2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="3"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="#666"/>
                </svg>
              </a>
            </div>
          )}
          
          {/* Other Social Links */}
          {profile?.social_links && (profile?.social_links?.youtube || profile?.social_links?.vimeo) && (
            <div style={{marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(0, 0, 0, 0.1)'}}>
              <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem'}}>
                Follow us on social media
              </p>
              <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                {profile.social_links.youtube && (
                  <a
                    href={profile.social_links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      padding: '12px',
                      background: '#FF0000',
                      borderRadius: '50%',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '20px',
                      width: '48px',
                      height: '48px',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                
                {profile.social_links.vimeo && (
                  <a
                    href={profile.social_links.vimeo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      padding: '12px',
                      background: '#1ab7ea',
                      borderRadius: '50%',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '20px',
                      width: '48px',
                      height: '48px',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

export default App;