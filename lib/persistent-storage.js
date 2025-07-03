// 永続的なストレージ実装（メモリベース + ローカルストレージ風）
const fs = require('fs');
const path = require('path');

// データファイルのパス（Vercelでは/tmpディレクトリを使用）
const dataFilePath = process.env.VERCEL ? '/tmp/takaya-films-data.json' : path.join(__dirname, 'data.json');

class PersistentStorage {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(rawData);
      }
    } catch (error) {
      console.log('Creating new data store');
    }

    // デフォルトデータ
    return {
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
      videos: [],
      videoIdCounter: 1
    };
  }

  saveData() {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(this.data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  // プロフィール操作
  getProfile() {
    return this.data.profile;
  }

  updateProfile(updates) {
    this.data.profile = {
      ...this.data.profile,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveData();
    return this.data.profile;
  }

  // 動画操作
  getAllVideos() {
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
    this.saveData();
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
      this.saveData();
      return this.data.videos[index];
    }
    return null;
  }

  deleteVideo(id) {
    const index = this.data.videos.findIndex(v => v.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.data.videos[index];
      this.data.videos.splice(index, 1);
      this.saveData();
      return deleted;
    }
    return null;
  }
}

// シングルトンインスタンス
const storage = new PersistentStorage();

module.exports = storage;