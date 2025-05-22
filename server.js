// server.js - Main server file for GitGraph Animator

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { generateCommitPlan } = require('./utils/pixel-preview');
require('dotenv').config();

let messageQueue = [];
let currentMessage = null;
let stats = {
  kwhCharged: 0,
  sessions: 0,
  weather: { temp: 0, condition: 'Unknown', wind: 0, humidity: 0 }
};

const app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    json: context => JSON.stringify(context),
    formatDate: date => new Date(date).toLocaleDateString()
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const QUEUE_FILE = path.join(__dirname, 'data', 'queue.json');
const STATS_FILE = path.join(__dirname, 'data', 'stats.json');

async function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  await fs.mkdir(dataDir, { recursive: true });
}

async function loadData() {
  try {
    const data = JSON.parse(await fs.readFile(QUEUE_FILE, 'utf8'));
    messageQueue = data.queue || [];
    currentMessage = data.current || null;
    console.log('Loaded message queue from disk');
  } catch {
    messageQueue = [];
    currentMessage = null;
  }
  try {
    stats = JSON.parse(await fs.readFile(STATS_FILE, 'utf8'));
    console.log('Loaded stats from disk');
  } catch {
    console.log('No existing stats found, starting fresh');
  }
}

async function saveData() {
  await fs.writeFile(QUEUE_FILE, JSON.stringify({ queue: messageQueue, current: currentMessage }, null, 2));
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
  console.log('Saved data to disk');
}

async function fetchWeather() {
  try {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${process.env.WEATHER_CITY}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
    stats.weather = {
      temp: res.data.main.temp,
      condition: res.data.weather[0].main,
      wind: res.data.wind.speed,
      humidity: res.data.main.humidity
    };
    await saveData();
    console.log('Weather updated:', stats.weather);
  } catch (err) {
    console.error('Error fetching weather:', err);
  }
}

async function fetchAirtableData() {
  try {
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
    });

    let totalKwh = 0, sessionCount = 0;
    response.data.records.forEach(r => {
      totalKwh += r.fields.kWh || 0;
      sessionCount++;
    });

    stats.kwhCharged = totalKwh;
    stats.sessions = sessionCount;
    await saveData();
    console.log('Airtable data updated:', { kwhCharged: totalKwh, sessions: sessionCount });
  } catch (err) {
    console.error('Error fetching Airtable data:', err);
  }
}

async function generateQuotes() {
  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Generate short, creative messages (max 30 characters) to display on a GitHub contribution graph.' },
        { role: 'user', content: 'Give me 5 cool short quotes.' }
      ],
      temperature: 0.8
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const quotes = res.data.choices[0].message.content
      .split('\n')
      .map(l => l.replace(/^\d+\.\s*/, '').trim())
      .filter(q => q && q.length <= 30);

    messageQueue.push(...quotes);
    await saveData();
    console.log('Added new quotes:', quotes);
  } catch (err) {
    console.error('Error generating quotes:', err);
  }
}

async function commitPattern(message) {
  try {
    const plan = generateCommitPlan(message);

    for (const { date, intensity } of plan) {
      for (let i = 0; i < intensity; i++) {
        const dateStr = `${date}T12:00:00`;
        await execPromise(`echo "${message}" >> commit.log`);
        await execPromise(`git add commit.log`);
        await execPromise(`GIT_AUTHOR_DATE="${dateStr}" GIT_COMMITTER_DATE="${dateStr}" git commit -m "${message}"`);
      }
    }

    await execPromise(`git push https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPO}.git main`);
    return true;
  } catch (err) {
    console.error('Commit failed:', err);
    return false;
  }
}

async function processQueue() {
  if (!currentMessage && messageQueue.length > 0) {
    currentMessage = messageQueue.shift();
    await saveData();
  }

  if (currentMessage) {
    console.log('⏱ Starting immediate commit for:', currentMessage);
    const success = await commitPattern(currentMessage);
    if (success) {
      console.log('✅ Committed pattern for:', currentMessage);
      currentMessage = null;
      await saveData();
    } else {
      console.log('❌ Commit failed, will retry later.');
    }
  }
}

  if (currentMessage) {
    const success = await commitPattern(currentMessage);
    if (success) {
      console.log('Committed pattern for:', currentMessage);
    }
  }
}

app.get('/', (req, res) => {
  res.render('dashboard', {
    title: 'GitGraph Animator',
    currentMessage,
    messageQueue,
    stats,
    layout: 'main'
  });
});

app.get('/api/messages', (req, res) => res.json({ current: currentMessage, queue: messageQueue }));

app.post('/api/messages', async (req, res) => {
  const { message } = req.body;
  if (!message || message.length > 30) return res.status(400).json({ error: 'Invalid message' });
  messageQueue.push(message);
  await saveData();
  res.json({ success: true, queue: messageQueue });
});

app.post('/api/rotate', async (req, res) => {
  if (currentMessage) messageQueue.push(currentMessage);
  currentMessage = messageQueue.shift();
  await saveData();
  res.json({ success: true, current: currentMessage, queue: messageQueue });
});

app.get('/api/stats', (req, res) => res.json(stats));

app.post('/api/preview', async (req, res) => {
  const { message } = req.body;
  try {
    const pixels = generateCommitPlan(message);
    res.json({ success: true, message, pixels });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate pixel preview' });
  }
});
});

async function startServer() {
  await ensureDataDir();
  await loadData();
  await fetchWeather();
  await fetchAirtableData();
  cron.schedule('0 */3 * * *', processQueue);
  cron.schedule('0 */1 * * *', fetchWeather);
  cron.schedule('0 */6 * * *', fetchAirtableData);
  cron.schedule('0 0 * * 0', generateQuotes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch(err => console.error('Startup error:', err));
