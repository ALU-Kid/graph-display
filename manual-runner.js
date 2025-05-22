// manual-runner.js
const { processQueue } = require('./server');

processQueue().then(() => {
  console.log('✅ Queue processed manually');
  process.exit(0);
});
