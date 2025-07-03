// Mock storage for development when Supabase is not configured

let videos = [];
let profile = null;
let nextVideoId = 1;
let nextProfileId = 1;

const mockStorage = {
  videos: {
    getAll: () => {
      return videos;
    },
    
    create: (data) => {
      const newVideo = {
        id: nextVideoId++,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      videos.push(newVideo);
      return newVideo;
    },
    
    update: (id, data) => {
      const index = videos.findIndex(v => v.id == id);
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
      const index = videos.findIndex(v => v.id == id);
      if (index !== -1) {
        const deleted = videos[index];
        videos.splice(index, 1);
        return deleted;
      }
      return null;
    }
  },
  
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