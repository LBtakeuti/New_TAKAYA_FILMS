// 統合APIハンドラー - すべてのエンドポイントを1つにまとめる
const storage = require('../lib/memory-storage');

module.exports = async (req, res) => {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const method = req.method || '';

  try {
    // リクエストボディをパース
    if (method === 'POST' || method === 'PUT') {
      if (!req.body) {
        let body = '';
        req.setEncoding('utf8');
        for await (const chunk of req) {
          body += chunk;
        }
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch (e) {
          req.body = {};
        }
      }
    }

    // manifest.json
    if (url.includes('manifest.json')) {
      return res.status(200).json({
        short_name: "TAKAYA FILMS",
        name: "TAKAYA FILMS Portfolio",
        icons: [{
          src: "favicon.ico",
          sizes: "64x64 32x32 24x24 16x16",
          type: "image/x-icon"
        }],
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff"
      });
    }

    // プロフィール API
    if (url.includes('/profile') || url.includes('/simple-profile')) {
      if (method === 'GET') {
        const profile = storage.getProfile();
        return res.status(200).json(profile);
      }
      if (method === 'PUT') {
        const updatedProfile = storage.updateProfile(req.body);
        return res.status(200).json({ 
          message: 'Profile updated successfully',
          data: updatedProfile 
        });
      }
    }

    // 動画 API
    if (url.includes('/videos') || url.includes('/simple-videos')) {
      if (method === 'GET') {
        const videos = storage.getAllVideos();
        return res.status(200).json(videos);
      }
      if (method === 'POST') {
        const newVideo = storage.createVideo(req.body);
        return res.status(201).json(newVideo);
      }
      if (method === 'PUT') {
        const videoId = url.match(/\/(\d+)$/)?.[1];
        if (videoId) {
          const updatedVideo = storage.updateVideo(videoId, req.body);
          if (updatedVideo) {
            return res.status(200).json(updatedVideo);
          }
          return res.status(404).json({ error: 'Video not found' });
        }
      }
      if (method === 'DELETE') {
        const videoId = url.match(/\/(\d+)$/)?.[1];
        if (videoId) {
          const deletedVideo = storage.deleteVideo(videoId);
          if (deletedVideo) {
            return res.status(200).json({ message: 'Video deleted successfully' });
          }
          return res.status(404).json({ error: 'Video not found' });
        }
      }
    }

    // 認証 API
    if (url.includes('/auth/login')) {
      return res.status(200).json({
        message: 'Login successful',
        token: 'mock-token-123',
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@takayafilms.com',
          role: 'admin'
        }
      });
    }

    if (url.includes('/auth/verify')) {
      return res.status(200).json({ 
        valid: true, 
        user: { id: 1, username: 'admin', role: 'admin' } 
      });
    }

    // テスト API
    if (url.includes('/test')) {
      return res.status(200).json({ message: 'TAKAYA FILMS API is running!' });
    }

    // その他のリクエストは404
    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('Universal handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};