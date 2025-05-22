// server.js - Enhanced GitGraph Animator with Professional SVG Animation

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
const { createAnimatedContributionGraph, GITHUB_COLORS } = require('./utils/enhanced-svg-generator');
const { generateCommitPlan, generatePreviewData, validateMessage, messageToPixels } = require('./utils/pixel-preview');

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

// Utility Functions
async function ensureDataDir() {
  var dataDir = path.join(__dirname, 'data');
  var outputDir = path.join(__dirname, 'output');
  var historyDir = path.join(__dirname, 'output', 'history');
  
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(historyDir, { recursive: true });
    console.log('📁 Data and output directories ensured');
  } catch (err) {
    // Directories might already exist
  }
}

async function loadData() {
  try {
    var data = JSON.parse(await fs.readFile(QUEUE_FILE, 'utf8'));
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
    var apiKey = process.env.OPENWEATHER_API_KEY;
    var city = process.env.WEATHER_CITY || 'London';
    
    if (!apiKey) {
      console.log('⚠️ No weather API key provided');
      return;
    }
    
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric';
    
    var res = await axios.get(url);
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
    var apiKey = process.env.AIRTABLE_API_KEY;
    var baseId = process.env.AIRTABLE_BASE_ID;
    var tableId = process.env.AIRTABLE_TABLE_ID;
    
    if (!apiKey || !baseId || !tableId) {
      console.log('⚠️ Airtable credentials not complete');
      return;
    }
    
    var url = 'https://api.airtable.com/v0/' + baseId + '/' + tableId;
    var response = await axios.get(url, {
      headers: { Authorization: 'Bearer ' + apiKey }
    });

    var totalKwh = 0;
    var sessionCount = 0;
    
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

// Enhanced SVG Animation Functions
async function renderSVG(message, options) {
  try {
    console.log('🎨 Rendering enhanced animated SVG for:', message);
    
    // Use the enhanced generator with professional styling
    var svg = createAnimatedContributionGraph({
      title: 'GitGraph Animator',
      message: message || 'GITGRAPH',
      theme: options && options.darkMode === false ? 'light' : 'dark',
      animationType: options && options.animationType || 'wave',
      animationDuration: options && options.animationDuration || 2,
      scrollingEnabled: true,
      scrollSpeed: options && options.scrollSpeed || 15,
      showStats: true,
      stats: stats
    });
    
    // Save main SVG file
    var outPath = path.join(__dirname, 'output', 'contribution-preview.svg');
    await fs.writeFile(outPath, svg, 'utf8');
    
    // Save timestamped version for history
    try {
      var timestamp = Date.now();
      var cleanMessage = message.replace(/[^A-Z0-9]/g, '_');
      var historyFilename = cleanMessage + '_' + timestamp + '.svg';
      var historyPath = path.join(__dirname, 'output', 'history', historyFilename);
      await fs.writeFile(historyPath, svg, 'utf8');
    } catch (historyErr) {
      console.log('⚠️ History save failed, but main SVG saved');
    }
    
    console.log('🖼️ Enhanced animated SVG rendered to:', outPath);
    return true;
  } catch (err) {
    console.error('❌ SVG render failed:', err.message);
    return false;
  }
}

// Smart Message Generation
async function generateSmartMessages(count, forceGenerate) {
  try {
    console.log('🤖 Generating smart messages...');
    
    if (!forceGenerate) {
      var shouldGenerate = await checkShouldGenerate();
      if (!shouldGenerate) {
        console.log('⏭️ Smart generation not needed yet');
        return [];
      }
    }
    
    var messages = messageGenerator.generateMessages(
      stats.weather,
      { kwhCharged: stats.kwhCharged, sessions: stats.sessions },
      count || 3
    );
    
    console.log('✨ Generated messages:', messages);
    
    // Add to queue (avoid duplicates)
    var addedCount = 0;
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
    var apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('ℹ️ No OpenAI API key, using smart generation instead');
      return await generateSmartMessages(5, true);
    }
    
    console.log('🧠 Generating messages with ChatGPT...');
    
    // Build context for ChatGPT
    var context = 'Current weather: ' + stats.weather.condition + ' ' + stats.weather.temp + '°C. ' +
                   'Energy data: ' + stats.kwhCharged + 'kWh charged, ' + stats.sessions + ' sessions. ' +
                   'Generate creative coding/tech messages for GitHub contribution graph.';
    
    var res = await axios.post('https://api.openai.com/v1/chat/completions', {
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
    var content = res.data.choices[0].message.content;
    var messages = content
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
    var addedCount = 0;
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
    var data = await fs.readFile(GENERATION_FILE, 'utf8');
    var lastGeneration = new Date(JSON.parse(data).timestamp);
    var now = new Date();
    var hoursSince = (now - lastGeneration) / (1000 * 60 * 60);
    
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

// Enhanced Git Operations with SVG Animation
async function commitPattern(message) {
  try {
    console.log('🎨 Processing message with SVG animation:', message);
    
    // First, render the SVG animation
    var svgSuccess = await renderSVG(message);
    
    if (!svgSuccess) {
      console.log('⚠️ SVG rendering failed, but continuing with git commits');
    }
    
    // Generate commit plan
    var plan = generateCommitPlan(message);
    
    if (!plan || plan.length === 0) {
      console.log('⚠️ No commits needed for this message');
      
      // Add to history as SVG-only
      messageHistory.push({
        message: message,
        timestamp: new Date().toISOString(),
        commitCount: 0,
        type: 'svg-only',
        status: svgSuccess ? 'svg-rendered' : 'failed',
        svgGenerated: svgSuccess
      });
      
      await saveData();
      return svgSuccess;
    }
    
    console.log('📅 Will create', plan.length, 'commit dates');
    
    // Group commits by date for efficiency
    var commitsByDate = {};
    plan.forEach(function(commit) {
      if (!commitsByDate[commit.date]) {
        commitsByDate[commit.date] = 0;
      }
      commitsByDate[commit.date] += commit.intensity;
    });
    
    // Make commits for each date (only if git credentials are available)
    var gitCommitsSuccess = false;
    
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      try {
        var dates = Object.keys(commitsByDate);
        for (var i = 0; i < dates.length; i++) {
          var date = dates[i];
          var commitCount = commitsByDate[date];
          
          for (var j = 0; j < commitCount; j++) {
            var dateStr = date + 'T' + (12 + j).toString().padStart(2, '0') + ':00:00';
            
            // Create commit content
            var commitContent = message + ' - ' + (j + 1);
            await execPromise('echo "' + commitContent + '" >> commit.log');
            await execPromise('git add commit.log');
            
            var commitCmd = 'GIT_AUTHOR_DATE="' + dateStr + '" GIT_COMMITTER_DATE="' + dateStr + '" git commit -m "' + message + '"';
            await execPromise(commitCmd);
          }
        }

        // Push to GitHub
        var pushUrl = 'https://x-access-token:' + process.env.GITHUB_TOKEN + '@github.com/' + process.env.GITHUB_REPO + '.git main';
        await execPromise('git push ' + pushUrl);
        console.log('🚀 Pushed to GitHub successfully');
        gitCommitsSuccess = true;
      } catch (gitErr) {
        console.error('❌ Git operations failed:', gitErr.message);
      }
    } else {
      console.log('ℹ️ No GitHub credentials, SVG-only mode');
    }
    
    // Add to history
    messageHistory.push({
      message: message,
      timestamp: new Date().toISOString(),
      commitCount: gitCommitsSuccess ? plan.length : 0,
      type: 'auto',
      status: (svgSuccess && (gitCommitsSuccess || !process.env.GITHUB_TOKEN)) ? 'completed' : 'partial',
      svgGenerated: svgSuccess,
      gitCommitted: gitCommitsSuccess
    });
    
    await saveData();
    return svgSuccess || gitCommitsSuccess;
  } catch (err) {
    console.error('❌ Pattern processing failed:', err.message);
    
    // Add failed attempt to history
    messageHistory.push({
      message: message,
      timestamp: new Date().toISOString(),
      commitCount: 0,
      type: 'auto',
      status: 'failed',
      error: err.message,
      svgGenerated: false,
      gitCommitted: false
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
      console.log('⏱️ Starting processing for:', currentMessage);
      var success = await commitPattern(currentMessage);
      
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
  var recentHistory = messageHistory.slice(-10).reverse();
  var queueStatus = {
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

// Enhanced SVG Route - Serves the animated SVG with proper headers
app.get('/svg', async function(req, res) {
  try {
    // Get current message or use default
    var message = currentMessage || 'WELCOME TO GITGRAPH';
    
    // Generate SVG with enhanced styling
    var svg = createAnimatedContributionGraph({
      title: 'GitGraph Animator',
      message: message,
      theme: req.query.theme || 'dark',
      animationType: req.query.animation || 'wave',
      animationDuration: 2,
      scrollingEnabled: true,
      scrollSpeed: 15,
      showStats: true,
      stats: stats
    });
    
    // Set proper headers for embedding
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Send the SVG
    res.send(svg);
    
    // Save to file for reference
    var svgPath = path.join(__dirname, 'output', 'contribution-preview.svg');
    await fs.writeFile(svgPath, svg, 'utf8');
    
  } catch (err) {
    console.error('❌ Error serving SVG:', err.message);
    
    // Generate a fallback SVG
    var fallbackSVG = createAnimatedContributionGraph({
      message: 'ERROR LOADING',
      theme: 'dark',
      showStats: false
    });
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(fallbackSVG);
  }
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
    var message = (req.body.message || '').toString().trim().toUpperCase();
    var validation = validateMessage(message);
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    // Avoid duplicates
    if (messageQueue.indexOf(message) !== -1) {
      return res.status(400).json({ error: 'Message already in queue' });
    }
    
    messageQueue.push(message);
    await saveData();
    
    // Auto-process the queue
    await processQueue();
    
    console.log('➕ Added message to queue:', message);
    res.json({ success: true, message: 'Message added to queue and processed', queue: messageQueue });
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
  var extendedStats = {
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
    svg: {
      available: true,
      url: '/svg',
      embedUrl: req.protocol + '://' + req.get('host') + '/svg'
    },
    lastUpdated: new Date().toISOString()
  };
  
  res.json(extendedStats);
});

app.post('/api/preview', async function(req, res) {
  try {
    var message = (req.body.message || '').toString().trim().toUpperCase();
    var validation = validateMessage(message);
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    var previewData = generatePreviewData(message);
    
    // Generate preview SVG
    var previewSvg = createAnimatedContributionGraph({
      message: message,
      theme: req.body.theme || 'dark',
      animationType: 'fade',
      showStats: false
    });
    
    res.json({ 
      success: true, 
      message: message, 
      preview: previewData,
      estimatedCommits: previewData.commitCount,
      svgPreview: previewSvg
    });
  } catch (err) {
    console.error('❌ Error generating preview:', err);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

app.post('/api/generate-smart', async function(req, res) {
  try {
    var count = parseInt(req.body.count) || 5;
    var useAI = req.body.useAI === true;
    
    var messages;
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

// New API route to manually trigger SVG generation
app.post('/api/generate-svg', async function(req, res) {
  try {
    var message = req.body.message || currentMessage;
    if (!message) {
      return res.status(400).json({ error: 'No message provided or in queue' });
    }
    
    var success = await renderSVG(message, req.body.options);
    
    res.json({
      success: success,
      message: message,
      svgUrl: '/svg',
      embedUrl: req.protocol + '://' + req.get('host') + '/svg',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Error generating SVG:', err);
    res.status(500).json({ error: 'Failed to generate SVG' });
  }
});

app.get('/api/export', function(req, res) {
  var exportData = {
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
    
    // Process any existing queue items on startup and generate initial SVG
    await processQueue();
    
    // If no SVG exists, create a welcome one
    try {
      await fs.access(path.join(__dirname, 'output', 'contribution-preview.svg'));
    } catch (err) {
      console.log('🎨 Creating initial welcome SVG...');
      await renderSVG('WELCOME TO GITGRAPH');
    }
    
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

    var PORT = process.env.PORT || 3001;
    app.listen(PORT, function() {
      console.log('\n🚀 Enhanced GitGraph Animator running!');
      console.log('📍 Dashboard: http://localhost:' + PORT);
      console.log('🖼️ SVG Endpoint: http://localhost:' + PORT + '/svg');
      console.log('📊 Queue: ' + messageQueue.length + ' messages');
      console.log('⚡ Energy: ' + stats.kwhCharged + 'kWh, ' + stats.sessions + ' sessions');
      console.log('🌤️ Weather: ' + stats.weather.temp + '°C, ' + stats.weather.condition);
      console.log('📈 History: ' + messageHistory.length + ' processed messages');
      
      if (process.env.OPENAI_API_KEY) {
        console.log('🧠 ChatGPT: Enabled');
      } else {
        console.log('🤖 Smart Generation: Template-based only');
      }
      
      if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
        console.log('🔗 Git Mode: Full (SVG + GitHub commits)');
      } else {
        console.log('🎨 SVG Mode: Animation only (no git commits)');
      }
      
      console.log('\n✨ System ready! Add messages via the web interface or API');
      console.log('🎯 Your SVG URL for README: ![Contribution Preview](http://localhost:' + PORT + '/svg)\n');
    });
    
  } catch (err) {
    console.error('💥 Startup failed:', err);
    process.exit(1);
  }
}

// Helper functions for external access
function addToQueue(message) {
  return new Promise(function(resolve, reject) {
    var validation = validateMessage(message);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }
    
    if (messageQueue.indexOf(message) !== -1) {
      reject(new Error('Message already in queue'));
      return;
    }
    
    messageQueue.push(message);
    saveData()
      .then(function() {
        return processQueue();
      })
      .then(resolve)
      .catch(reject);
  });
}

// Export functions for external use
module.exports = { 
  processQueue: processQueue,
  addToQueue: addToQueue,
  generateSmartMessages: generateSmartMessages,
  generateWithChatGPT: generateWithChatGPT,
  renderSVG: renderSVG,
  stats: stats,
  messageQueue: messageQueue
};

// Start the server
startServer();