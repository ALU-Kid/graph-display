// server.js - Complete Enhanced GitGraph Animator (Node 10 Compatible)

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

require('dotenv').config();

// Import our enhanced modules
const SmartMessageGenerator = require('./services/messageGenerator');
const { generateCommitPlan, generatePreviewData, validateMessage } = require('./utils/pixel-preview');

// Initialize message generator
const messageGenerator = new SmartMessageGenerator({
  maxLength: 30,
  weatherEnabled: true,
  energyEnabled: true,
  timeEnabled: true
});

// Global state
let messageQueue = [];
let currentMessage = null;
let stats = {
  kwhCharged: 0,
  sessions: 0,
  weather: { temp: 0, condition: 'Unknown', wind: 0, humidity: 0 }
};
let messageHistory = [];

const app = express();

// Handlebars setup
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    json: function(context) { return JSON.stringify(context); },
    formatDate: function(date) { return new Date(date).toLocaleDateString(); },
    eq: function(a, b) { return a === b; },
    gt: function(a, b) { return a > b; }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// File paths
const QUEUE_FILE = path.join(__dirname, 'data', 'queue.json');
const STATS_FILE = path.join(__dirname, 'data', 'stats.json');
const HISTORY_FILE = path.join(__dirname, 'data', 'message-history.json');
const GENERATION_FILE = path.join(__dirname, 'data', 'last-generation.json');
const FONT_FILE = path.join(__dirname, 'data', 'font-data.json');

// Utility Functions
async function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
    console.log('📁 Data directory ensured');
  } catch (err) {
    // Directory might already exist
  }
}

async function loadData() {
  try {
    const data = JSON.parse(await fs.readFile(QUEUE_FILE, 'utf8'));
    messageQueue = data.queue || [];
    currentMessage = data.current || null;
    console.log('📋 Loaded message queue:', messageQueue.length, 'messages');
  } catch (err) {
    messageQueue = [];
    currentMessage = null;
    console.log('📋 Starting with empty queue');
  }
  
  try {
    stats = JSON.parse(await fs.readFile(STATS_FILE, 'utf8'));
    console.log('📊 Loaded stats:', stats.kwhCharged + 'kWh,', stats.sessions, 'sessions');
  } catch (err) {
    console.log('📊 Starting with default stats');
  }
  
  try {
    messageHistory = JSON.parse(await fs.readFile(HISTORY_FILE, 'utf8'));
    console.log('📈 Loaded history:', messageHistory.length, 'messages');
  } catch (err) {
    messageHistory = [];
    console.log('📈 Starting with empty history');
  }
}

async function saveData() {
  try {
    await fs.writeFile(QUEUE_FILE, JSON.stringify({ 
      queue: messageQueue, 
      current: currentMessage,
      lastUpdated: new Date().toISOString()
    }, null, 2));
    
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
    
    await fs.writeFile(HISTORY_FILE, JSON.stringify(messageHistory, null, 2));
    
    console.log('💾 Data saved successfully');
  } catch (err) {
    console.error('❌ Error saving data:', err);
  }
}

// API Integration Functions
async function fetchWeather() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = process.env.WEATHER_CITY || 'London';
    
    if (!apiKey) {
      console.log('⚠️ No weather API key provided');
      return;
    }
    
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric';
    
    const res = await axios.get(url);
    stats.weather = {
      temp: Math.round(res.data.main.temp * 10) / 10,
      condition: res.data.weather[0].main,
      wind: Math.round(res.data.wind.speed * 10) / 10,
      humidity: res.data.main.humidity
    };
    
    await saveData();
    console.log('🌤️ Weather updated:', stats.weather.temp + '°C,', stats.weather.condition);
  } catch (err) {
    console.error('❌ Error fetching weather:', err.message);
  }
}

async function fetchAirtableData() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_TABLE_ID;
    
    if (!apiKey || !baseId || !tableId) {
      console.log('⚠️ Airtable credentials not complete');
      return;
    }
    
    const url = 'https://api.airtable.com/v0/' + baseId + '/' + tableId;
    const response = await axios.get(url, {
      headers: { Authorization: 'Bearer ' + apiKey }
    });

    let totalKwh = 0;
    let sessionCount = 0;
    
    response.data.records.forEach(function(record) {
      if (record.fields.kWh) {
        totalKwh += parseFloat(record.fields.kWh) || 0;
      }
      sessionCount++;
    });

    stats.kwhCharged = Math.round(totalKwh * 100) / 100;
    stats.sessions = sessionCount;
    await saveData();
    console.log('⚡ Airtable updated:', stats.kwhCharged + 'kWh,', stats.sessions, 'sessions');
  } catch (err) {
    console.error('❌ Error fetching Airtable data:', err.message);
  }
}

// Smart Message Generation
async function generateSmartMessages(count, forceGenerate) {
  try {
    console.log('🤖 Generating smart messages...');
    
    if (!forceGenerate) {
      const shouldGenerate = await checkShouldGenerate();
      if (!shouldGenerate) {
        console.log('⏭️ Smart generation not needed yet');
        return [];
      }
    }
    
    const messages = messageGenerator.generateMessages(
      stats.weather,
      { kwhCharged: stats.kwhCharged, sessions: stats.sessions },
      count || 3
    );
    
    console.log('✨ Generated messages:', messages);
    
    // Add to queue (avoid duplicates)
    let addedCount = 0;
    messages.forEach(function(message) {
      if (messageQueue.indexOf(message) === -1) {
        messageQueue.push(message);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      await saveData();
      await updateLastGenerationTime();
      console.log('✅ Added', addedCount, 'new messages to queue');
    }
    
    return messages;
  } catch (err) {
    console.error('❌ Error generating smart messages:', err);
    return [];
  }
}

async function generateWithChatGPT() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('ℹ️ No OpenAI API key, using smart generation instead');
      return await generateSmartMessages(5, true);
    }
    
    console.log('🧠 Generating messages with ChatGPT...');
    
    // Build context for ChatGPT
    const context = 'Current weather: ' + stats.weather.condition + ' ' + stats.weather.temp + '°C. ' +
                   'Energy data: ' + stats.kwhCharged + 'kWh charged, ' + stats.sessions + ' sessions. ' +
                   'Generate creative coding/tech messages for GitHub contribution graph.';
    
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are a creative assistant that generates short, clever messages (max 30 characters) for GitHub contribution graphs. Focus on coding/tech themes with personality. Use only A-Z, 0-9, spaces, and basic punctuation (!?.,:-+=). Make them motivational, funny, or clever.' 
        },
        { 
          role: 'user', 
          content: 'Generate 5 unique messages based on this context: ' + context + '. Each message must be 30 characters or less and suitable for a developer\'s GitHub profile.' 
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    }, {
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Parse the ChatGPT response
    const content = res.data.choices[0].message.content;
    const messages = content
      .split('\n')
      .map(function(line) {
        // Remove numbering, quotes, and extra characters
        return line.replace(/^\d+[\.\)]\s*/, '')
                  .replace(/["""]/g, '')
                  .replace(/^[-\*]\s*/, '')
                  .trim()
                  .toUpperCase();
      })
      .filter(function(message) {
        return message && 
               message.length >= 3 && 
               message.length <= 30 && 
               /^[A-Z0-9\s!?.,:\-+=()]*$/.test(message);
      })
      .slice(0, 5); // Limit to 5 messages

    console.log('🎨 ChatGPT generated:', messages);
    
    // Add to queue
    let addedCount = 0;
    messages.forEach(function(message) {
      if (messageQueue.indexOf(message) === -1) {
        messageQueue.push(message);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      await saveData();
      console.log('✅ Added', addedCount, 'AI messages to queue');
    }
    
    return messages;
  } catch (err) {
    console.error('❌ ChatGPT generation failed:', err.message);
    console.log('🔄 Falling back to smart generation...');
    return await generateSmartMessages(5, true);
  }
}

async function checkShouldGenerate() {
  try {
    const data = await fs.readFile(GENERATION_FILE, 'utf8');
    const lastGeneration = new Date(JSON.parse(data).timestamp);
    const now = new Date();
    const hoursSince = (now - lastGeneration) / (1000 * 60 * 60);
    
    return hoursSince >= 24; // Generate every 24 hours
  } catch (err) {
    return true; // If file doesn't exist, generate
  }
}

async function updateLastGenerationTime() {
  try {
    await fs.writeFile(GENERATION_FILE, JSON.stringify({
      timestamp: new Date().toISOString()
    }));
  } catch (err) {
    console.error('❌ Error updating generation time:', err);
  }
}

// Git Operations
async function commitPattern(message) {
  try {
    console.log('🎨 Creating commits for:', message);
    const plan = generateCommitPlan(message);
    
    if (!plan || plan.length === 0) {
      console.log('⚠️ No commits needed for this message');
      return false;
    }
    
    console.log('📅 Will create', plan.length, 'commit dates');
    
    // Group commits by date for efficiency
    const commitsByDate = {};
    plan.forEach(function(commit) {
      if (!commitsByDate[commit.date]) {
        commitsByDate[commit.date] = 0;
      }
      commitsByDate[commit.date] += commit.intensity;
    });
    
    // Make commits for each date
    const dates = Object.keys(commitsByDate);
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const commitCount = commitsByDate[date];
      
      for (let j = 0; j < commitCount; j++) {
        const dateStr = date + 'T' + (12 + j).toString().padStart(2, '0') + ':00:00';
        
        // Create commit content
        const commitContent = message + ' - ' + (j + 1);
        await execPromise('echo "' + commitContent + '" >> commit.log');
        await execPromise('git add commit.log');
        
        const commitCmd = 'GIT_AUTHOR_DATE="' + dateStr + '" GIT_COMMITTER_DATE="' + dateStr + '" git commit -m "' + message + '"';
        await execPromise(commitCmd);
      }
    }

    // Push to GitHub if credentials are available
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      const pushUrl = 'https://x-access-token:' + process.env.GITHUB_TOKEN + '@github.com/' + process.env.GITHUB_REPO + '.git main';
      await execPromise('git push ' + pushUrl);
      console.log('🚀 Pushed to GitHub successfully');
    } else {
      console.log('ℹ️ No GitHub credentials, commits made locally only');
    }
    
    // Add to history
    messageHistory.push({
      message: message,
      timestamp: new Date().toISOString(),
      commitCount: plan.length,
      type: 'auto',
      status: 'completed'
    });
    
    await saveData();
    return true;
  } catch (err) {
    console.error('❌ Commit failed:', err.message);
    
    // Add failed attempt to history
    messageHistory.push({
      message: message,
      timestamp: new Date().toISOString(),
      commitCount: 0,
      type: 'auto',
      status: 'failed',
      error: err.message
    });
    
    await saveData();
    return false;
  }
}

async function processQueue() {
  try {
    console.log('🔄 Processing message queue...');
    
    if (!currentMessage && messageQueue.length > 0) {
      currentMessage = messageQueue.shift();
      console.log('📝 Selected message:', currentMessage);
      await saveData();
    }

    if (currentMessage) {
      console.log('⏱️ Starting commit process for:', currentMessage);
      const success = await commitPattern(currentMessage);
      
      if (success) {
        console.log('✅ Successfully processed:', currentMessage);
        currentMessage = null;
        await saveData();
      } else {
        console.log('❌ Failed to process, will retry later:', currentMessage);
      }
    } else {
      console.log('📭 Queue is empty');
    }
  } catch (err) {
    console.error('❌ Error processing queue:', err);
  }
}

// Main Routes
app.get('/', function(req, res) {
  const recentHistory = messageHistory.slice(-10).reverse();
  const queueStatus = {
    current: currentMessage,
    pending: messageQueue.length,
    total: messageHistory.length
  };
  
  res.render('dashboard', {
    title: 'Enhanced GitGraph Animator',
    currentMessage: currentMessage,
    messageQueue: messageQueue,
    stats: stats,
    recentHistory: recentHistory,
    queueStatus: queueStatus,
    layout: 'main'
  });
});

// API Routes
app.get('/api/messages', function(req, res) {
  res.json({ 
    current: currentMessage, 
    queue: messageQueue,
    history: messageHistory.slice(-20)
  });
});

app.post('/api/messages', async function(req, res) {
  try {
    const message = (req.body.message || '').toString().trim().toUpperCase();
    const validation = validateMessage(message);
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    // Avoid duplicates
    if (messageQueue.indexOf(message) !== -1) {
      return res.status(400).json({ error: 'Message already in queue' });
    }
    
    messageQueue.push(message);
    await saveData();
    
    console.log('➕ Added message to queue:', message);
    res.json({ success: true, message: 'Message added to queue', queue: messageQueue });
  } catch (err) {
    console.error('❌ Error adding message:', err);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

app.post('/api/rotate', async function(req, res) {
  try {
    if (currentMessage) {
      messageQueue.push(currentMessage);
    }
    
    if (messageQueue.length > 0) {
      currentMessage = messageQueue.shift();
    } else {
      currentMessage = null;
    }
    
    await saveData();
    console.log('🔄 Rotated to message:', currentMessage);
    
    res.json({ 
      success: true, 
      current: currentMessage, 
      queue: messageQueue 
    });
  } catch (err) {
    console.error('❌ Error rotating messages:', err);
    res.status(500).json({ error: 'Failed to rotate messages' });
  }
});

app.get('/api/stats', function(req, res) {
  const extendedStats = {
    weather: stats.weather,
    energy: {
      kwhCharged: stats.kwhCharged,
      sessions: stats.sessions,
      efficiency: stats.sessions > 0 ? Math.round((stats.kwhCharged / stats.sessions) * 100) / 100 : 0
    },
    queue: {
      current: currentMessage,
      pending: messageQueue.length,
      totalProcessed: messageHistory.length
    },
    lastUpdated: new Date().toISOString()
  };
  
  res.json(extendedStats);
});

app.post('/api/preview', function(req, res) {
  try {
    const message = (req.body.message || '').toString().trim().toUpperCase();
    const validation = validateMessage(message);
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    const previewData = generatePreviewData(message);
    res.json({ 
      success: true, 
      message: message, 
      preview: previewData,
      estimatedCommits: previewData.commitCount
    });
  } catch (err) {
    console.error('❌ Error generating preview:', err);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

app.post('/api/generate-smart', async function(req, res) {
  try {
    const count = parseInt(req.body.count) || 5;
    const useAI = req.body.useAI === true;
    
    let messages;
    if (useAI) {
      messages = await generateWithChatGPT();
    } else {
      messages = await generateSmartMessages(count, true);
    }
    
    res.json({
      success: true,
      messages: messages,
      addedToQueue: messages.length,
      context: {
        weather: stats.weather,
        energy: { kwhCharged: stats.kwhCharged, sessions: stats.sessions },
        method: useAI ? 'ChatGPT' : 'Smart Templates'
      }
    });
  } catch (err) {
    console.error('❌ Error generating messages:', err);
    res.status(500).json({ error: 'Failed to generate messages' });
  }
});

app.post('/api/process-queue', async function(req, res) {
  try {
    await processQueue();
    res.json({ 
      success: true, 
      current: currentMessage,
      queue: messageQueue,
      message: 'Queue processed'
    });
  } catch (err) {
    console.error('❌ Error processing queue:', err);
    res.status(500).json({ error: 'Failed to process queue' });
  }
});

app.get('/api/export', function(req, res) {
  const exportData = {
    queue: messageQueue,
    currentMessage: currentMessage,
    history: messageHistory,
    stats: stats,
    exportDate: new Date().toISOString()
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=gitgraph-export.json');
  res.json(exportData);
});

// Server Startup
async function startServer() {
  try {
    await ensureDataDir();
    await loadData();
    await fetchWeather();
    await fetchAirtableData();
    
    // Schedule cron jobs
    console.log('⏰ Setting up scheduled tasks...');
    
    cron.schedule('0 */3 * * *', function() {
      console.log('🔄 Scheduled queue processing...');
      processQueue();
    });
    
    cron.schedule('0 */1 * * *', function() {
      console.log('🌤️ Updating weather...');
      fetchWeather();
    });
    
    cron.schedule('0 */6 * * *', function() {
      console.log('⚡ Updating energy data...');
      fetchAirtableData();
    });
    
    cron.schedule('0 12 * * *', function() {
      console.log('🤖 Daily smart message generation...');
      generateSmartMessages();
    });
    
    cron.schedule('0 0 * * 0', function() {
      console.log('🧠 Weekly ChatGPT generation...');
      generateWithChatGPT();
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, function() {
      console.log('\n🚀 Enhanced GitGraph Animator running!');
      console.log('📍 URL: http://localhost:' + PORT);
      console.log('📊 Queue: ' + messageQueue.length + ' messages');
      console.log('⚡ Energy: ' + stats.kwhCharged + 'kWh, ' + stats.sessions + ' sessions');
      console.log('🌤️ Weather: ' + stats.weather.temp + '°C, ' + stats.weather.condition);
      console.log('📈 History: ' + messageHistory.length + ' processed messages');
      
      if (process.env.OPENAI_API_KEY) {
        console.log('🧠 ChatGPT: Enabled');
      } else {
        console.log('🤖 Smart Generation: Template-based only');
      }
      
      console.log('\n✨ System ready!\n');
    });
    
  } catch (err) {
    console.error('💥 Startup failed:', err);
    process.exit(1);
  }
}

// Helper functions for external access
function addToQueue(message) {
  return new Promise(function(resolve, reject) {
    const validation = validateMessage(message);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }
    
    if (messageQueue.indexOf(message) !== -1) {
      reject(new Error('Message already in queue'));
      return;
    }
    
    messageQueue.push(message);
    saveData().then(resolve).catch(reject);
  });
}

// Export functions for external use
module.exports = { 
  processQueue: processQueue,
  addToQueue: addToQueue,
  generateSmartMessages: generateSmartMessages,
  generateWithChatGPT: generateWithChatGPT,
  stats: stats,
  messageQueue: messageQueue
};

// Start the server
startServer();