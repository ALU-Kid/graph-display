// diagnostic.js - System diagnostic script

console.log('🔍 GitGraph Animator Diagnostic');
console.log('================================\n');

// Check Node version
console.log('Node.js version:', process.version);

// Check file structure
const fs = require('fs');
const requiredDirs = ['data', 'services', 'utils', 'views', 'public'];
const requiredFiles = [
  'server.js',
  'services/messageGenerator.js', 
  'data/message-history.json',
  'data/last-generation.json',
  'data/font-data.json',
  '.env'
];

console.log('📁 Directory structure:');
requiredDirs.forEach(function(dir) {
  console.log('  ' + (fs.existsSync(dir) ? '✅' : '❌') + ' ' + dir);
});

console.log('\n📄 Required files:');
requiredFiles.forEach(function(file) {
  console.log('  ' + (fs.existsSync(file) ? '✅' : '❌') + ' ' + file);
});

// Check environment variables
console.log('\n🔑 Environment variables:');
require('dotenv').config();
const envVars = [
  'OPENWEATHER_API_KEY',
  'WEATHER_CITY', 
  'AIRTABLE_API_KEY',
  'GITHUB_TOKEN',
  'OPENAI_API_KEY'
];

envVars.forEach(function(varName) {
  const value = process.env[varName];
  const status = value && value !== 'your_' + varName.toLowerCase() + '_here' ? '✅' : '❌';
  console.log('  ' + status + ' ' + varName + ': ' + (value ? '[SET]' : '[MISSING]'));
});

// Test message generator
console.log('\n🤖 Testing message generator:');
try {
  const SmartMessageGenerator = require('./services/messageGenerator');
  const generator = new SmartMessageGenerator();
  const testMessages = generator.generateMessages(
    { condition: 'Clear', temp: 20 },
    { kwhCharged: 50, sessions: 15 },
    2
  );
  console.log('  ✅ Generated test messages:', testMessages);
} catch (error) {
  console.log('  ❌ Generator error:', error.message);
}

console.log('\n✨ Diagnostic complete!');
