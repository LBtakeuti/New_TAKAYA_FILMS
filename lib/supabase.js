import { logger } from '@/utils/logger';

const { createClient } = require('@supabase/supabase-js');
const mockStorage = require('./mock-storage');

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が設定されていない場合の警告
if (!supabaseUrl || !supabaseKey) {
  logger.warn('Supabase environment variables are not set. Using mock storage.');
  // モックデータを返すダミークライアント
  module.exports = {
    from: (table) => {
      if (table === 'profile' || table === 'profiles') {
        return {
          select: () => ({
            order: () => ({
              limit: () => ({
                single: () => Promise.resolve({ 
                  data: mockStorage.profile.get(), 
                  error: null 
                })
              })
            }),
            single: () => Promise.resolve({ 
              data: mockStorage.profile.get(), 
              error: null 
            }),
            eq: () => ({
              single: () => Promise.resolve({ 
                data: mockStorage.profile.get(), 
                error: null 
              })
            })
          }),
          update: (data) => ({
            eq: () => ({
              select: () => {
                const updated = mockStorage.profile.update(data);
                return Promise.resolve({ 
                  data: updated ? [updated] : [], 
                  error: null 
                });
              }
            })
          }),
          insert: (data) => ({
            select: () => {
              const created = mockStorage.profile.create(data[0]);
              return Promise.resolve({ 
                data: [created], 
                error: null 
              });
            }
          })
        };
      }
      return {
        select: () => Promise.resolve({ data: [], error: null })
      };
    }
  };
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  module.exports = supabase;
}