import axios from 'axios';
import { logger } from '@/utils/logger';

// クライアントサイドで動的にベースURLを決定
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // ブラウザ環境
    const { protocol, hostname, port } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    // 本番環境では相対パスを使用
    return '/api';
  }
  // サーバーサイド（ビルド時など）
  return process.env.NEXT_PUBLIC_API_URL || '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Add authorization header to requests when token exists
api.interceptors.request.use(
  (config) => {
    // 常にトークンを送信する（開発環境でも本番環境でも）
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // デバッグ用ログ（開発環境のみ、GETリクエストは除外）
    if (config.method !== 'get' && process.env.NODE_ENV === 'development') {
      logger.log('API Request:', {
        url: config.url,
        method: config.method,
        hasToken: !!token
      });
    }
    
    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we're not already on the login page AND this is an admin route
      if (!window.location.pathname.includes('/admin/login') && window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    
    // For network errors or 500 errors, provide a more user-friendly message
    if (!error.response) {
      error.userMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
    } else if (error.response.status >= 500) {
      error.userMessage = 'サーバーエラーが発生しました。しばらくしてから再度お試しください。';
    } else if (error.response.status === 403) {
      error.userMessage = '認証エラーです。再度ログインしてください。';
    } else if (error.response.status === 404) {
      error.userMessage = 'APIエンドポイントが見つかりません。';
    }
    
    return Promise.reject(error);
  }
);

export default api;