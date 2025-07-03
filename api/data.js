// Vercel Edge Function - 最もシンプルで確実な実装

export const config = {
  runtime: 'edge',
};

// データストア
let dataStore = {
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
  videos: [
    {
      id: 1,
      title: 'サンプル動画',
      description: 'サンプル動画の説明',
      category: 'commercial',
      youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'published',
      featured: true
    }
  ]
};

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
    // GET profile
    if (path.includes('/profile') && request.method === 'GET') {
      return new Response(JSON.stringify(dataStore.profile), {
        status: 200,
        headers,
      });
    }

    // PUT profile
    if (path.includes('/profile') && request.method === 'PUT') {
      const body = await request.json();
      dataStore.profile = {
        ...dataStore.profile,
        ...body,
        updated_at: new Date().toISOString(),
      };
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        data: dataStore.profile,
      }), {
        status: 200,
        headers,
      });
    }

    // GET videos
    if (path.includes('/videos') && request.method === 'GET') {
      return new Response(JSON.stringify(dataStore.videos), {
        status: 200,
        headers,
      });
    }

    // GET all data
    if (path.includes('/kv/get') && request.method === 'GET') {
      return new Response(JSON.stringify(dataStore), {
        status: 200,
        headers,
      });
    }

    // Test endpoint
    if (path.includes('/test')) {
      return new Response(JSON.stringify({
        message: 'API is working!',
        timestamp: new Date().toISOString(),
      }), {
        status: 200,
        headers,
      });
    }

    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers,
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message,
    }), {
      status: 500,
      headers,
    });
  }
}