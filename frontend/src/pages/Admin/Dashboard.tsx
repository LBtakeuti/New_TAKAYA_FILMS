import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoManager from '../../components/VideoManager';
import ProfileManagerV2 from '../../components/ProfileManagerV2';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState('overview');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!storedToken || !userData) {
        navigate('/admin/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setToken(storedToken);
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#fff', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      fontFamily: 'Hiragino Sans, Yu Gothic Medium, Meiryo, MS PGothic, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: '#2a2a2a',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        padding: '0 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#fff',
              margin: 0
            }}>
              TAKAYA FILMS Admin
            </h1>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{ color: '#ccc' }}>Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              style={{
                background: '#dc2626',
                color: '#fff',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#b91c1c';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#dc2626';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <nav style={{
          width: '250px',
          background: '#2a2a2a',
          padding: '20px 0',
          borderRight: '1px solid #3a3a3a'
        }}>
          <div style={{ padding: '0 20px' }}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'videos', label: 'Video Management', icon: '📹' },
              { id: 'profile', label: 'Profile Management', icon: '👤' },
              { id: 'site', label: 'View Site', icon: '🌐' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'site') {
                    window.open('/', '_blank');
                  } else {
                    setCurrentView(item.id);
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  margin: '4px 0',
                  background: currentView === item.id ? '#3b82f6' : 'transparent',
                  color: currentView === item.id ? '#fff' : '#ccc',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  if (currentView !== item.id) {
                    e.currentTarget.style.background = '#3a3a3a';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentView !== item.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '30px',
          overflow: 'auto'
        }}>
          {currentView === 'overview' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#fff',
                marginBottom: '20px'
              }}>
                Dashboard Overview
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  background: '#2a2a2a',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '24px', marginRight: '10px' }}>📹</span>
                    <h3 style={{ color: '#fff', margin: 0 }}>Video Management</h3>
                  </div>
                  <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '14px' }}>
                    Manage your video portfolio, upload new videos, and organize your content.
                  </p>
                  <button
                    onClick={() => setCurrentView('videos')}
                    style={{
                      background: '#3b82f6',
                      color: '#fff',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Manage Videos
                  </button>
                </div>

                <div style={{
                  background: '#2a2a2a',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '24px', marginRight: '10px' }}>👤</span>
                    <h3 style={{ color: '#fff', margin: 0 }}>Profile Management</h3>
                  </div>
                  <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '14px' }}>
                    Update your personal information, bio, and contact details.
                  </p>
                  <button
                    onClick={() => setCurrentView('profile')}
                    style={{
                      background: '#8b5cf6',
                      color: '#fff',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Profile
                  </button>
                </div>

                <div style={{
                  background: '#2a2a2a',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '24px', marginRight: '10px' }}>🌐</span>
                    <h3 style={{ color: '#fff', margin: 0 }}>Live Site</h3>
                  </div>
                  <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '14px' }}>
                    View your live website and see how changes appear to visitors.
                  </p>
                  <button
                    onClick={() => window.open('/', '_blank')}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    View Site
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentView === 'videos' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#fff',
                marginBottom: '20px'
              }}>
                Video Management
              </h2>
              <VideoManager token={token} />
            </div>
          )}

          {currentView === 'profile' && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#fff',
                marginBottom: '20px'
              }}>
                Profile Management
              </h2>
              <ProfileManagerV2 token={token} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;