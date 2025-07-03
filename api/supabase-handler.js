// Supabase API Handler with fallback to in-memory storage
import { createClient } from '@supabase/supabase-js';

// Edge Function configuration
export const config = {
  runtime: 'edge',
};

// In-memory fallback storage
let fallbackStore = {
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
    skills: ['Video Production', 'Directing', 'Editing', 'Color Grading'],
    services: ['Commercial Production', 'Music Video', 'Documentary', 'Corporate Video'],
    updated_at: new Date().toISOString()
  },
  videos: []
};

// Initialize Supabase client
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}

export default async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    // Test endpoint
    if (path.includes('/test')) {
      return new Response(JSON.stringify({
        message: 'API is working!',
        supabase: !!supabase,
        timestamp: new Date().toISOString(),
      }), {
        status: 200,
        headers,
      });
    }

    // Profile endpoints
    if (path.includes('/profile')) {
      if (request.method === 'GET') {
        if (supabase) {
          const { data, error } = await supabase
            .from('profile')
            .select('*')
            .limit(1)
            .single();
          
          if (error) {
            console.error('Supabase error:', error);
            return new Response(JSON.stringify(fallbackStore.profile), {
              status: 200,
              headers,
            });
          }
          
          return new Response(JSON.stringify(data || fallbackStore.profile), {
            status: 200,
            headers,
          });
        } else {
          return new Response(JSON.stringify(fallbackStore.profile), {
            status: 200,
            headers,
          });
        }
      }

      if (request.method === 'PUT') {
        const body = await request.json();
        
        if (supabase) {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('profile')
            .select('id')
            .limit(1)
            .single();

          let result;
          if (existingProfile) {
            // Update existing profile
            result = await supabase
              .from('profile')
              .update({
                ...body,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingProfile.id)
              .select()
              .single();
          } else {
            // Create new profile
            result = await supabase
              .from('profile')
              .insert([{
                ...body,
                id: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }])
              .select()
              .single();
          }

          if (result.error) {
            console.error('Supabase update error:', result.error);
            // Fallback to in-memory
            fallbackStore.profile = {
              ...fallbackStore.profile,
              ...body,
              updated_at: new Date().toISOString()
            };
          }
        } else {
          // Use fallback storage
          fallbackStore.profile = {
            ...fallbackStore.profile,
            ...body,
            updated_at: new Date().toISOString()
          };
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Profile updated successfully',
          data: fallbackStore.profile,
        }), {
          status: 200,
          headers,
        });
      }
    }

    // Videos endpoints
    if (path.includes('/videos')) {
      if (request.method === 'GET') {
        if (supabase) {
          const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('sort_order', { ascending: true });
          
          if (error) {
            console.error('Supabase error:', error);
            return new Response(JSON.stringify(fallbackStore.videos), {
              status: 200,
              headers,
            });
          }
          
          return new Response(JSON.stringify(data || []), {
            status: 200,
            headers,
          });
        } else {
          return new Response(JSON.stringify(fallbackStore.videos), {
            status: 200,
            headers,
          });
        }
      }

      if (request.method === 'POST') {
        const body = await request.json();
        
        if (supabase) {
          const { data, error } = await supabase
            .from('videos')
            .insert([{
              ...body,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single();
          
          if (error) {
            console.error('Supabase error:', error);
          } else {
            return new Response(JSON.stringify(data), {
              status: 201,
              headers,
            });
          }
        }
        
        // Fallback
        const newVideo = {
          id: Date.now(),
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        fallbackStore.videos.push(newVideo);
        
        return new Response(JSON.stringify(newVideo), {
          status: 201,
          headers,
        });
      }
    }

    // Auth endpoints (mock for now)
    if (path.includes('/auth/login')) {
      const body = await request.json();
      if (body.username === 'admin' && body.password === 'admin123') {
        return new Response(JSON.stringify({
          message: 'Login successful',
          token: 'mock-token-' + Date.now(),
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@takayafilms.com',
            role: 'admin'
          }
        }), {
          status: 200,
          headers,
        });
      }
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers,
      });
    }

    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers,
    });

  } catch (error) {
    console.error('Handler error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message,
    }), {
      status: 500,
      headers,
    });
  }
}