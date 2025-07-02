import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Profile } from '../../types';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    videos: 0,
    profileUpdated: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        navigate('/admin/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Load dashboard stats here
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
              TAKAYA FILMS Admin Dashboard
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

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Welcome Message */}
        <div style={{
          background: '#2a2a2a',
          padding: '30px',
          borderRadius: '8px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#fff',
            marginBottom: '10px'
          }}>
            ログイン成功！
          </h2>
          <p style={{
            color: '#ccc',
            fontSize: '1rem',
            margin: 0
          }}>
            管理画面にアクセスできています。今後、ここでビデオの管理やプロフィールの更新が可能になります。
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: '#2a2a2a',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#3b82f6',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <span style={{ color: '#fff', fontSize: '14px' }}>📹</span>
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#999',
                  marginBottom: '4px'
                }}>
                  Total Videos
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#fff'
                }}>
                  {stats.videos}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#2a2a2a',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#10b981',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <span style={{ color: '#fff', fontSize: '14px' }}>✅</span>
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#999',
                  marginBottom: '4px'
                }}>
                  Authentication Status
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#10b981'
                }}>
                  Authenticated
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#2a2a2a',
          padding: '30px',
          borderRadius: '8px'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            color: '#fff',
            marginBottom: '20px'
          }}>
            クイックアクション
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <button style={{
              background: '#3b82f6',
              color: '#fff',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              ビデオ管理
            </button>
            <button style={{
              background: '#8b5cf6',
              color: '#fff',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              プロフィール編集
            </button>
            <button style={{
              background: '#10b981',
              color: '#fff',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              サイト確認
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;