// Mock storage for videos when Supabase is not configured
let videos = [];
let videoIdCounter = 1;

const mockStorage = {
  videos: {
    getAll: () => videos,
    
    create: (data) => {
      const newVideo = {
        id: videoIdCounter++,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      videos.push(newVideo);
      return newVideo;
    },
    
    update: (id, data) => {
      const index = videos.findIndex(v => v.id === parseInt(id));
      if (index !== -1) {
        videos[index] = {
          ...videos[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        return videos[index];
      }
      return null;
    },
    
    delete: (id) => {
      const index = videos.findIndex(v => v.id === parseInt(id));
      if (index !== -1) {
        const deleted = videos[index];
        videos.splice(index, 1);
        return deleted;
      }
      return null;
    }
  },
  
  profile: {
    data: {
      id: 1,
      name: 'TAKAYA FILMS',
      title: 'Film Director',
      bio: 'Professional videographer specializing in commercials, music videos, and documentaries.',
      email: 'contact@takayafilms.com',
      phone: '',
      location: 'Tokyo, Japan',
      website: '',
      social_links: {
        instagram: 'https://instagram.com/takayafilms',
        youtube: '',
        vimeo: '',
        linkedin: '',
        twitter: ''
      },
      skills: ['Video Production', 'Directing', 'Editing', 'Color Grading'],
      services: ['Commercial Production', 'Music Video', 'Documentary', 'Corporate Video'],
      updated_at: new Date().toISOString()
    },
    
    get: () => mockStorage.profile.data,
    
    update: (data) => {
      mockStorage.profile.data = {
        ...mockStorage.profile.data,
        ...data,
        updated_at: new Date().toISOString()
      };
      return mockStorage.profile.data;
    },
    
    create: (data) => {
      mockStorage.profile.data = {
        id: 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockStorage.profile.data;
    }
  }
};

module.exports = mockStorage;