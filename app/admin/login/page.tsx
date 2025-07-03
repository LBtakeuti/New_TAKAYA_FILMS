'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Login attempt with:', { username: credentials.username });
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || error.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1 className="admin-login-title">
          TAKAYA FILMS Admin
        </h1>
        
        <div style={{ 
          background: '#f0f0f0', 
          padding: '15px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          fontSize: '14px',
          color: '#333'
        }}>
          <strong>ログイン情報:</strong><br />
          Username: admin<br />
          Password: takaya2024
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              className="admin-form-input"
            />
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              className="admin-form-input"
            />
          </div>
          
          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="admin-submit-btn"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;