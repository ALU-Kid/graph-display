// utils/pixel-preview-fixed.js - Fixed version with proper alignment and animations

// Import the enhanced SVG generator
const { createAnimatedContributionGraph } = require('./enhanced-svg-generator');

// Original pixel font (keep for compatibility)
const PIXEL_FONT = {
  'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  'B': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  'C': [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  'E': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  'F': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
  'G': [[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
  'H': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  'J': [[1,1,1],[0,0,1],[0,0,1],[1,0,1],[0,1,0]],
  'K': [[1,0,1],[1,1,0],[1,0,0],[1,1,0],[1,0,1]],
  'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  'M': [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  'N': [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  'O': [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  'P': [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
  'Q': [[0,1,0],[1,0,1],[1,0,1],[1,1,1],[0,1,1]],
  'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  'S': [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
  'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  'U': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  'V': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  'W': [[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
  'X': [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
  'Y': [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
  'Z': [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  '0': [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  '2': [[1,1,0],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  '3': [[1,1,0],[0,0,1],[0,1,0],[0,0,1],[1,1,0]],
  '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  '5': [[1,1,1],[1,0,0],[1,1,0],[0,0,1],[1,1,0]],
  '6': [[0,1,1],[1,0,0],[1,1,0],[1,0,1],[0,1,0]],
  '7': [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
  '8': [[0,1,0],[1,0,1],[0,1,0],[1,0,1],[0,1,0]],
  '9': [[0,1,0],[1,0,1],[0,1,1],[0,0,1],[1,1,0]],
  '!': [[0,1,0],[0,1,0],[0,1,0],[0,0,0],[0,1,0]],
  '?': [[0,1,0],[1,0,1],[0,0,1],[0,1,0],[0,1,0]],
  ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  '.': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
  ',': [[0,0,0],[0,0,0],[0,0,0],[0,1,0],[1,0,0]],
  ':': [[0,0,0],[0,1,0],[0,0,0],[0,1,0],[0,0,0]],
  '-': [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
  '+': [[0,0,0],[0,1,0],[1,1,1],[0,1,0],[0,0,0]],
  '=': [[0,0,0],[1,1,1],[0,0,0],[1,1,1],[0,0,0]]
};

/**
 * Fixed version of renderAnimatedSVG with proper alignment and professional styling
 */
function renderAnimatedSVG(commitPlan, options) {
  options = options || {};
  
  // Use the enhanced SVG generator for better results
  const svgOptions = {
    title: 'GitGraph Animator',
    message: options.message || 'GITGRAPH',
    theme: options.darkMode !== false ? 'dark' : 'light',
    animationType: 'wave',
    animationDuration: 2,
    scrollingEnabled: true,
    scrollSpeed: options.scrollSpeed || 15,
    showStats: true,
    stats: options.stats || {}
  };
  
  // Use the enhanced generator
  return createAnimatedContributionGraph(svgOptions);
}

/**
 * Alternative: Fixed original function with proper alignment
 */
function renderAnimatedSVGOriginalFixed(commitPlan, options) {
  options = options || {};
  
  const defaults = {
    cellSize: 11,
    cellGap: 2,
    colors: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    darkMode: true,
    animationDuration: 0.8,
    staggerDelay: 0.03,
    message: 'GITGRAPH',
    scrollSpeed: 15,
    fadeIn: true
  };
  
  const config = {
    cellSize: options.cellSize || defaults.cellSize,
    cellGap: options.cellGap || defaults.cellGap,
    colors: options.colors || defaults.colors,
    darkMode: options.darkMode !== undefined ? options.darkMode : defaults.darkMode,
    animationDuration: options.animationDuration || defaults.animationDuration,
    staggerDelay: options.staggerDelay || defaults.staggerDelay,
    message: options.message || defaults.message,
    scrollSpeed: options.scrollSpeed || defaults.scrollSpeed,
    fadeIn: options.fadeIn !== undefined ? options.fadeIn : defaults.fadeIn
  };
  
  // Use GitHub's actual colors
  if (!config.darkMode) {
    config.colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  }
  
  // Convert message to pixel pattern
  const pixelData = messageToPixels(config.message);
  const messageWidth = getMessageWidth(config.message);
  
  // GitHub standard grid
  const gridWidth = 53;
  const gridHeight = 7;
  
  // Calculate proper dimensions with padding
  const padding = { top: 50, right: 30, bottom: 60, left: 40 };
  const gridPixelWidth = gridWidth * (config.cellSize + config.cellGap) - config.cellGap;
  const gridPixelHeight = gridHeight * (config.cellSize + config.cellGap) - config.cellGap;
  const svgWidth = gridPixelWidth + padding.left + padding.right;
  const svgHeight = gridPixelHeight + padding.top + padding.bottom;
  
  // Check if scrolling is needed
  const needsScrolling = messageWidth > gridWidth;
  const scrollDistance = needsScrolling ? (messageWidth - gridWidth + 5) * (config.cellSize + config.cellGap) : 0;
  
  // Build SVG with proper structure
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      
      .bg { fill: ${config.darkMode ? '#0d1117' : '#ffffff'}; }
      .title { 
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 16px;
        font-weight: 600;
        fill: ${config.darkMode ? '#f0f6fc' : '#24292f'};
      }
      .subtitle {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 12px;
        font-weight: 400;
        fill: ${config.darkMode ? '#7d8590' : '#656d76'};
      }
      .label {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 10px;
        fill: ${config.darkMode ? '#7d8590' : '#656d76'};
      }
      .stats {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 11px;
        fill: ${config.darkMode ? '#7d8590' : '#656d76'};
      }
    </style>
    
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feFlood flood-color="#000000" flood-opacity="0.1"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="100%" height="100%" class="bg" rx="6" ry="6" filter="url(#shadow)" />
  
  <!-- Header -->
  <text x="${padding.left}" y="30" class="title">GitGraph Animator</text>
  <text x="${svgWidth - padding.right}" y="30" class="subtitle" text-anchor="end">${config.message}</text>
  
  <!-- Month labels -->
  <g transform="translate(${padding.left}, ${padding.top - 10})">`;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthSpacing = gridWidth / 12;
  for (let m = 0; m < 12; m++) {
    const x = Math.floor(m * monthSpacing * (config.cellSize + config.cellGap));
    svg += `\n    <text x="${x}" y="0" class="label">${months[m]}</text>`;
  }
  
  svg += `\n  </g>
  
  <!-- Day labels -->
  <g transform="translate(${padding.left - 25}, ${padding.top})">`;
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let d = 1; d < 7; d += 2) { // Mon, Wed, Fri
    const y = d * (config.cellSize + config.cellGap) + config.cellSize / 2 + 3;
    svg += `\n    <text x="0" y="${y}" class="label" text-anchor="end">${days[d]}</text>`;
  }
  
  svg += `\n  </g>
  
  <!-- Main grid container -->
  <g transform="translate(${padding.left}, ${padding.top})">
    <!-- Background grid -->`;
  
  // Draw empty cells
  for (let week = 0; week < gridWidth; week++) {
    for (let day = 0; day < gridHeight; day++) {
      const x = week * (config.cellSize + config.cellGap);
      const y = day * (config.cellSize + config.cellGap);
      svg += `\n    <rect x="${x}" y="${y}" width="${config.cellSize}" height="${config.cellSize}" fill="${config.colors[0]}" rx="2" ry="2" />`;
    }
  }
  
  svg += `\n    
    <!-- Message container -->`;
  
  if (needsScrolling) {
    svg += `\n    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; -${scrollDistance},0; -${scrollDistance},0; 0,0"
        dur="${config.scrollSpeed}s"
        repeatCount="indefinite" />`;
  } else {
    svg += '\n    <g>';
  }
  
  // Draw message pixels
  for (let week = 0; week < pixelData.length; week++) {
    for (let day = 0; day < pixelData[week].length; day++) {
      const intensity = pixelData[week][day];
      if (intensity > 0) {
        const x = week * (config.cellSize + config.cellGap);
        const y = day * (config.cellSize + config.cellGap);
        const color = config.colors[intensity];
        const delay = config.fadeIn ? (week * config.staggerDelay + day * 0.01) : 0;
        
        svg += `\n      <rect x="${x}" y="${y}" width="${config.cellSize}" height="${config.cellSize}" fill="${color}" rx="2" ry="2" opacity="0">
        <animate attributeName="opacity" values="0;1" dur="${config.animationDuration}s" begin="${delay}s" fill="freeze" />
        <animateTransform attributeName="transform" type="scale" values="0.3;1.1;1" dur="${config.animationDuration}s" begin="${delay}s" fill="freeze" additive="sum" />
      </rect>`;
      }
    }
  }
  
  svg += '\n    </g>\n  </g>';
  
  // Stats footer
  if (options.stats) {
    const stats = options.stats;
    let statsText = [];
    
    if (stats.kwhCharged !== undefined) {
      statsText.push(`Energy: ${stats.kwhCharged}kWh`);
    }
    if (stats.sessions !== undefined) {
      statsText.push(`Sessions: ${stats.sessions}`);
    }
    if (stats.weather && stats.weather.temp !== undefined) {
      statsText.push(`${stats.weather.temp}°C ${stats.weather.condition || ''}`);
    }
    
    if (statsText.length > 0) {
      svg += `\n  
  <!-- Stats -->
  <text x="${padding.left}" y="${svgHeight - 20}" class="stats">${statsText.join(' • ')}</text>`;
    }
  }
  
  // Timestamp
  const now = new Date();
  svg += `\n  <text x="${svgWidth - padding.right}" y="${svgHeight - 20}" class="stats" text-anchor="end">Updated: ${now.toLocaleTimeString()}</text>`;
  
  svg += '\n</svg>';
  
  return svg;
}

/**
 * Keep existing functions for compatibility
 */
function messageToPixels(message, options) {
  options = options || {};
  const maxWidth = options.maxWidth || 52;
  const maxHeight = options.maxHeight || 7;
  const charSpacing = options.charSpacing || 1;
  
  const result = Array(maxWidth).fill().map(function() {
    return Array(maxHeight).fill(0);
  });
  
  let currentWeek = 0;
  
  for (let i = 0; i < message.length; i++) {
    const char = message[i].toUpperCase();
    
    if (currentWeek >= maxWidth) break;
    
    if (PIXEL_FONT[char]) {
      const charMap = PIXEL_FONT[char];
      
      for (let x = 0; x < charMap[0].length; x++) {
        if (currentWeek >= maxWidth) break;
        
        for (let y = 0; y < charMap.length; y++) {
          if (y < maxHeight) {
            result[currentWeek][y] = charMap[y][x] ? 4 : 0;
          }
        }
        currentWeek++;
      }
      
      currentWeek += charSpacing;
    } else if (char === ' ') {
      currentWeek += 2;
    } else {
      currentWeek += 1;
    }
  }
  
  return result;
}

function generateCommitPlan(message, options) {
  options = options || {};
  const pixelData = messageToPixels(message, options);
  const commits = [];
  
  const endDate = new Date();
  const startDate = options.startDate || new Date(endDate.getTime() - (52 * 7 * 24 * 60 * 60 * 1000));
  
  for (let week = 0; week < pixelData.length; week++) {
    for (let day = 0; day < pixelData[week].length; day++) {
      const intensity = pixelData[week][day];
      
      if (intensity > 0) {
        const commitDate = new Date(startDate);
        commitDate.setDate(commitDate.getDate() + (week * 7) + day);
        
        commits.push({
          date: commitDate.toISOString().split('T')[0],
          intensity: intensity,
          message: message,
          x: week,
          y: day
        });
      }
    }
  }
  
  return commits;
}

function generatePreviewData(message, options) {
  options = options || {};
  const pixelData = messageToPixels(message, options);
  
  let commitCount = 0;
  for (let week = 0; week < pixelData.length; week++) {
    for (let day = 0; day < pixelData[week].length; day++) {
      commitCount += pixelData[week][day];
    }
  }
  
  return {
    pixels: pixelData,
    width: pixelData.length,
    height: pixelData[0] ? pixelData[0].length : 0,
    message: message,
    commitCount: commitCount
  };
}

function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message must be a string' };
  }
  
  if (message.length > 30) {
    return { valid: false, error: 'Message must be 30 characters or less' };
  }
  
  if (message.length < 1) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  const supportedPattern = /^[A-Z0-9\s!?.,:\-+=()]*$/;
  if (!supportedPattern.test(message.toUpperCase())) {
    return { valid: false, error: 'Message contains unsupported characters' };
  }
  
  return { valid: true };
}

function getMessageWidth(message) {
  let width = 0;
  const cleanMessage = message.toUpperCase();
  
  for (let i = 0; i < cleanMessage.length; i++) {
    const char = cleanMessage[i];
    
    if (PIXEL_FONT[char]) {
      width += PIXEL_FONT[char][0].length + 1;
    } else if (char === ' ') {
      width += 2;
    } else {
      width += 1;
    }
  }
  
  return Math.max(0, width - 1);
}

// Export all functions
module.exports = {
  messageToPixels: messageToPixels,
  renderToCanvas: function() {}, // Placeholder for browser compatibility
  previewGitHubMessage: function() {}, // Placeholder for browser compatibility
  generateCommitPlan: generateCommitPlan,
  generatePreviewData: generatePreviewData,
  validateMessage: validateMessage,
  getMessageWidth: getMessageWidth,
  renderAnimatedSVG: renderAnimatedSVG, // Use enhanced version
  renderAnimatedSVGOriginalFixed: renderAnimatedSVGOriginalFixed, // Fixed original
  PIXEL_FONT: PIXEL_FONT
};