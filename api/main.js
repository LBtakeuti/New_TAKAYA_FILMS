// メインAPIハンドラー - すべてのリクエストを処理
// Vercel環境で確実に動作する実装

// グローバルデータストア（Vercelのホットリロードに対応）
if (!global.takayaFilmsStore) {
  global.takayaFilmsStore = {
    profile: {
      id: 1,
      name: 'TAKAYA FILMS',
      title: 'Film Director & Video Creator',
      bio: 'プロフェッショナルなビデオグラファーとして、CM、ミュージックビデオ、ドキュメンタリーを専門に制作しています。',
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
      skills: ['Video Production', 'Directing', 'Editing', 'Color Grading', 'Motion Graphics'],
      services: ['Commercial Production', 'Music Video', 'Documentary', 'Corporate Video', 'Event Coverage'],
      instagram_url: 'https://instagram.com/takayafilms',
      updated_at: new Date().toISOString()
    },
    videos: [
      {
        id: 1,
        title: 'サンプル動画 - TAKAYA FILMS',
        description: 'これはサンプル動画です。管理画面から動画を追加・編集できます。',
        category: 'commercial',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        client: 'サンプルクライアント',
        project_date: '2024-01-01',
        status: 'published',
        featured: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    videoIdCounter: 2,
    users: [
      {
        id: 1,
        username: 'admin',
        password_hash: '$2a$10$YourHashedPasswordHere', // admin123
        email: 'admin@takayafilms.com',
        role: 'admin'
      }
    ]
  };
}

// リクエストボディをパースする関数
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        console.error('Parse error:', e);
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

// メインハンドラー
module.exports = async (req, res) => {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // プリフライトリクエスト
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const method = req.method || '';
  
  console.log(`[API] ${method} ${url}`);

  try {
    // POSTとPUTリクエストのボディをパース
    if (method === 'POST' || method === 'PUT') {
      req.body = await parseBody(req);
      console.log('[API] Request body:', req.body);
    }

    // ルーティング
    
    // テストエンドポイント
    if (url === '/api/test' || url === '/api/') {
      return res.status(200).json({ 
        message: 'TAKAYA FILMS API is running!',
        timestamp: new Date().toISOString()
      });
    }

    // プロフィール取得
    if ((url === '/api/profile' || url === '/api/simple-profile' || url === '/api/kv/get') && method === 'GET') {
      console.log('[API] Getting profile');
      if (url === '/api/kv/get') {
        return res.status(200).json(global.takayaFilmsStore);
      }
      return res.status(200).json(global.takayaFilmsStore.profile);
    }

    // プロフィール更新
    if ((url === '/api/profile' || url === '/api/simple-profile' || url === '/api/kv/profile') && method === 'PUT') {
      console.log('[API] Updating profile');
      global.takayaFilmsStore.profile = {
        ...global.takayaFilmsStore.profile,
        ...req.body,
        updated_at: new Date().toISOString()
      };
      return res.status(200).json({ 
        success: true,
        message: 'Profile updated successfully',
        data: global.takayaFilmsStore.profile 
      });
    }

    // 動画一覧取得
    if ((url === '/api/videos' || url === '/api/simple-videos' || url === '/api/kv/videos') && method === 'GET') {
      console.log('[API] Getting videos');
      return res.status(200).json(global.takayaFilmsStore.videos);
    }

    // 動画作成
    if ((url === '/api/videos' || url === '/api/simple-videos' || url === '/api/kv/videos') && method === 'POST') {
      console.log('[API] Creating video');
      const newVideo = {
        id: global.takayaFilmsStore.videoIdCounter++,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      global.takayaFilmsStore.videos.push(newVideo);
      return res.status(201).json(newVideo);
    }

    // 動画更新
    if (url.match(/\/api\/(videos|simple-videos|kv\/videos)\/(\d+)/) && method === 'PUT') {
      const videoId = parseInt(url.match(/\/(\d+)$/)?.[1] || '0');
      console.log('[API] Updating video:', videoId);
      const index = global.takayaFilmsStore.videos.findIndex(v => v.id === videoId);
      if (index !== -1) {
        global.takayaFilmsStore.videos[index] = {
          ...global.takayaFilmsStore.videos[index],
          ...req.body,
          updated_at: new Date().toISOString()
        };
        return res.status(200).json(global.takayaFilmsStore.videos[index]);
      }
      return res.status(404).json({ error: 'Video not found' });
    }

    // 動画削除
    if (url.match(/\/api\/(videos|simple-videos|kv\/videos)\/(\d+)/) && method === 'DELETE') {
      const videoId = parseInt(url.match(/\/(\d+)$/)?.[1] || '0');
      console.log('[API] Deleting video:', videoId);
      const index = global.takayaFilmsStore.videos.findIndex(v => v.id === videoId);
      if (index !== -1) {
        global.takayaFilmsStore.videos.splice(index, 1);
        return res.status(200).json({ message: 'Video deleted successfully' });
      }
      return res.status(404).json({ error: 'Video not found' });
    }

    // ログイン
    if (url === '/api/auth/login' && method === 'POST') {
      console.log('[API] Login attempt');
      const { username, password } = req.body;
      if (username === 'admin' && password === 'admin123') {
        return res.status(200).json({
          message: 'Login successful',
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@takayafilms.com',
            role: 'admin'
          }
        });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 認証確認
    if (url === '/api/auth/verify' && method === 'GET') {
      return res.status(200).json({ 
        valid: true, 
        user: { id: 1, username: 'admin', role: 'admin' } 
      });
    }

    // 404
    console.log('[API] 404 Not Found:', url);
    return res.status(404).json({ error: 'Not found', url, method });

  } catch (error) {
    console.error('[API] Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};