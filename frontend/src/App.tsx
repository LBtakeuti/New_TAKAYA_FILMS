import React, { useState, useEffect } from 'react';
import './App.css';
import ContactForm from './components/ContactForm';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  client: string;
  project_date: string;
  featured: boolean;
}

interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  services: string[];
  social_links: any;
}

interface Career {
  id: number;
  company_name: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  location: string;
  achievements: string;
}

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [videosRes, profileRes, careersRes] = await Promise.all([
        fetch('http://localhost:5001/api/videos'),
        fetch('http://localhost:5001/api/profile'),
        fetch('http://localhost:5001/api/career')
      ]);

      const videosData = await videosRes.json();
      setVideos(videosData);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      if (careersRes.ok) {
        const careersData = await careersRes.json();
        setCareers(careersData);
      }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long'
    });
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
            <li><a href="/admin" className="btn-secondary" style={{padding: '8px 16px', fontSize: '0.9rem'}}>Admin</a></li>
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
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.opacity = selectedCategory === category ? '1' : '0.6';
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
              <div key={video.id} className="portfolio-item">
                <div className="portfolio-image" style={{position: 'relative'}}>
                  {isYouTubeUrl(video.video_url) ? '📺 YouTube Video' : '🎬 Video'}
                  {video.featured && (
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255, 215, 0, 0.9)',
                      color: '#000',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      Featured
                    </span>
                  )}
                </div>
                <div className="portfolio-content">
                  <h3 className="portfolio-title">{video.title}</h3>
                  <p className="portfolio-description">{video.description}</p>
                  {video.category && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'rgba(45, 55, 72, 0.5)',
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{video.category}</span>
                      {video.client && <span>{video.client}</span>}
                    </div>
                  )}
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

            {/* Career History */}
            {careers.length > 0 && (
              <div style={{marginBottom: '80px'}}>
                <h4 style={{fontSize: '1.1rem', color: '#2d3748', marginBottom: '40px', textAlign: 'center', fontWeight: '400', letterSpacing: '0.02em'}}>Career</h4>
                <div style={{textAlign: 'left', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px'}}>
                  {careers.map((career, index) => (
                    <div key={career.id} style={{
                      padding: '25px',
                      background: 'rgba(255, 255, 255, 0.4)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      border: career.is_current ? '2px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 255, 255, 0.6)'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                        <div>
                          <h5 style={{margin: '0 0 5px 0', fontSize: '1.1rem', color: '#2d3748', fontWeight: '500'}}>
                            {career.position}
                            {career.is_current && (
                              <span style={{
                                marginLeft: '10px',
                                background: 'rgba(76, 175, 80, 0.2)',
                                color: 'rgba(76, 175, 80, 0.8)',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: '400'
                              }}>
                                現在
                              </span>
                            )}
                          </h5>
                          <p style={{margin: '0 0 5px 0', fontSize: '0.95rem', color: 'rgba(45, 55, 72, 0.8)', fontWeight: '400'}}>
                            {career.company_name}
                          </p>
                        </div>
                        <div style={{textAlign: 'right', fontSize: '0.85rem', color: 'rgba(45, 55, 72, 0.6)'}}>
                          <div>{formatDate(career.start_date)} - {career.is_current ? '現在' : formatDate(career.end_date)}</div>
                          {career.location && <div>{career.location}</div>}
                        </div>
                      </div>
                      
                      {career.description && (
                        <p style={{fontSize: '0.9rem', lineHeight: '1.7', color: 'rgba(45, 55, 72, 0.7)', margin: '15px 0', fontWeight: '300'}}>
                          {career.description}
                        </p>
                      )}
                      
                      {career.achievements && (
                        <div style={{marginTop: '15px', padding: '15px', background: 'rgba(248, 250, 252, 0.6)', borderRadius: '8px'}}>
                          <h6 style={{margin: '0 0 8px 0', fontSize: '0.85rem', color: 'rgba(45, 55, 72, 0.6)', fontWeight: '400'}}>主な実績・成果</h6>
                          <p style={{margin: 0, fontSize: '0.85rem', lineHeight: '1.6', color: 'rgba(45, 55, 72, 0.7)', fontWeight: '300'}}>
                            {career.achievements}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
        </div>
      </section>
    </div>
  );
}

export default App;