// utils/personalized-svg-generator.js - Customized version with animated text and tech stack

/**
 * Personalized SVG generator for GitHub profile
 */

const GITHUB_COLORS = {
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

// Tech stack colors
const TECH_COLORS = {
  js: '#F7DF1E',
  typescript: '#3178C6',
  python: '#3776AB',
  pandas: '#150458',
  flask: '#000000',
  kabisa: '#FF6B35'
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
 * Create personalized animated SVG
 */
function createPersonalizedSVG(options) {
  options = options || {};
  
  const config = {
    // Grid dimensions
    weeks: 53,
    days: 7,
    cellSize: 11,
    cellGap: 2,
    
    // Display options
    message: escapeXML(options.message || 'HELLO WORLD'),
    theme: options.theme || 'dark',
    
    // Animation settings
    animationType: options.animationType || 'wave',
    animationDuration: options.animationDuration || 2,
    scrollingEnabled: options.scrollingEnabled !== false,
    scrollSpeed: options.scrollSpeed || 15,
    
    // Custom text rotation
    rotatingTexts: [
      'I build fun things',
      'why are you here',
      'BUY GOLD!!!'
    ],
    
    // Stats
    stats: options.stats || {},
    
    // Layout
    padding: {
      top: 20,
      right: 30,
      bottom: 120, // More space for tech stack
      left: 40
    }
  };
  
  const colors = GITHUB_COLORS[config.theme];
  
  // Calculate dimensions
  const gridWidth = config.weeks * (config.cellSize + config.cellGap) - config.cellGap;
  const gridHeight = config.days * (config.cellSize + config.cellGap) - config.cellGap;
  const svgWidth = gridWidth + config.padding.left + config.padding.right;
  const svgHeight = gridHeight + config.padding.top + config.padding.bottom;
  
  // Generate contribution data
  const contributionData = generateContributionPattern(config.message, {
    weeks: config.weeks,
    days: config.days
  });
  
  // Check if scrolling needed
  const messageWidth = getMessagePixelWidth(config.message);
  const needsScrolling = config.scrollingEnabled && messageWidth > config.weeks;
  
  // Build SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <defs>
    <style type="text/css">
      <![CDATA[
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      .bg { fill: ${colors.bg}; }
      .cell { stroke: none; }
      .day-label {
        font-family: Inter, -apple-system, sans-serif;
        font-size: 10px;
        fill: ${colors.textMuted};
      }
      .rotating-text {
        font-family: Inter, -apple-system, sans-serif;
        font-size: 16px;
        font-weight: 600;
        fill: ${colors.text};
      }
      .tech-label {
        font-family: Inter, -apple-system, sans-serif;
        font-size: 11px;
        font-weight: 500;
        fill: ${colors.textMuted};
      }
      .company-text {
        font-family: Inter, -apple-system, sans-serif;
        font-size: 10px;
        fill: ${colors.textMuted};
      }
      ]]>
    </style>
    
    <!-- Gradient effect -->
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${colors.levels[3]};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${colors.levels[4]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.levels[3]};stop-opacity:1" />
    </linearGradient>
    
    <!-- Tech stack logos as symbols -->
    <g id="js-logo">
      <rect width="20" height="20" fill="#F7DF1E" rx="2"/>
      <text x="10" y="15" font-family="Arial Black" font-size="10" fill="#000" text-anchor="middle">JS</text>
    </g>
    
    <g id="ts-logo">
      <rect width="20" height="20" fill="#3178C6" rx="2"/>
      <text x="10" y="15" font-family="Arial" font-size="10" fill="#FFF" text-anchor="middle">TS</text>
    </g>
    
    <g id="python-logo">
      <rect width="20" height="20" fill="#3776AB" rx="2"/>
      <text x="10" y="15" font-family="Arial" font-size="10" fill="#FFF" text-anchor="middle">Py</text>
    </g>
    
    <g id="pandas-logo">
      <rect width="20" height="20" fill="#150458" rx="2"/>
      <text x="10" y="15" font-family="Arial" font-size="8" fill="#FFF" text-anchor="middle">Pd</text>
    </g>
    
    <g id="flask-logo">
      <rect width="20" height="20" fill="#000000" rx="2"/>
      <text x="10" y="15" font-family="Arial" font-size="10" fill="#FFF" text-anchor="middle">F</text>
    </g>
    
    <g id="kabisa-logo">
      <rect width="60" height="20" fill="#FF6B35" rx="2"/>
      <text x="30" y="15" font-family="Arial" font-size="10" fill="#FFF" text-anchor="middle">KABISA</text>
    </g>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" class="bg"/>
  
  <!-- Day labels (only Mon, Wed, Fri) -->
  <g transform="translate(${config.padding.left - 25}, ${config.padding.top})">`;
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 1; i < 7; i += 2) {
    const y = i * (config.cellSize + config.cellGap) + config.cellSize / 2 + 3;
    svg += `\n    <text x="0" y="${y}" class="day-label" text-anchor="end">${days[i]}</text>`;
  }
  
  svg += `\n  </g>
  
  <!-- Contribution grid -->
  <g transform="translate(${config.padding.left}, ${config.padding.top})">`;
  
  // Create scrolling container if needed
  if (needsScrolling) {
    const scrollDistance = (messageWidth - config.weeks) * (config.cellSize + config.cellGap);
    svg += `\n    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; -${scrollDistance},0; -${scrollDistance},0; 0,0"
        dur="${config.scrollSpeed}s"
        repeatCount="indefinite" />`;
  }
  
  // Generate cells
  const maxWeeks = needsScrolling ? messageWidth : config.weeks;
  
  for (let week = 0; week < maxWeeks; week++) {
    for (let day = 0; day < config.days; day++) {
      const x = week * (config.cellSize + config.cellGap);
      const y = day * (config.cellSize + config.cellGap);
      const intensity = (contributionData[week] && contributionData[week][day]) || 0;
      const color = colors.levels[intensity];
      
      // Calculate animation delay
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
        default:
          delay = 0;
      }
      
      svg += `\n      <rect 
        x="${x}" 
        y="${y}" 
        width="${config.cellSize}" 
        height="${config.cellSize}" 
        class="cell" 
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
    }
  }
  
  if (needsScrolling) {
    svg += '\n    </g>';
  }
  
  svg += `\n  </g>`;
  
  // Animated rotating text
  const textY = gridHeight + config.padding.top + 35;
  svg += `\n  
  <!-- Rotating animated text -->
  <g transform="translate(${svgWidth / 2}, ${textY})">`;
  
  config.rotatingTexts.forEach((text, index) => {
    const startTime = index * 4; // Each text shows for 4 seconds
    const endTime = startTime + 4;
    const totalDuration = config.rotatingTexts.length * 4;
    
    svg += `\n    <text class="rotating-text" text-anchor="middle" opacity="0" fill="url(#textGradient)">
      ${escapeXML(text)}
      <animate 
        attributeName="opacity" 
        values="0;0;1;1;0;0" 
        dur="${totalDuration}s" 
        begin="${startTime}s" 
        repeatCount="indefinite" />
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,20; 0,0; 0,0; 0,-20"
        dur="${totalDuration}s"
        begin="${startTime}s"
        repeatCount="indefinite" />
    </text>`;
  });
  
  svg += `\n  </g>`;
  
  // Tech stack
  const techY = textY + 40;
  const techSpacing = 30;
  const techStartX = (svgWidth - (5 * techSpacing + 20)) / 2;
  
  svg += `\n  
  <!-- Tech stack -->
  <g transform="translate(${techStartX}, ${techY})">
    <use href="#js-logo" x="0" y="0" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.5s" fill="freeze"/>
    </use>
    <use href="#ts-logo" x="${techSpacing}" y="0" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.7s" fill="freeze"/>
    </use>
    <use href="#python-logo" x="${techSpacing * 2}" y="0" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.9s" fill="freeze"/>
    </use>
    <use href="#pandas-logo" x="${techSpacing * 3}" y="0" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.1s" fill="freeze"/>
    </use>
    <use href="#flask-logo" x="${techSpacing * 4}" y="0" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.3s" fill="freeze"/>
    </use>
  </g>`;
  
  // Companies section
  const companyY = techY + 35;
  svg += `\n  
  <!-- Companies -->
  <g transform="translate(${svgWidth / 2}, ${companyY})">
    <text class="company-text" text-anchor="middle" y="0">Companies I've worked with:</text>
    <use href="#kabisa-logo" x="-30" y="10" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.5s" fill="freeze"/>
    </use>
  </g>`;
  
  // Stats at the very bottom
  if (config.stats && (config.stats.kwhCharged !== undefined || config.stats.sessions !== undefined)) {
    const statsY = svgHeight - 10;
    let statsText = [];
    
    if (config.stats.kwhCharged !== undefined) {
      statsText.push(`⚡ ${escapeXML(config.stats.kwhCharged)}kWh`);
    }
    if (config.stats.sessions !== undefined) {
      statsText.push(`📊 ${escapeXML(config.stats.sessions)} sessions`);
    }
    
    svg += `\n  <text x="${svgWidth / 2}" y="${statsY}" class="company-text" text-anchor="middle">${statsText.join(' • ')}</text>`;
  }
  
  svg += '\n</svg>';
  
  return svg;
}

/**
 * Generate contribution pattern from message
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
  
  const cleanMessage = message.toUpperCase().replace(/[^A-Z0-9\s!?.,:\-+=]/g, '');
  
  for (let i = 0; i < cleanMessage.length; i++) {
    const char = cleanMessage[i];
    const charPattern = PIXEL_FONT[char];
    
    if (charPattern) {
      for (let col = 0; col < charPattern[0].length; col++) {
        pattern[currentWeek] = [];
        for (let row = 0; row < 7; row++) {
          if (row < charPattern.length) {
            pattern[currentWeek][row] = charPattern[row][col] ? 4 : 0;
          } else {
            pattern[currentWeek][row] = 0;
          }
        }
        currentWeek++;
      }
      
      if (i < cleanMessage.length - 1) {
        pattern[currentWeek] = [0,0,0,0,0,0,0];
        currentWeek++;
      }
    }
  }
  
  return pattern;
}

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
    width += (CHAR_WIDTHS[char] || 3) + 1;
  }
  
  return Math.max(0, width - 1);
}

// Export
module.exports = {
  createPersonalizedSVG,
  generateContributionPattern,
  getMessagePixelWidth,
  GITHUB_COLORS
};