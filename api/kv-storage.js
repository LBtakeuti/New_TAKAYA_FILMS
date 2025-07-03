// Vercel KV Storage API - 簡易実装
// 環境変数またはメモリを使用してデータを永続化

const STORAGE_KEY = 'TAKAYA_FILMS_DATA';

// デフォルトデータ
const defaultData = {
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
  videoIdCounter: 2
};

// グローバル変数でデータを保持
if (!global.takayaFilmsKVData) {
  // 環境変数から読み込み（もし存在すれば）
  if (process.env[STORAGE_KEY]) {
    try {
      global.takayaFilmsKVData = JSON.parse(process.env[STORAGE_KEY]);
    } catch (e) {
      global.takayaFilmsKVData = defaultData;
    }
  } else {
    global.takayaFilmsKVData = defaultData;
  }
}

module.exports = async (req, res) => {
  const url = req.url || '';
  const method = req.method || '';
  
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  // KV Storage API
  if (url.includes('/api/kv/get')) {
    return res.status(200).json(global.takayaFilmsKVData);
  }

  if (url.includes('/api/kv/set') && method === 'POST') {
    try {
      let body = '';
      req.setEncoding('utf8');
      for await (const chunk of req) {
        body += chunk;
      }
      const data = JSON.parse(body);
      global.takayaFilmsKVData = data;
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data' });
    }
  }

  // プロフィール更新
  if (url.includes('/api/kv/profile') && method === 'PUT') {
    try {
      let body = '';
      req.setEncoding('utf8');
      for await (const chunk of req) {
        body += chunk;
      }
      const updates = JSON.parse(body);
      global.takayaFilmsKVData.profile = {
        ...global.takayaFilmsKVData.profile,
        ...updates,
        updated_at: new Date().toISOString()
      };
      return res.status(200).json({ 
        success: true, 
        data: global.takayaFilmsKVData.profile 
      });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid data' });
    }
  }

  // 動画CRUD
  if (url.includes('/api/kv/videos')) {
    if (method === 'GET') {
      return res.status(200).json(global.takayaFilmsKVData.videos || []);
    }
    
    if (method === 'POST') {
      try {
        let body = '';
        req.setEncoding('utf8');
        for await (const chunk of req) {
          body += chunk;
        }
        const videoData = JSON.parse(body);
        const newVideo = {
          id: global.takayaFilmsKVData.videoIdCounter++,
          ...videoData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        global.takayaFilmsKVData.videos.push(newVideo);
        return res.status(201).json(newVideo);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid data' });
      }
    }
  }

  return res.status(404).json({ error: 'Not found' });
};