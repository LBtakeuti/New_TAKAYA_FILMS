// Test script for API routes
const { NextRequest, NextResponse } = require('next/server');

async function testAPIs() {
  console.log('Testing API Routes...\n');
  
  // Test GET /api/videos
  console.log('1. Testing GET /api/videos');
  try {
    const videosRoute = require('./app/api/videos/route');
    const req = new NextRequest('http://localhost:3000/api/videos');
    const res = await videosRoute.GET(req);
    const data = await res.json();
    console.log('✓ GET /api/videos:', data);
  } catch (error) {
    console.error('✗ GET /api/videos failed:', error.message);
  }
  
  // Test POST /api/videos
  console.log('\n2. Testing POST /api/videos');
  try {
    const videosRoute = require('./app/api/videos/route');
    const body = JSON.stringify({
      title: 'Test Video',
      description: 'Test Description',
      youtube_url: 'https://youtube.com/watch?v=test',
      category: 'test'
    });
    const req = new NextRequest('http://localhost:3000/api/videos', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const res = await videosRoute.POST(req);
    const data = await res.json();
    console.log('✓ POST /api/videos:', data);
  } catch (error) {
    console.error('✗ POST /api/videos failed:', error.message);
  }
  
  // Test GET /api/profile
  console.log('\n3. Testing GET /api/profile');
  try {
    const profileRoute = require('./app/api/profile/route');
    const req = new NextRequest('http://localhost:3000/api/profile');
    const res = await profileRoute.GET(req);
    const data = await res.json();
    console.log('✓ GET /api/profile:', data);
  } catch (error) {
    console.error('✗ GET /api/profile failed:', error.message);
  }
  
  // Test POST /api/contact
  console.log('\n4. Testing POST /api/contact');
  try {
    const contactRoute = require('./app/api/contact/route');
    const body = JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message content'
    });
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const res = await contactRoute.POST(req);
    const data = await res.json();
    console.log('✓ POST /api/contact:', data);
  } catch (error) {
    console.error('✗ POST /api/contact failed:', error.message);
  }
  
  console.log('\nAPI Route tests completed!');
}

// Run tests
testAPIs().catch(console.error);