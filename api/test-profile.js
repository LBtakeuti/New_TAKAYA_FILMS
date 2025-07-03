// テスト用のシンプルなプロフィール更新エンドポイント
module.exports = async (req, res) => {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // リクエストボディを確認
    console.log('Test endpoint - Request body:', req.body);
    
    // 成功レスポンスを返す
    res.status(200).json({ 
      message: 'Profile updated successfully (test mode)',
      receivedData: req.body
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test endpoint error' });
  }
};