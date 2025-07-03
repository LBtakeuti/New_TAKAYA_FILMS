const authHandlers = require('./auth');
const profileHandlers = require('./profile');
const contactHandlers = require('./contact');
const videoHandlers = require('./videos');
const { verifyToken, optionalAuth } = require('./middleware/auth');

// リクエストボディをパースする関数
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    if (req.body) {
      resolve(req.body);
      return;
    }
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(body || '{}');
        resolve(req.body);
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
};

// API ルートハンドラー
module.exports = async (req, res) => {
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
  // POSTやPUTリクエストの場合はボディをパース
  if (method === 'POST' || method === 'PUT') {
    try {
      await parseBody(req);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  }

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
    // 認証チェックを実行
    return verifyToken(req, res, () => {
      return profileHandlers.updateProfile(req, res);
    });
  }
  
  if (url.startsWith('/api/contact/send') && method === 'POST') {
    return contactHandlers.sendContact(req, res);
  }
  
  if (url.startsWith('/api/videos')) {
    return videoHandlers(req, res);
  }
  
  if (url.startsWith('/api/test') && method === 'GET') {
    return res.json({ message: 'TAKAYA FILMS API is running!' });
  }
  
  // 404 for API routes
  res.status(404).json({ error: 'API route not found' });
};