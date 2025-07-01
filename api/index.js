const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const authHandlers = require('./auth');
const profileHandlers = require('./profile');
const contactHandlers = require('./contact');

// データベース設定
const dbPath = path.join(__dirname, '..', 'database.db');
const db = new sqlite3.Database(dbPath);

// API ルートハンドラー
module.exports = (req, res) => {
  const { url, method } = req;
  
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // URL ルーティング
  if (url.startsWith('/api/auth/login') && method === 'POST') {
    return authHandlers.login(req, res);
  }
  
  if (url.startsWith('/api/auth/verify') && method === 'GET') {
    return authHandlers.verify(req, res);
  }
  
  if (url.startsWith('/api/profile') && method === 'GET') {
    return profileHandlers.getProfile(req, res);
  }
  
  if (url.startsWith('/api/profile') && method === 'PUT') {
    return profileHandlers.updateProfile(req, res);
  }
  
  if (url.startsWith('/api/contact/send') && method === 'POST') {
    return contactHandlers.sendContact(req, res);
  }
  
  if (url.startsWith('/api/videos')) {
    const videosModule = require('./videos');
    return videosModule(req, res);
  }
  
  if (url.startsWith('/api/test') && method === 'GET') {
    return res.json({ message: 'TAKAYA FILMS API is running!' });
  }
  
  // 404 for API routes
  res.status(404).json({ error: 'API route not found' });
};