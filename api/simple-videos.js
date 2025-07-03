// シンプルな動画管理エンドポイント
const mockStorage = require('../lib/mock-storage');

module.exports = async (req, res) => {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GETリクエスト: 動画一覧取得
  if (req.method === 'GET') {
    try {
      const videos = mockStorage.videos.getAll();
      res.status(200).json(videos);
    } catch (error) {
      console.error('Videos GET error:', error);
      res.status(500).json({ error: 'Failed to get videos' });
    }
    return;
  }

  // POSTリクエスト: 動画追加
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (!body) {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        body = JSON.parse(Buffer.concat(chunks).toString());
      }

      const newVideo = mockStorage.videos.create(body);
      res.status(201).json(newVideo);
    } catch (error) {
      console.error('Video create error:', error);
      res.status(500).json({ error: 'Failed to create video' });
    }
    return;
  }

  // PUTリクエスト: 動画更新
  if (req.method === 'PUT') {
    try {
      const videoId = req.url.split('/').pop();
      let body = req.body;
      if (!body) {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        body = JSON.parse(Buffer.concat(chunks).toString());
      }

      const updatedVideo = mockStorage.videos.update(videoId, body);
      if (updatedVideo) {
        res.status(200).json(updatedVideo);
      } else {
        res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      console.error('Video update error:', error);
      res.status(500).json({ error: 'Failed to update video' });
    }
    return;
  }

  // DELETEリクエスト: 動画削除
  if (req.method === 'DELETE') {
    try {
      const videoId = req.url.split('/').pop();
      const deletedVideo = mockStorage.videos.delete(videoId);
      if (deletedVideo) {
        res.status(200).json({ message: 'Video deleted successfully' });
      } else {
        res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      console.error('Video delete error:', error);
      res.status(500).json({ error: 'Failed to delete video' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};