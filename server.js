// server.js - Main server file for Graph Display

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Load environment variables
require('dotenv').config();

// Initialize the queue
let messageQueue = [];
let currentMessage = null;
let stats = {
  kwhCharged: 0,
  sessions: 0,
  weather: { temp: 0, condition: 'Unknown', wind: 0, humidity: 0 }
};

// Initialize Express app
const app = express();

// Configure Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    json: function (context) {
      return JSON.stringify(context);
    },
    formatDate: function (date) {
      return new Date(date).toLocaleDateString();
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Data persistence
const QUEUE_FILE = path.join(__dirname, 'data', 'queue.json');
const STATS_FILE = path.join(__dirname, 'data', 'stats.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// Load data from disk
async function loadData() {
  try {
    const queueData = await fs.readFile(QUEUE_FILE, 'utf8');
    const data = JSON.parse(queueData);
    messageQueue = data.queue || [];
    currentMessage = data.current || null;
    console.log('Loaded message queue from disk');
  } catch (err) {
    console.log('No existing queue found, starting fresh');
    messageQueue = [];
    currentMessage = null;
  }
  
  try {
    const statsData = await fs.readFile(STATS_FILE, 'utf8');
    stats = JSON.parse(statsData);
    console.log('Loaded stats from disk');
  } catch (err) {
    console.log('No existing stats found, starting fresh');
  }
}

// Save data to disk
async function saveData() {
  try {
    await fs.writeFile(QUEUE_FILE, JSON.stringify({
      queue: messageQueue,
      current: currentMessage
    }, null, 2));
    
    await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
    console.log('Saved data to disk');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// Fetch weather data
async function fetchWeather() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = process.env.WEATHER_CITY || 'London';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    stats.weather = {
      temp: response.data.main.temp,
      condition: response.data.weather[0].main,
      wind: response.data.wind.speed,
      humidity: response.data.main.humidity
    };
    
    await saveData();
    console.log('Weather updated:', stats.weather);
  } catch (err) {
    console.error('Error fetching weather:', err);
  }
}

// Fetch Airtable data
async function fetchAirtableData() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_TABLE_ID;
    
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    
    let totalKwh = 0;
    let sessionCount = 0;
    
    response.data.records.forEach(record => {
      totalKwh += record.fields.kWh || 0;
      sessionCount++;
    });
    
    stats.kwhCharged = totalKwh;
    stats.sessions = sessionCount;
    
    await saveData();
    console.log('Airtable data updated:', { kwhCharged: stats.kwhCharged, sessions: stats.sessions });
  } catch (err) {
    console.error('Error fetching Airtable data:', err);
  }
}

// Generate new quotes using OpenAI
async function generateQuotes() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates creative, short quotes suitable for display on a GitHub contribution graph. Each quote should be max 30 characters.'
          },
          {
            role: 'user',
            content: 'Generate 5 unique, creative short quotes or messages that would look good when visualized on a GitHub contribution graph. Mix of tech humor, inspirational, and fun statements. Max 30 chars each.'
          }
        ],
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract quotes from the response
    const content = response.data.choices[0].message.content;
    const quotes = content
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/"/g, '').trim())
      .filter(quote => quote.length <= 30);
    
    // Add to the queue
    messageQueue.push(...quotes);
    await saveData();
    console.log('Added new quotes to queue:', quotes);
  } catch (err) {
    console.error('Error generating quotes:', err);
  }
}

// Make git commits to draw pattern
async function commitPattern(message) {
  try {
    // This would be replaced with your actual pixel pattern generation
    // and commit scheduling logic
    console.log(`Would commit pattern for message: ${message}`);
    
    // Example of how you might make the commits
    // const pixelData = messageToPixels(message);
    // ... logic to convert pixels to commits with dates
    
    // For demo purposes:
    await execPromise('echo "test" > commit.txt');
    await execPromise('git add commit.txt');
    await execPromise(`git commit --date="2023-01-01T12:00:00" -m "Auto commit: ${message}"`);
    
    return true;
  } catch (err) {
    console.error('Error making commits:', err);
    return false;
  }
}

// Process queue and make a new commit if needed
async function processQueue() {
  try {
    if (messageQueue.length === 0 && !currentMessage) {
      console.log('No messages in queue');
      return;
    }
  
  // If no current message, take from queue
  if (!currentMessage && messageQueue.length > 0) {
    currentMessage = messageQueue.shift();
    await saveData();
  }
  
  // Commit the current message
  if (currentMessage) {
    const success = await commitPattern(currentMessage);
    if (success) {
      console.log(`Successfully committed pattern for: ${currentMessage}`);
      currentMessage = null;
      await saveData();
    }
  }
  } catch (err) {
    console.error('Error processing queue:', err);
  }
}

// Routes
app.get('/', async (req, res) => {
  res.render('dashboard', {
    title: 'GitGraph Animator',
    currentMessage,
    messageQueue,
    stats,
    layout: 'main'
  });
});

// API Routes
app.get('/api/messages', (req, res) => {
  res.json({
    current: currentMessage,
    queue: messageQueue
  });
});

app.post('/api/messages', async (req, res) => {
  const { message } = req.body;
  
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  if (message.length > 30) {
    return res.status(400).json({ error: 'Message must be 30 characters or less' });
  }
  
  messageQueue.push(message);
  await saveData();
  
  res.json({
    success: true,
    queue: messageQueue
  });
});

app.post('/api/rotate', async (req, res) => {
  if (messageQueue.length === 0) {
    return res.status(400).json({ error: 'No messages in queue' });
  }
  
  // If there's a current message, add it back to the end of the queue
  if (currentMessage) {
    messageQueue.push(currentMessage);
  }
  
  // Get the next message
  currentMessage = messageQueue.shift();
  await saveData();
  
  res.json({
    success: true,
    current: currentMessage,
    queue: messageQueue
  });
});

app.get('/api/stats', (req, res) => {
  res.json(stats);
});

app.post('/api/preview', (req, res) => {
  const { message } = req.body;
  
  // Here we would generate a pixel preview
  // This endpoint would be called by client-side JS
  // and we'd return the pixel data
  
  // For now, just send a placeholder response
  res.json({
    success: true,
    message
  });
});

// Initialize and start server
async function startServer() {
  // Ensure data directory exists
  await ensureDataDir();
  
  // Load existing data
  await loadData();
  
  // Initial data fetches
  await fetchWeather();
  await fetchAirtableData();
  
  // Schedule cron jobs
  cron.schedule('0 */3 * * *', processQueue);  // Process queue every 3 hours
  cron.schedule('0 */1 * * *', fetchWeather);  // Update weather hourly
  cron.schedule('0 */6 * * *', fetchAirtableData);  // Update Airtable data every 6 hours
  cron.schedule('0 0 * * 0', generateQuotes);  // Generate quotes weekly (Sunday at midnight)
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Start everything up
startServer().catch(err => {
  console.error('Failed to start server:', err);
});