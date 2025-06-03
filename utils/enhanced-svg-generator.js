// utils/enhanced-svg-generator.js - Fixed version with proper XML escaping

/**
 * Enhanced SVG generator for creating beautiful, animated GitHub contribution graphs
 * with proper XML escaping and error handling
 */

const GITHUB_COLORS = {
  // GitHub's actual contribution colors
  light: {
    bg: '#ffffff',
    empty: '#ebedf0',
    levels: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    text: '#24292f',
    textMuted: '#656d76'
  },
  dark: {
    bg: '#0d1117',
    empty: '#161b22',
    levels: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    text: '#f0f6fc',
    textMuted: '#7d8590'
  }
};

/**
 * Escape special characters for XML/SVG
 */
function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Create a professional animated SVG contribution graph
 */
function createAnimatedContributionGraph(options) {
  options = options || {};
  
  const config = {
    // Grid dimensions (GitHub standard)
    weeks: 53,
    days: 7,
    cellSize: 11,
    cellGap: 2,
    
    // Display options
    title: escapeXML(options.title || 'GitGraph Animator'),
    message: escapeXML(options.message || 'HELLO WORLD'),
    theme: options.theme || 'dark',
    
    // Animation settings
    animationType: options.animationType || 'wave', // wave, fade, spiral, random
    animationDuration: options.animationDuration || 2,
    scrollingEnabled: options.scrollingEnabled !== false,
    scrollSpeed: options.scrollSpeed || 15, // seconds for full scroll
    
    // Data display
    showStats: options.showStats !== false,
    stats: options.stats || {},
    
    // Layout
    padding: {
      top: 40,
      right: 30,
      bottom: 50,
      left: 40
    }
  };
  
  const colors = GITHUB_COLORS[config.theme];
  
  // Calculate dimensions
  const gridWidth = config.weeks * (config.cellSize + config.cellGap) - config.cellGap;
  const gridHeight = config.days * (config.cellSize + config.cellGap) - config.cellGap;
  const svgWidth = gridWidth + config.padding.left + config.padding.right;
  const svgHeight = gridHeight + config.padding.top + config.padding.bottom;
  
  // Generate contribution data from message
  const contributionData = generateContributionPattern(config.message, {
    weeks: config.weeks,
    days: config.days
  });
  
  // Calculate if scrolling is needed
  const messageWidth = getMessagePixelWidth(config.message);
  const needsScrolling = !!config.scrollingEnabled;
  
  // Build the SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <defs>
    <style type="text/css">
      <![CDATA[
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      
      .contribution-graph-bg { fill: ${colors.bg}; }
      .contribution-cell { stroke: none; }
      .graph-title { 
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 16px;
        font-weight: 600;
        fill: ${colors.text};
      }
      .graph-subtitle {
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 12px;
        font-weight: 400;
        fill: ${colors.textMuted};
      }
      .day-label {
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 10px;
        fill: ${colors.textMuted};
      }
      .month-label {
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 10px;
        fill: ${colors.textMuted};
      }
      .stats-text {
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 11px;
        fill: ${colors.textMuted};
      }
      ]]>
    </style>
    
    <!-- Gradient for special effects -->
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${colors.levels[4]};stop-opacity:0" />
      <stop offset="50%" style="stop-color:${colors.levels[4]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.levels[4]};stop-opacity:0" />
      <animateTransform
        attributeName="transform"
        type="translate"
        from="-1 0"
        to="1 0"
        dur="3s"
        repeatCount="indefinite" />
    </linearGradient>
    
    <!-- Drop shadow filter -->
    <filter id="shadow">
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
  
  <!-- Background -->
  <rect width="100%" height="100%" class="contribution-graph-bg" rx="6" ry="6" filter="url(#shadow)" />
  
  <!-- Title -->
  <text x="${config.padding.left}" y="25" class="graph-title">${config.title}</text>
  <text x="${svgWidth - config.padding.right}" y="25" class="graph-subtitle" text-anchor="end">Contribution Graph</text>
  
  <!-- Month labels -->
  <g class="months" transform="translate(${config.padding.left}, ${config.padding.top - 5})">`;
  
  // Add month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeksPerMonth = config.weeks / 12;
  for (let i = 0; i < 12; i++) {
    const x = Math.floor(i * weeksPerMonth * (config.cellSize + config.cellGap));
    svg += `\n    <text x="${x}" y="0" class="month-label">${months[i]}</text>`;
  }
  
  svg += `\n  </g>
  
  <!-- Day labels -->
  <g class="days" transform="translate(${config.padding.left - 5}, ${config.padding.top})">`;
  
  // Add day labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 7; i++) {
    if (i % 2 === 1) { // Only show Mon, Wed, Fri
      const y = i * (config.cellSize + config.cellGap) + config.cellSize / 2 + 3;
      svg += `\n    <text x="0" y="${y}" class="day-label" text-anchor="end">${dayLabels[i]}</text>`;
    }
  }
  
  svg += `\n  </g>
  
  <!-- Contribution grid -->
  <g class="contribution-grid" transform="translate(${config.padding.left}, ${config.padding.top})">`;
  
  // Create scrolling container if needed
  if (needsScrolling) {
    const scrollDistance = messageWidth * (config.cellSize + config.cellGap);
    svg += `\n    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; -${scrollDistance},0; -${scrollDistance},0; 0,0"
        dur="${config.scrollSpeed}s"
        repeatCount="indefinite" />`;
  }
  
  // Generate cells
  let cellIndex = 0;
  const maxWeeks = needsScrolling ? messageWidth : config.weeks;
  
  for (let week = 0; week < maxWeeks; week++) {
    for (let day = 0; day < config.days; day++) {
      const x = week * (config.cellSize + config.cellGap);
      const y = day * (config.cellSize + config.cellGap);
      const intensity = (contributionData[week] && contributionData[week][day]) || 0;
      const color = colors.levels[intensity];
      
      // Calculate animation delay based on animation type
      let delay = 0;
      switch (config.animationType) {
        case 'wave':
          delay = (week * 0.02 + day * 0.01) % config.animationDuration;
          break;
        case 'spiral':
          delay = (Math.sqrt(week * week + day * day) * 0.05) % config.animationDuration;
          break;
        case 'random':
          delay = Math.random() * config.animationDuration;
          break;
        case 'fade':
        default:
          delay = 0;
      }
      
      svg += `\n      <rect 
        x="${x}" 
        y="${y}" 
        width="${config.cellSize}" 
        height="${config.cellSize}" 
        class="contribution-cell" 
        fill="${color}" 
        rx="2" 
        ry="2"
        opacity="0">
        <animate 
          attributeName="opacity" 
          values="0;1" 
          dur="${config.animationDuration}s" 
          begin="${delay}s" 
          fill="freeze" />`;
      
      if (intensity > 0) {
        svg += `\n        <animate 
          attributeName="fill" 
          values="${colors.levels[0]};${color}" 
          dur="${config.animationDuration}s" 
          begin="${delay}s" 
          fill="freeze" />`;
      }
      
      svg += `\n      </rect>`;
      cellIndex++;
    }
  }
  
  if (needsScrolling) {
    svg += '\n    </g>';
  }
  
  svg += `\n  </g>`;
  
  // Add stats if enabled
  if (config.showStats && config.stats) {
    const statsY = svgHeight - 20;
    let statsText = [];
    
    if (config.stats.kwhCharged !== undefined) {
      statsText.push(`Energy: ${escapeXML(config.stats.kwhCharged)}kWh`);
    }
    if (config.stats.sessions !== undefined) {
      statsText.push(`Sessions: ${escapeXML(config.stats.sessions)}`);
    }
    if (config.stats.weather) {
      const weather = config.stats.weather;
      statsText.push(`${escapeXML(weather.temp)}°C ${escapeXML(weather.condition || '')}`);
    }
    
    if (statsText.length > 0) {
      svg += `\n  
  <!-- Stats -->
  <text x="${config.padding.left}" y="${statsY}" class="stats-text">${statsText.join(' • ')}</text>`;
    }
  }
  
  // Add animated message display
  const messageY = svgHeight - 35;
  svg += `\n  
  <!-- Message -->
  <text x="${svgWidth / 2}" y="${messageY}" class="graph-subtitle" text-anchor="middle">
    <tspan fill="${colors.text}" font-weight="500">${config.message}</tspan>
    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
  </text>`;
  
  // Close SVG
  svg += '\n</svg>';
  
  return svg;
}

/**
 * Generate contribution pattern from message using pixel font
 */
function generateContributionPattern(message, options) {
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
    ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
    '!': [[0,1,0],[0,1,0],[0,1,0],[0,0,0],[0,1,0]],
    '?': [[0,1,0],[1,0,1],[0,0,1],[0,1,0],[0,1,0]],
    '.': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
    ',': [[0,0,0],[0,0,0],[0,0,0],[0,1,0],[1,0,0]],
    ':': [[0,0,0],[0,1,0],[0,0,0],[0,1,0],[0,0,0]],
    '-': [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
    '+': [[0,0,0],[0,1,0],[1,1,1],[0,1,0],[0,0,0]],
    '=': [[0,0,0],[1,1,1],[0,0,0],[1,1,1],[0,0,0]]
  };
  
  const pattern = [];
  let currentWeek = 0;
  
  // Clean message - remove unsupported characters
  const cleanMessage = message.toUpperCase().replace(/[^A-Z0-9\s!?.,:\-+=]/g, '');
  
  for (let i = 0; i < cleanMessage.length; i++) {
    const char = cleanMessage[i];
    const charPattern = PIXEL_FONT[char];
    
    if (charPattern) {
      // Add character columns
      for (let col = 0; col < charPattern[0].length; col++) {
        pattern[currentWeek] = [];
        for (let row = 0; row < 7; row++) {
          if (row < charPattern.length) {
            // Map pixel intensity to contribution level (1-4)
            pattern[currentWeek][row] = charPattern[row][col] ? 4 : 0;
          } else {
            pattern[currentWeek][row] = 0;
          }
        }
        currentWeek++;
      }
      
      // Add spacing between characters
      if (i < cleanMessage.length - 1) {
        pattern[currentWeek] = [0,0,0,0,0,0,0];
        currentWeek++;
      }
    }
  }
  
  return pattern;
}

/**
 * Calculate pixel width of message
 */
function getMessagePixelWidth(message) {
  const CHAR_WIDTHS = {
    'A': 3, 'B': 3, 'C': 3, 'D': 3, 'E': 3, 'F': 3, 'G': 3, 'H': 3, 'I': 3, 'J': 3,
    'K': 3, 'L': 3, 'M': 3, 'N': 3, 'O': 3, 'P': 3, 'Q': 3, 'R': 3, 'S': 3, 'T': 3,
    'U': 3, 'V': 3, 'W': 3, 'X': 3, 'Y': 3, 'Z': 3,
    '0': 3, '1': 3, '2': 3, '3': 3, '4': 3, '5': 3, '6': 3, '7': 3, '8': 3, '9': 3,
    ' ': 3, '!': 3, '?': 3, '.': 3, ',': 3, ':': 3, '-': 3, '+': 3, '=': 3
  };
  
  let width = 0;
  const cleanMessage = message.toUpperCase().replace(/[^A-Z0-9\s!?.,:\-+=]/g, '');
  
  for (let i = 0; i < cleanMessage.length; i++) {
    const char = cleanMessage[i];
    width += (CHAR_WIDTHS[char] || 3) + 1; // character width + spacing
  }
  
  return Math.max(0, width - 1); // Remove last spacing
}

// Export for Node.js
module.exports = {
  createAnimatedContributionGraph,
  generateContributionPattern,
  getMessagePixelWidth,
  GITHUB_COLORS
};