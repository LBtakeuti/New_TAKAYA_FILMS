// メモリベースのストレージ（Vercel対応）
// Vercelのサーバーレス環境でも動作する実装

// グローバル変数でデータを保持（Vercelのコールド・ウォーム状態に対応）
global.takayaFilmsData = global.takayaFilmsData || {
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

class MemoryStorage {
  constructor() {
    this.data = global.takayaFilmsData;
  }

  // プロフィール操作
  getProfile() {
    console.log('Getting profile:', this.data.profile);
    return this.data.profile;
  }

  updateProfile(updates) {
    console.log('Updating profile with:', updates);
    this.data.profile = {
      ...this.data.profile,
      ...updates,
      updated_at: new Date().toISOString()
    };
    global.takayaFilmsData = this.data;
    console.log('Profile updated:', this.data.profile);
    return this.data.profile;
  }

  // 動画操作
  getAllVideos() {
    console.log('Getting all videos:', this.data.videos);
    return this.data.videos || [];
  }

  createVideo(videoData) {
    const newVideo = {
      id: this.data.videoIdCounter++,
      ...videoData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.videos.push(newVideo);
    global.takayaFilmsData = this.data;
    console.log('Video created:', newVideo);
    return newVideo;
  }

  updateVideo(id, updates) {
    const index = this.data.videos.findIndex(v => v.id === parseInt(id));
    if (index !== -1) {
      this.data.videos[index] = {
        ...this.data.videos[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      global.takayaFilmsData = this.data;
      console.log('Video updated:', this.data.videos[index]);
      return this.data.videos[index];
    }
    return null;
  }

  deleteVideo(id) {
    const index = this.data.videos.findIndex(v => v.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.data.videos[index];
      this.data.videos.splice(index, 1);
      global.takayaFilmsData = this.data;
      console.log('Video deleted:', deleted);
      return deleted;
    }
    return null;
  }
}

// シングルトンインスタンス
const storage = new MemoryStorage();

module.exports = storage;