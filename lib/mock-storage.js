// Mock storage for development when Supabase is not configured

let profile = {
  id: 1,
  name: '鳥谷部 貴哉 / Takaya Toriyabe',
  title: 'Videographer / Video Director',
  bio: `2017年より広告出版業界にてBtoB営業に従事。チームの育成やメンバーサポート、採用・新人研修など、営業活動と並行して組織づくりにも携わる。
2020年には自社のYouTubeチャンネル立ち上げに携わり、運営を通じて映像の可能性に魅了される。
2024年にフリーランスとして独立。
現在はウェディングムービーを中心に、企業PR動画、SNSコンテンツなど幅広い映像制作に取り組む。
2025年には自身のウェディング映像ブランド「Utopia Wedding」を立ち上げる。`,
  email: '',
  phone: '',
  location: '',
  website: '',
  contact: {
    email: '',
    phone: '',
    location: '',
    website: ''
  },
  social_links: {
    instagram: '',
    youtube: '',
    vimeo: '',
    linkedin: '',
    twitter: ''
  },
  skills: ['映像制作', 'ビデオディレクション', 'ウェディングムービー', '企業PR動画', 'SNSコンテンツ制作'],
  services: ['ウェディングムービー制作', '企業PR動画制作', 'SNSコンテンツ制作', '映像コンサルティング'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
let nextProfileId = 2;

const mockStorage = {
  profile: {
    get: () => {
      return profile;
    },
    
    create: (data) => {
      profile = {
        id: nextProfileId++,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return profile;
    },
    
    update: (data) => {
      if (profile) {
        profile = {
          ...profile,
          ...data,
          updated_at: new Date().toISOString()
        };
        return profile;
      }
      return null;
    }
  }
};

module.exports = mockStorage;