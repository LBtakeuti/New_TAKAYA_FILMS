// Mock storage for development when Supabase is not configured

let profile = null;
let nextProfileId = 1;

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