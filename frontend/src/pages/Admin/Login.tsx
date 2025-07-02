import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 仮のログイン（環境変数設定前でもテスト可能）
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // 仮のトークンとユーザー情報を作成
        const fakeToken = 'fake-jwt-token-for-testing';
        const fakeUser = {
          id: 1,
          username: 'admin',
          email: 'admin@takayafilms.com',
          role: 'admin'
        };
        
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(fakeUser));
        navigate('/admin/dashboard');
        return;
      }

      // 本来のAPI認証（環境変数設定後に動作）
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // 認証情報が間違っている場合
      if (credentials.username !== 'admin' || credentials.password !== 'admin123') {
        setError('ユーザー名またはパスワードが間違っています。admin / admin123 を入力してください。');
        return;
      }
      
      let errorMessage = 'ログインに失敗しました';
      
      if (error.userMessage) {
        errorMessage = error.userMessage;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (!error.response) {
        errorMessage = 'サーバーに接続できません。仮ログインを使用してください。';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Hiragino Sans, Yu Gothic Medium, Meiryo, MS PGothic, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#2a2a2a',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#ffffff'
          }}>
            TAKAYA FILMS Admin
          </h2>
          <p style={{
            margin: '0',
            fontSize: '0.9rem',
            color: '#999'
          }}>
            Sign in to manage your portfolio
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={credentials.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3a3a3a',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '16px',
                marginBottom: '15px'
              }}
              placeholder="Username"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={credentials.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3a3a3a',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '16px'
              }}
              placeholder="Password"
            />
          </div>

          {error && (
            <div style={{
              color: '#ff6b6b',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '15px',
              background: '#4a1a1a',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: loading ? '#666' : '#ffffff',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '20px'
              }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '14px',
            color: '#999',
            marginBottom: '10px'
          }}>
            Default credentials: admin / admin123
          </p>
          <button
            type="button"
            onClick={() => {
              setCredentials({ username: 'admin', password: 'admin123' });
              setTimeout(() => {
                const form = document.querySelector('form') as HTMLFormElement;
                if (form) {
                  form.requestSubmit();
                }
              }, 100);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4a9eff',
              fontSize: '14px',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            ワンクリックログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;