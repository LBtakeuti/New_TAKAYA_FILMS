import { logger } from '@/utils/logger';

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
      logger.log('Creating new data store');
    }

    // デフォルトデータ
    return {
      profile: {
        id: 1,
        name: 'TAKAYA FILMS',
        title: 'Film Director',
        bio: 'プロフェッショナルな映画監督として、CM、ドキュメンタリーを専門に制作しています。',
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
        skills: ['Film Production', 'Directing', 'Editing', 'Color Grading', 'Motion Graphics'],
        services: ['Commercial Production', 'Documentary', 'Corporate Films', 'Event Coverage'],
        updated_at: new Date().toISOString()
      }
    };
  }

  saveData() {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(this.data, null, 2));
      return true;
    } catch (error) {
      logger.error('Error saving data:', error);
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
}

// シングルトンインスタンス
const storage = new PersistentStorage();

module.exports = storage;