// setup.js - Complete initialization script for Node 10

const fs = require('fs');
const path = require('path');

console.log('🚀 Initializing Enhanced GitGraph Animator for Node 10...\n');

// Ensure all directories exist
const directories = [
  'data',
  'services', 
  'utils',
  'views',
  'views/layouts',
  'public',
  'public/js',
  'public/css'
];

directories.forEach(function(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('📁 Created directory:', dir);
  }
});

// Initialize data files
console.log('\n📊 Initializing data files...');

// 1. message-history.json
const messageHistory = [
  {
    message: "SYSTEM INITIALIZED",
    timestamp: new Date().toISOString(),
    commitCount: 0,
    type: "system",
    status: "completed",
    duration: 0,
    weather: {
      condition: "Unknown",
      temp: 0
    },
    energy: {
      kwhCharged: 0,
      sessions: 0
    }
  }
];

fs.writeFileSync('data/message-history.json', JSON.stringify(messageHistory, null, 2));
console.log('✅ Created: data/message-history.json');

// 2. last-generation.json
const lastGeneration = {
  timestamp: new Date().toISOString(),
  method: "initialization",
  messagesGenerated: 0,
  context: {
    weather: {
      condition: "Unknown",
      temp: 0
    },
    energy: {
      kwhCharged: 0,
      sessions: 0
    }
  }
};

fs.writeFileSync('data/last-generation.json', JSON.stringify(lastGeneration, null, 2));
console.log('✅ Created: data/last-generation.json');

// 3. font-data.json
const fontData = {
  "A": [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  "B": [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  "C": [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  "D": [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  "E": [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  "F": [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
  "G": [[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
  "H": [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  "I": [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  "J": [[1,1,1],[0,0,1],[0,0,1],[1,0,1],[0,1,0]],
  "K": [[1,0,1],[1,1,0],[1,0,0],[1,1,0],[1,0,1]],
  "L": [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  "M": [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  "N": [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  "O": [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "P": [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
  "Q": [[0,1,0],[1,0,1],[1,0,1],[1,1,1],[0,1,1]],
  "R": [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  "S": [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
  "T": [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  "U": [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "V": [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "W": [[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
  "X": [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
  "Y": [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
  "Z": [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  "0": [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "1": [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  "2": [[1,1,0],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  "3": [[1,1,0],[0,0,1],[0,1,0],[0,0,1],[1,1,0]],
  "4": [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  "5": [[1,1,1],[1,0,0],[1,1,0],[0,0,1],[1,1,0]],
  "6": [[0,1,1],[1,0,0],[1,1,0],[1,0,1],[0,1,0]],
  "7": [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
  "8": [[0,1,0],[1,0,1],[0,1,0],[1,0,1],[0,1,0]],
  "9": [[0,1,0],[1,0,1],[0,1,1],[0,0,1],[1,1,0]],
  "!": [[0,1,0],[0,1,0],[0,1,0],[0,0,0],[0,1,0]],
  "?": [[0,1,0],[1,0,1],[0,0,1],[0,1,0],[0,1,0]],
  " ": [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  ".": [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
  ",": [[0,0,0],[0,0,0],[0,0,0],[0,1,0],[1,0,0]],
  ":": [[0,0,0],[0,1,0],[0,0,0],[0,1,0],[0,0,0]],
  "-": [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
  "+": [[0,0,0],[0,1,0],[1,1,1],[0,1,0],[0,0,0]],
  "=": [[0,0,0],[1,1,1],[0,0,0],[1,1,1],[0,0,0]]
};

fs.writeFileSync('data/font-data.json', JSON.stringify(fontData, null, 2));
console.log('✅ Created: data/font-data.json');

// 4. Initialize queue.json and stats.json if they don't exist
if (!fs.existsSync('data/queue.json')) {
  const initialQueue = {
    queue: [],
    current: null,
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync('data/queue.json', JSON.stringify(initialQueue, null, 2));
  console.log('✅ Created: data/queue.json');
}

if (!fs.existsSync('data/stats.json')) {
  const initialStats = {
    kwhCharged: 0,
    sessions: 0,
    weather: {
      temp: 0,
      condition: 'Unknown',
      wind: 0,
      humidity: 50
    },
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync('data/stats.json', JSON.stringify(initialStats, null, 2));
  console.log('✅ Created: data/stats.json');
}

// 5. Create .env template if it doesn't exist
if (!fs.existsSync('.env')) {
  const envTemplate = `# === Required API Keys ===
OPENWEATHER_API_KEY=your_openweather_api_key_here
WEATHER_CITY=Kigali
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_TABLE_ID=your_airtable_table_id_here
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_REPO=your_username/your_repository_name

# === Optional (for AI features) ===
OPENAI_API_KEY=your_openai_api_key_here

# === Server Configuration ===
PORT=3000
NODE_ENV=production`;

  fs.writeFileSync('.env', envTemplate);
  console.log('✅ Created: .env template');
}

// 6. Create main layout if it doesn't exist
if (!fs.existsSync('views/layouts/main.handlebars')) {
  const layoutTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>">
</head>
<body>
  {{{body}}}
</body>
</html>`;

  fs.writeFileSync('views/layouts/main.handlebars', layoutTemplate);
  console.log('✅ Created: views/layouts/main.handlebars');
}

// 7. Create basic CSS file
if (!fs.existsSync('public/css/style.css')) {
  const basicCSS = `/* Additional styles for GitGraph Animator */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}`;

  fs.writeFileSync('public/css/style.css', basicCSS);
  console.log('✅ Created: public/css/style.css');
}

// Test function to verify setup
function testSetup() {
  console.log('\n🧪 Testing setup...');
  
  const requiredFiles = [
    'data/message-history.json',
    'data/last-generation.json', 
    'data/font-data.json',
    'data/queue.json',
    'data/stats.json',
    'views/layouts/main.handlebars',
    '.env'
  ];
  
  let allGood = true;
  
  requiredFiles.forEach(function(file) {
    if (fs.existsSync(file)) {
      console.log('✅', file);
    } else {
      console.log('❌', file);
      allGood = false;
    }
  });
  
  if (allGood) {
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Edit .env file with your API keys');
    console.log('2. Run: npm install');
    console.log('3. Run: npm start');
    console.log('4. Visit: http://localhost:3000');
  } else {
    console.log('\n❌ Setup incomplete. Please check the errors above.');
  }
}

// Create a test script for message generation
const testScript = `// test-generation.js - Test message generation

const SmartMessageGenerator = require('./services/messageGenerator');

console.log('🧪 Testing Smart Message Generation...');

const generator = new SmartMessageGenerator({
  maxLength: 30,
  weatherEnabled: true,
  energyEnabled: true
});

// Test different scenarios
const scenarios = [
  {
    name: 'Sunny Day + High Energy',
    weather: { condition: 'Clear', temp: 25, wind: 5, humidity: 60 },
    energy: { kwhCharged: 250, sessions: 80 }
  },
  {
    name: 'Rainy Day + Low Energy', 
    weather: { condition: 'Rain', temp: 15, wind: 12, humidity: 85 },
    energy: { kwhCharged: 15, sessions: 5 }
  },
  {
    name: 'Winter + Medium Energy',
    weather: { condition: 'Snow', temp: -2, wind: 8, humidity: 70 },
    energy: { kwhCharged: 100, sessions: 30 }
  }
];

scenarios.forEach(function(scenario) {
  console.log('\\n' + scenario.name + ':');
  const messages = generator.generateMessages(scenario.weather, scenario.energy, 3);
  messages.forEach(function(msg, i) {
    console.log('  ' + (i + 1) + '. ' + msg);
  });
  
  const context = generator.getContextSummary(scenario.weather, scenario.energy);
  console.log('  Context: ' + context);
});

console.log('\\n✅ Message generation test complete!');
`;

fs.writeFileSync('test-generation.js', testScript);
console.log('✅ Created: test-generation.js');

// Create a simple diagnostic script
const diagnosticScript = `// diagnostic.js - System diagnostic script

console.log('🔍 GitGraph Animator Diagnostic');
console.log('================================\\n');

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

console.log('\\n📄 Required files:');
requiredFiles.forEach(function(file) {
  console.log('  ' + (fs.existsSync(file) ? '✅' : '❌') + ' ' + file);
});

// Check environment variables
console.log('\\n🔑 Environment variables:');
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
console.log('\\n🤖 Testing message generator:');
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

console.log('\\n✨ Diagnostic complete!');
`;

fs.writeFileSync('diagnostic.js', diagnosticScript);
console.log('✅ Created: diagnostic.js');

// Run the test
testSetup();

console.log('\n🛠️ Additional utilities created:');
console.log('• test-generation.js - Test message generation');
console.log('• diagnostic.js - System diagnostic');
console.log('\nRun these with:');
console.log('  node test-generation.js');
console.log('  node diagnostic.js');