// pixelPreview.js - a module for rendering GitHub-style contribution graphs

/**
 * Converts a message string to a pixel pattern for GitHub contributions
 * @param {string} message - The message to render
 * @param {Object} options - Configuration options
 * @returns {Array} 2D array representing weeks and days with intensity values
 */
function messageToPixels(message, options = {}) {
  const defaults = {
    font: 'pixel',  // 'pixel', 'slim', or 'bold'
    maxWidth: 52,   // Max weeks in GitHub contribution graph
    maxHeight: 7,   // Days per week in contribution graph
    charSpacing: 1  // Space between characters
  };
  
  const config = { ...defaults, ...options };
  const result = Array(config.maxWidth).fill().map(() => Array(config.maxHeight).fill(0));
  
  // Complete font definitions
  const fonts = {
    pixel: {
      'A': [
        [0,1,0],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
      ],
      'B': [
        [1,1,0],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,1,0]
      ],
      'C': [
        [0,1,1],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [0,1,1]
      ],
      'D': [
        [1,1,0],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,0]
      ],
      'E': [
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [1,0,0],
        [1,1,1]
      ],
      'F': [
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [1,0,0],
        [1,0,0]
      ],
      'G': [
        [0,1,1],
        [1,0,0],
        [1,0,1],
        [1,0,1],
        [0,1,1]
      ],
      'H': [
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
      ],
      'I': [
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
      ],
      'J': [
        [1,1,1],
        [0,0,1],
        [0,0,1],
        [1,0,1],
        [0,1,0]
      ],
      'K': [
        [1,0,1],
        [1,1,0],
        [1,0,0],
        [1,1,0],
        [1,0,1]
      ],
      'L': [
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,1,1]
      ],
      'M': [
        [1,0,1],
        [1,1,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
      ],
      'N': [
        [1,0,1],
        [1,1,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
      ],
      'O': [
        [0,1,0],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [0,1,0]
      ],
      'P': [
        [1,1,0],
        [1,0,1],
        [1,1,0],
        [1,0,0],
        [1,0,0]
      ],
      'Q': [
        [0,1,0],
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,1,1]
      ],
      'R': [
        [1,1,0],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,0,1]
      ],
      'S': [
        [0,1,1],
        [1,0,0],
        [0,1,0],
        [0,0,1],
        [1,1,0]
      ],
      'T': [
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0]
      ],
      'U': [
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [0,1,0]
      ],
      'V': [
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [0,1,0]
      ],
      'W': [
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [1,1,1],
        [1,0,1]
      ],
      'X': [
        [1,0,1],
        [1,0,1],
        [0,1,0],
        [1,0,1],
        [1,0,1]
      ],
      'Y': [
        [1,0,1],
        [1,0,1],
        [0,1,0],
        [0,1,0],
        [0,1,0]
      ],
      'Z': [
        [1,1,1],
        [0,0,1],
        [0,1,0],
        [1,0,0],
        [1,1,1]
      ],
      '0': [
        [0,1,0],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [0,1,0]
      ],
      '1': [
        [0,1,0],
        [1,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
      ],
      '2': [
        [1,1,0],
        [0,0,1],
        [0,1,0],
        [1,0,0],
        [1,1,1]
      ],
      '3': [
        [1,1,0],
        [0,0,1],
        [0,1,0],
        [0,0,1],
        [1,1,0]
      ],
      '4': [
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [0,0,1]
      ],
      '5': [
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [0,0,1],
        [1,1,0]
      ],
      '6': [
        [0,1,1],
        [1,0,0],
        [1,1,0],
        [1,0,1],
        [0,1,0]
      ],
      '7': [
        [1,1,1],
        [0,0,1],
        [0,1,0],
        [0,1,0],
        [0,1,0]
      ],
      '8': [
        [0,1,0],
        [1,0,1],
        [0,1,0],
        [1,0,1],
        [0,1,0]
      ],
      '9': [
        [0,1,0],
        [1,0,1],
        [0,1,1],
        [0,0,1],
        [1,1,0]
      ],
      '!': [
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [0,0,0],
        [0,1,0]
      ],
      '?': [
        [0,1,0],
        [1,0,1],
        [0,0,1],
        [0,1,0],
        [0,1,0]
      ],
      ' ': [
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0]
      ],
      '.': [
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,1,0]
      ],
      ',': [
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,1,0],
        [1,0,0]
      ],
      ':': [
        [0,0,0],
        [0,1,0],
        [0,0,0],
        [0,1,0],
        [0,0,0]
      ],
      ';': [
        [0,0,0],
        [0,1,0],
        [0,0,0],
        [0,1,0],
        [1,0,0]
      ],
      '-': [
        [0,0,0],
        [0,0,0],
        [1,1,1],
        [0,0,0],
        [0,0,0]
      ],
      '+': [
        [0,0,0],
        [0,1,0],
        [1,1,1],
        [0,1,0],
        [0,0,0]
      ],
      '=': [
        [0,0,0],
        [1,1,1],
        [0,0,0],
        [1,1,1],
        [0,0,0]
      ],
      '(': [
        [0,1,0],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [0,1,0]
      ],
      ')': [
        [0,1,0],
        [0,0,1],
        [0,0,1],
        [0,0,1],
        [0,1,0]
      ]
    },
    slim: {
      // Define a slimmer 2x5 font style for space efficiency
      'A': [
        [1,1],
        [1,1],
        [1,1],
        [1,1],
        [1,1]
      ],
      // Add more slim characters as needed...
    },
    bold: {
      // Define a bolder 4x5 font style
      'A': [
        [0,1,1,0],
        [1,0,0,1],
        [1,1,1,1],
        [1,0,0,1],
        [1,0,0,1]
      ],
      // Add more bold characters as needed...
    }
  };
  
  let currentWeek = 0;
  
  // For each character in the message
  for (let i = 0; i < message.length; i++) {
    const char = message[i].toUpperCase();
    
    // Skip if we've reached the end of available weeks
    if (currentWeek >= config.maxWidth) break;
    
    // If we have a pixel representation for this character
    if (fonts[config.font][char]) {
      const charMap = fonts[config.font][char];
      
      // For each column of the character
      for (let x = 0; x < charMap[0].length; x++) {
        // Skip if we've reached the end of available weeks
        if (currentWeek >= config.maxWidth) break;
        
        // For each row of the character
        for (let y = 0; y < charMap.length; y++) {
          // Stay within bounds of GitHub's 7-day week
          if (y < config.maxHeight) {
            result[currentWeek][y] = charMap[y][x] ? 4 : 0; // 4 is maximum intensity
          }
        }
        currentWeek++;
      }
      
      // Add spacing between characters
      currentWeek += config.charSpacing;
    } else if (char === ' ') {
      // Handle spaces
      currentWeek += 2;
    } else {
      // Unknown character, add a small gap
      currentWeek += 1;
    }
  }
  
  return result;
}

/**
 * Generate a commit plan from a message (required by server.js)
 * @param {string} message - The message to convert to commits
 * @param {Object} options - Configuration options
 * @returns {Array} Array of commit objects with date and intensity
 */
function generateCommitPlan(message, options = {}) {
  const config = {
    startDate: null, // Will default to 52 weeks ago
    font: 'pixel',
    ...options
  };
  
  const pixelData = messageToPixels(message, config);
  const commits = [];
  
  // Calculate start date (52 weeks ago from today)
  const endDate = new Date();
  const startDate = config.startDate || new Date(endDate.getTime() - (52 * 7 * 24 * 60 * 60 * 1000));
  
  // Convert pixel data to commit plan
  for (let week = 0; week < pixelData.length; week++) {
    for (let day = 0; day < pixelData[week].length; day++) {
      const intensity = pixelData[week][day];
      
      if (intensity > 0) {
        // Calculate the actual date for this cell
        const commitDate = new Date(startDate);
        commitDate.setDate(commitDate.getDate() + (week * 7) + day);
        
        commits.push({
          date: commitDate.toISOString().split('T')[0], // YYYY-MM-DD format
          intensity: intensity,
          message: message
        });
      }
    }
  }
  
  return commits;
}

/**
 * Renders pixel pattern to a canvas element
 * @param {HTMLCanvasElement} canvas - Canvas element to render to
 * @param {Array} pixelData - 2D array from messageToPixels
 * @param {Object} options - Rendering options
 */
function renderToCanvas(canvas, pixelData, options = {}) {
  const defaults = {
    cellSize: 12,
    cellGap: 2,
    colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'], // GitHub's palette
    darkMode: false
  };
  
  const config = { ...defaults, ...options };
  
  if (config.darkMode) {
    config.colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']; // GitHub dark mode
  }
  
  const ctx = canvas.getContext('2d');
  const width = pixelData.length;
  const height = pixelData[0].length;
  
  // Set canvas size
  canvas.width = width * (config.cellSize + config.cellGap) + config.cellGap;
  canvas.height = height * (config.cellSize + config.cellGap) + config.cellGap;
  
  // Clear canvas
  ctx.fillStyle = config.darkMode ? '#0d1117' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw cells
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const intensity = pixelData[x][y];
      ctx.fillStyle = config.colors[intensity];
      ctx.fillRect(
        x * (config.cellSize + config.cellGap) + config.cellGap,
        y * (config.cellSize + config.cellGap) + config.cellGap,
        config.cellSize,
        config.cellSize
      );
    }
  }
}

/**
 * Simulates how a message would appear on GitHub's contribution graph
 * @param {string} message - Message to preview
 * @param {string} containerId - ID of container element
 * @param {Object} options - Configuration options
 */
function previewGitHubMessage(message, containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Create or reuse canvas
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }
  
  const pixelData = messageToPixels(message, options);
  renderToCanvas(canvas, pixelData, options);
  
  return {
    pixelData,
    // Provide a way to get the commit plan
    getCommitPlan: function() {
      const commits = [];
      const now = new Date();
      // Start 52 weeks ago
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - (52 * 7));
      
      for (let week = 0; week < pixelData.length; week++) {
        for (let day = 0; day < pixelData[week].length; day++) {
          const intensity = pixelData[week][day];
          if (intensity > 0) {
            // Calculate the date for this cell
            const commitDate = new Date(startDate);
            commitDate.setDate(commitDate.getDate() + (week * 7) + day);
            
            // Add commits based on intensity (more commits = darker color)
            for (let i = 0; i < intensity; i++) {
              commits.push({
                date: new Date(commitDate),
                message: `Auto commit for graph animation (${message})`
              });
            }
          }
        }
      }
      return commits;
    }
  };
}

/**
 * Additional utility functions for validation and preview
 */
function validateMessage(message) {
  const errors = [];
  
  if (!message || typeof message !== 'string') {
    errors.push('Message is required and must be a string');
  }
  
  if (message && message.length > 30) {
    errors.push('Message must be 30 characters or less');
  }
  
  if (message && message.trim().length === 0) {
    errors.push('Message cannot be empty or only whitespace');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function getMessageWidth(message, fontType = 'pixel') {
  const fonts = {
    pixel: { width: 3, spacing: 1 },
    slim: { width: 2, spacing: 1 },
    bold: { width: 4, spacing: 1 }
  };
  
  const font = fonts[fontType] || fonts.pixel;
  let width = 0;
  
  for (let i = 0; i < message.length; i++) {
    const char = message[i].toUpperCase();
    if (char === ' ') {
      width += 2;
    } else {
      width += font.width + font.spacing;
    }
  }
  
  return Math.max(0, width - font.spacing); // Remove trailing spacing
}

module.exports = {
  messageToPixels,
  renderToCanvas,
  previewGitHubMessage,
  generateCommitPlan,  // This was missing in your original file
  validateMessage,
  getMessageWidth
};