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
    const { title, description, youtube_url, category, featured } = req.body;
    
    const { data, error } = await supabase
      .from('videos')
      .insert([{
        title,
        description,
        youtube_url,
        category,
        featured: featured || false
      }])
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ id: data[0].id, message: 'Video created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 動画更新
exports.updateVideo = async (req, res) => {
  try {
    const videoId = req.url.split('/')[3]; // /api/videos/:id から id を抽出
    const { title, description, youtube_url, category, featured } = req.body;
    
    const { data, error } = await supabase
      .from('videos')
      .update({
        title,
        description,
        youtube_url,
        category,
        featured: featured || false
      })
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
module.exports = (req, res) => {
  const { url, method } = req;
  
  if (url === '/api/videos' && method === 'GET') {
    return exports.getVideos(req, res);
  }
  
  if (url === '/api/videos' && method === 'POST') {
    return exports.createVideo(req, res);
  }
  
  if (url.startsWith('/api/videos/') && method === 'PUT') {
    return exports.updateVideo(req, res);
  }
  
  if (url.startsWith('/api/videos/') && method === 'DELETE') {
    return exports.deleteVideo(req, res);
  }
  
  res.status(404).json({ error: 'Video route not found' });
};