// シンプルで確実なAPIハンドラー
module.exports = (req, res) => {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // APIルート処理
  const { url, method } = req;
  
  // グローバルデータストア
  if (!global.store) {
    global.store = {
      profile: {
        id: 1,
        name: 'TAKAYA FILMS',
        title: 'Film Director',
        bio: 'プロフェッショナルな映画監督として、CM、ドキュメンタリーを専門に制作しています。',
        email: 'contact@takayafilms.com',
        phone: '090-1234-5678',
        location: 'Tokyo, Japan',
        website: 'https://takayafilms.com',
        social_links: {
          instagram: 'https://instagram.com/takayafilms',
          youtube: 'https://youtube.com/@takayafilms',
          vimeo: 'https://vimeo.com/takayafilms',
          linkedin: 'https://linkedin.com/in/takayafilms',
          twitter: ''
        },
        skills: ['Film Production', 'Directing', 'Editing', 'Color Grading'],
        services: ['Commercial Production', 'Documentary', 'Corporate Films']
      }
    };
  }

  // リクエストボディのパース
  const parseBody = () => {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          resolve(JSON.parse(body || '{}'));
        } catch {
          resolve({});
        }
      });
    });
  };

  // ルーティング
  const handleRequest = async () => {
    try {
      // テスト
      if (url === '/api/test') {
        return res.json({ message: 'API is working!', timestamp: new Date() });
      }

      // プロフィール取得
      if (url === '/api/profile' && method === 'GET') {
        return res.json(global.store.profile);
      }

      // プロフィール更新
      if (url === '/api/profile' && method === 'PUT') {
        const body = await parseBody();
        global.store.profile = { ...global.store.profile, ...body };
        return res.json({ success: true, data: global.store.profile });
      }

      // ログイン
      if (url === '/api/auth/login' && method === 'POST') {
        const body = await parseBody();
        if (body.username === 'admin' && body.password === 'admin123') {
          return res.json({
            token: 'token-' + Date.now(),
            user: { username: 'admin' }
          });
        }
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 404
      res.status(404).json({ error: 'Not found' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  handleRequest();
};