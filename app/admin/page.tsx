'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileManagerV2 from '@/components/ProfileManagerV2';
import VideoManager from '@/components/VideoManager';

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
      <div className="admin-loading">
        <div className="admin-loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-logo">TAKAYA FILMS - Admin</h1>
          <div className="admin-user-info">
            <span className="admin-user-name">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="admin-nav">
        <nav className="admin-nav-content">
          {['overview', 'works', 'profile'].map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`admin-nav-btn ${currentView === view ? 'active' : ''}`}
            >
              {view}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="admin-content">
        {currentView === 'overview' && (
          <div className="admin-overview">
            <h2>Dashboard Overview</h2>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <h3>Profile Status</h3>
                <div className="admin-stat-status active">Active</div>
              </div>
              <div className="admin-stat-card">
                <h3>Last Updated</h3>
                <div className="admin-stat-value">{new Date().toLocaleDateString('ja-JP')}</div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'works' && (
          <VideoManager token={token} />
        )}

        {currentView === 'profile' && (
          <ProfileManagerV2 token={token} />
        )}
      </div>
    </>
  );
};

export default Dashboard;