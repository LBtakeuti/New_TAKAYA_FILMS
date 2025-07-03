const supabase = require('../lib/supabase');

// プロフィール取得（公開）
exports.getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// プロフィール更新
exports.updateProfile = async (req, res) => {
  try {
    console.log('Profile update request received:', req.body);
    const {
      name,
      title,
      bio,
      email,
      phone,
      location,
      website,
      social_links,
      skills,
      services,
      instagram_url
    } = req.body;

    // 既存のプロフィールデータを取得
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profile')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();

    if (currentProfile) {
      // 既存プロフィールの更新
      const updateData = {
          name,
          title,
          bio,
          email,
          phone,
          location,
          website,
          social_links,
          skills,
          services,
          instagram_url,
          updated_at: new Date().toISOString()
        };

      console.log('Updating profile with data:', updateData);

      const { data, error } = await supabase
        .from('profile')
        .update(updateData)
        .eq('id', currentProfile.id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        return res.status(500).json({ error: error.message });
      }
      
      console.log('Profile updated successfully:', data);
      res.json({ message: 'Profile updated successfully', data: data[0] });
    } else {
      // 新規プロフィール作成
      const { data, error } = await supabase
        .from('profile')
        .insert([{
          name,
          title,
          bio,
          email,
          phone,
          location,
          website,
          social_links,
          skills,
          services,
          instagram_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: error.message });
      }
      
      console.log('Profile created successfully:', data);
      res.status(201).json({
        id: data[0].id,
        message: 'Profile created successfully',
        data: data[0]
      });
    }
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};