import React, { useState } from 'react';
import VideoManager from './components/VideoManager';
import ProfileManager from './components/ProfileManager';

// Simple Admin Interface for Testing
function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [token, setToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('接続エラー: バックエンドサーバーに接続できません');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCredentials({ username: '', password: '' });
    setToken('');
    setCurrentView('dashboard');
  };

  const testAPI = async (endpoint: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api${endpoint}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      alert(`API Test Result:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert(`API Error: ${error}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{textAlign: 'center', marginBottom: '30px', color: '#333'}}>
            TAKAYA FILMS Admin
          </h1>
          
          <form onSubmit={handleLogin}>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px'}}>
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="admin"
                required
              />
            </div>
            
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px'}}>
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="admin123"
                required
              />
            </div>
            
            {error && (
              <div style={{
                color: '#d32f2f',
                fontSize: '14px',
                marginBottom: '20px',
                padding: '8px',
                background: '#ffebee',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Login
            </button>
          </form>
          
          <div style={{marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#888'}}>
            <p>Default credentials:</p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Admin Header */}
      <header style={{
        background: 'white',
        padding: '0 40px',
        borderBottom: '1px solid #ddd',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '60px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <h1 style={{margin: 0, color: '#333'}}>TAKAYA FILMS Admin</h1>
            <nav style={{ display: 'flex', gap: '20px' }}>
              <button
                onClick={() => setCurrentView('dashboard')}
                style={{
                  background: currentView === 'dashboard' ? '#f0f0f0' : 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ダッシュボード
              </button>
              <button
                onClick={() => setCurrentView('videos')}
                style={{
                  background: currentView === 'videos' ? '#f0f0f0' : 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                動画管理
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                style={{
                  background: currentView === 'profile' ? '#f0f0f0' : 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                プロフィール
              </button>
            </nav>
          </div>
          <div>
            <button
              onClick={() => window.open('/', '_blank')}
              style={{
                padding: '8px 16px',
                marginRight: '10px',
                background: 'transparent',
                border: '1px solid #000',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard */}
      <main style={{maxWidth: '1200px', margin: '0 auto'}}>
        {currentView === 'dashboard' && (
          <div style={{padding: '40px'}}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Stats Cards */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{margin: '0 0 15px 0', color: '#333'}}>📹 Videos</h3>
            <p style={{fontSize: '2rem', margin: '0 0 10px 0', color: '#000'}}>0</p>
            <p style={{color: '#666', margin: 0, fontSize: '14px'}}>Total uploaded videos</p>
          </div>


          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{margin: '0 0 15px 0', color: '#333'}}>✅ Status</h3>
            <p style={{fontSize: '1.2rem', margin: '0 0 10px 0', color: '#4caf50'}}>System Online</p>
            <p style={{color: '#666', margin: 0, fontSize: '14px'}}>Ready for content management</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{margin: '0 0 20px 0', color: '#333'}}>Quick Actions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <button
              onClick={() => setCurrentView('videos')}
              style={{
                padding: '15px',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📹 Add Video
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              style={{
                padding: '15px',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              👤 Edit Profile
            </button>
            <button
              onClick={() => testAPI('/test')}
              style={{
                padding: '15px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔧 Test API
            </button>
          </div>
        </div>

        {/* API Testing */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{margin: '0 0 20px 0', color: '#333'}}>API Testing</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <button
              onClick={() => testAPI('/videos')}
              style={{
                padding: '10px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              GET /videos
            </button>
            <button
              onClick={() => testAPI('/profile')}
              style={{
                padding: '10px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              GET /profile
            </button>
            <button
              onClick={() => testAPI('/auth/verify')}
              style={{
                padding: '10px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Verify Token
            </button>
          </div>
        </div>
          </div>
        )}

        {currentView === 'videos' && (
          <VideoManager token={token} />
        )}


        {currentView === 'profile' && (
          <ProfileManager token={token} />
        )}
      </main>
    </div>
  );
}

export default AdminApp;