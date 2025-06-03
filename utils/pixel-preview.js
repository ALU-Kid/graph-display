// pixel-preview.js - a module for rendering GitHub-style contribution graphs

/**
 * Converts a message string to a pixel pattern for GitHub contributions
 * @param {string} message - The message to render
 * @param {Object} options - Configuration options
 * @param {number} [options.iconScale=1] - Scale factor for built-in icon tokens
 * @returns {Array} 2D array representing weeks and days with intensity values
 */
function messageToPixels(message, options = {}) {
  const defaults = {
    font: 'pixel',  // 'pixel', 'slim', or 'bold'
    maxWidth: 52,   // Max weeks in GitHub contribution graph
    maxHeight: 7,   // Days per week in contribution graph
    charSpacing: 1, // Space between characters
    iconScale: 1    // Scale factor for built-in icons
  };
  
  const config = { ...defaults, ...options };
  const result = Array(config.maxWidth).fill().map(() => Array(config.maxHeight).fill(0));
  
  // Font definitions - this is simplified, you'd want more complete character maps
  const fonts = {
    pixel: {
      // Simple 3x5 pixel font
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
      ]
    },
    slim: {
      // Define a slimmer font style
    },
    bold: {
      // Define a bolder font style
    }
  };

  const icons = {
    ':NODE:': [
      [1,0,1,0,1],
      [1,1,0,1,1],
      [1,0,1,0,1],
      [1,0,1,0,1],
      [1,0,1,0,1]
    ],
    ':PY:': [
      [1,1,1,1,0],
      [1,0,0,0,1],
      [1,1,1,1,0],
      [1,0,0,0,0],
      [1,0,0,0,0]
    ]
  };

  function scaleCharMap(map, scale) {
    if (scale <= 1) return map;
    const scaled = [];
    for (const row of map) {
      const scaledRow = [];
      for (const cell of row) {
        for (let i = 0; i < scale; i++) {
          scaledRow.push(cell);
        }
      }
      for (let i = 0; i < scale; i++) {
        scaled.push([...scaledRow]);
      }
    }
    return scaled;
  }
  
  let currentWeek = 0;
  
  // For each character in the message
  for (let i = 0; i < message.length; i++) {
    const remaining = message.slice(i).toUpperCase();
    const char = message[i].toUpperCase();

    // Skip if we've reached the end of available weeks
    if (currentWeek >= config.maxWidth) break;
    
    let charMap = null;
    let advance = 0;

    if (remaining.startsWith(':NODE:')) {
      charMap = scaleCharMap(icons[':NODE:'], config.iconScale);
      advance = 5; // total 6 including loop increment
    } else if (remaining.startsWith(':PY:')) {
      charMap = scaleCharMap(icons[':PY:'], config.iconScale);
      advance = 3; // total 4 including loop increment
    } else if (fonts[config.font][char]) {
      charMap = fonts[config.font][char];
    }

    if (charMap) {
      for (let x = 0; x < charMap[0].length; x++) {
        if (currentWeek >= config.maxWidth) break;
        for (let y = 0; y < charMap.length; y++) {
          if (y < config.maxHeight) {
            result[currentWeek][y] = charMap[y][x] ? 4 : 0;
          }
        }
        currentWeek++;
      }

      currentWeek += config.charSpacing;
      i += advance;
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

module.exports = {
  messageToPixels,
  renderToCanvas,
  previewGitHubMessage
};
