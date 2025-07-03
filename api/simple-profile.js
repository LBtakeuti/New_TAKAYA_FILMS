// シンプルなプロフィール更新エンドポイント
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

  // GETリクエスト: プロフィール取得
  if (req.method === 'GET') {
    try {
      const profile = mockStorage.profile.get();
      res.status(200).json(profile);
    } catch (error) {
      console.error('Profile GET error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
    return;
  }

  // PUTリクエスト: プロフィール更新
  if (req.method === 'PUT') {
    try {
      // リクエストボディをパース
      let body = '';
      if (req.body) {
        body = req.body;
      } else {
        // ボディが未パースの場合
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        body = JSON.parse(Buffer.concat(chunks).toString());
      }

      console.log('Updating profile with:', body);
      
      // プロフィールを更新
      const updatedProfile = mockStorage.profile.update(body);
      
      res.status(200).json({ 
        message: 'Profile updated successfully',
        data: updatedProfile 
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
    return;
  }

  // その他のメソッドは許可しない
  res.status(405).json({ error: 'Method not allowed' });
};