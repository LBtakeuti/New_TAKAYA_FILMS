const supabase = require('../lib/supabase');

// 動画一覧取得
exports.getVideos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 動画作成
exports.createVideo = async (req, res) => {
  try {
    const { title, description, youtube_url, video_url, category, client, status, featured, sort_order } = req.body;
    
    console.log('Creating video with data:', req.body);
    
    if (!title) {
      return res.status(400).json({ error: 'タイトルは必須です' });
    }
    
    const insertData = {
      title,
      description: description || '',
      video_url: youtube_url || video_url || '',
      thumbnail_url: '',
      category: category || '',
      client: client || '',
      status: status || 'published',
      featured: featured || false,
      sort_order: sort_order || 0
    };
    
    console.log('Inserting data:', insertData);
    
    const { data, error } = await supabase
      .from('videos')
      .insert([insertData])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: error.message,
        details: error.details || 'データベースエラーが発生しました'
      });
    }
    
    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'データの保存に失敗しました' });
    }
    
    res.json({ id: data[0].id, message: 'Video created successfully', data: data[0] });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'サーバーエラーが発生しました' });
  }
};

// 動画更新
exports.updateVideo = async (req, res) => {
  try {
    const videoId = req.url.split('/')[3]; // /api/videos/:id から id を抽出
    const { title, description, youtube_url, video_url, category, client, status, featured, sort_order } = req.body;
    
    const updateData = {
      title,
      description,
      video_url: youtube_url || video_url || '',
      category: category || '',
      client: client || '',
      status: status || 'published',
      featured: featured || false,
      sort_order: sort_order || 0
    };

    const { data, error } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', videoId)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ message: 'Video updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 動画削除
exports.deleteVideo = async (req, res) => {
  try {
    const videoId = req.url.split('/')[3]; // /api/videos/:id から id を抽出
    
    const { data, error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ルートハンドラー
module.exports = async (req, res) => {
  const { url, method } = req;
  
  // リクエストボディをパース
  if (method === 'POST' || method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    return new Promise((resolve) => {
      req.on('end', () => {
        try {
          req.body = JSON.parse(body);
        } catch (e) {
          console.error('JSON parse error:', e);
          req.body = {};
        }
        
        if (url === '/api/videos' && method === 'POST') {
          resolve(exports.createVideo(req, res));
        } else if (url.startsWith('/api/videos/') && method === 'PUT') {
          resolve(exports.updateVideo(req, res));
        }
      });
    });
  }
  
  if (url === '/api/videos' && method === 'GET') {
    return exports.getVideos(req, res);
  }
  
  if (url.startsWith('/api/videos/') && method === 'DELETE') {
    return exports.deleteVideo(req, res);
  }
  
  res.status(404).json({ error: 'Video route not found' });
};