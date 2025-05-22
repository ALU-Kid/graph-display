// debug-queue.js - Run this to check your queue system

const fs = require('fs').promises;
const path = require('path');

async function debugQueue() {
  console.log('🔍 Debugging GitGraph Queue System...\n');
  
  // Check data directory
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
    console.log('✅ Data directory exists');
  } catch (err) {
    console.log('❌ Data directory missing - creating it...');
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  // Check queue file
  const queueFile = path.join(dataDir, 'queue.json');
  try {
    const data = await fs.readFile(queueFile, 'utf8');
    const queue = JSON.parse(data);
    console.log('✅ Queue file exists');
    console.log('📋 Current queue:', queue.queue || []);
    console.log('🎯 Current message:', queue.current || 'None');
  } catch (err) {
    console.log('❌ Queue file missing or corrupted - creating new one...');
    const defaultQueue = {
      queue: [],
      current: null,
      lastUpdated: new Date().toISOString()
    };
    await fs.writeFile(queueFile, JSON.stringify(defaultQueue, null, 2));
  }
  
  // Test message validation
  console.log('\n🧪 Testing message validation...');
  const { validateMessage } = require('./utils/pixel-preview');
  
  const testMessages = [
    'HELLO WORLD',
    'TEST 123',
    'TOO LONG MESSAGE THAT EXCEEDS THE THIRTY CHARACTER LIMIT',
    'SPECIAL @#$%',
    ''
  ];
  
  testMessages.forEach(msg => {
    const result = validateMessage(msg);
    console.log(`Message: "${msg}" - ${result.valid ? '✅ Valid' : '❌ Invalid: ' + result.error}`);
  });
  
  // Check API endpoints
  console.log('\n🌐 Testing API endpoints...');
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  // Simple test endpoint
  app.post('/test/message', (req, res) => {
    console.log('Received:', req.body);
    res.json({ success: true, received: req.body });
  });
  
  const testServer = app.listen(3002, () => {
    console.log('✅ Test server running on port 3002');
    
    // Make test request
    const http = require('http');
    const testData = JSON.stringify({ message: 'TEST MESSAGE' });
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/test/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': testData.length
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('✅ API test successful:', data);
        testServer.close();
        
        // Final recommendations
        console.log('\n📝 Recommendations:');
        console.log('1. Make sure server.js is using the fixed enhanced-svg-generator.js');
        console.log('2. Check browser console for JavaScript errors');
        console.log('3. Verify API calls are reaching the server (check Network tab)');
        console.log('4. Ensure message input is being properly captured');
        console.log('\n✨ Debug complete!');
      });
    });
    
    req.on('error', (err) => {
      console.error('❌ API test failed:', err);
      testServer.close();
    });
    
    req.write(testData);
    req.end();
  });
}

// Run the debug
debugQueue().catch(console.error);