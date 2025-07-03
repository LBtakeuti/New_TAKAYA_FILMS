'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoManager from '@/components/VideoManager';
import ProfileManagerV2 from '@/components/ProfileManagerV2';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState('overview');
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!storedToken || !userData) {
        router.push('/admin/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setToken(storedToken);
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
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
      background: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{
        background: '#000',
        color: '#fff',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>
          TAKAYA FILMS - Admin Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, {user.username}</span>
          <button
            onClick={handleLogout}
            style={{
              background: '#d32f2f',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #ddd',
        padding: '0 20px'
      }}>
        <nav style={{ display: 'flex', gap: '30px' }}>
          {['overview', 'videos', 'profile'].map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                background: 'none',
                border: 'none',
                padding: '15px 0',
                cursor: 'pointer',
                fontSize: '16px',
                borderBottom: currentView === view ? '2px solid #000' : 'none',
                color: currentView === view ? '#000' : '#666',
                textTransform: 'capitalize'
              }}
            >
              {view}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {currentView === 'overview' && (
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3>Total Videos</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>-</p>
              </div>
              <div style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3>Profile Status</h3>
                <p style={{ color: '#4caf50' }}>Active</p>
              </div>
              <div style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3>Last Updated</h3>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'videos' && (
          <VideoManager token={token} />
        )}

        {currentView === 'profile' && (
          <ProfileManagerV2 token={token} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;