// utils/pixel-preview.js - Complete Node 10 Compatible Version with SVG Animation

// Complete pixel font
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
 * Converts a message string to a pixel pattern for GitHub contributions
 */
function messageToPixels(message, options) {
  options = options || {};
  var defaults = {
    font: 'pixel',
    maxWidth: 52,
    maxHeight: 7,
    charSpacing: 1
  };
  
  var config = {
    font: options.font || defaults.font,
    maxWidth: options.maxWidth || defaults.maxWidth,
    maxHeight: options.maxHeight || defaults.maxHeight,
    charSpacing: options.charSpacing || defaults.charSpacing
  };
  
  var result = Array(config.maxWidth).fill().map(function() {
    return Array(config.maxHeight).fill(0);
  });
  
  var currentWeek = 0;
  
  for (var i = 0; i < message.length; i++) {
    var char = message[i].toUpperCase();
    
    if (currentWeek >= config.maxWidth) break;
    
    if (PIXEL_FONT[char]) {
      var charMap = PIXEL_FONT[char];
      
      for (var x = 0; x < charMap[0].length; x++) {
        if (currentWeek >= config.maxWidth) break;
        
        for (var y = 0; y < charMap.length; y++) {
          if (y < config.maxHeight) {
            result[currentWeek][y] = charMap[y][x] ? 4 : 0;
          }
        }
        currentWeek++;
      }
      
      currentWeek += config.charSpacing;
    } else if (char === ' ') {
      currentWeek += 2;
    } else {
      currentWeek += 1;
    }
  }
  
  return result;
}

/**
 * Renders pixel pattern to a canvas element (browser-side function)
 */
function renderToCanvas(canvas, pixelData, options) {
  options = options || {};
  var defaults = {
    cellSize: 12,
    cellGap: 2,
    colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    darkMode: false
  };
  
  var config = {
    cellSize: options.cellSize || defaults.cellSize,
    cellGap: options.cellGap || defaults.cellGap,
    colors: options.colors || defaults.colors,
    darkMode: options.darkMode || defaults.darkMode
  };
  
  if (config.darkMode) {
    config.colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  }
  
  var ctx = canvas.getContext('2d');
  var width = pixelData.length;
  var height = pixelData[0].length;
  
  canvas.width = width * (config.cellSize + config.cellGap) + config.cellGap;
  canvas.height = height * (config.cellSize + config.cellGap) + config.cellGap;
  
  ctx.fillStyle = config.darkMode ? '#0d1117' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var intensity = pixelData[x][y];
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
 * Generate a commit plan from a message (used by server)
 */
function generateCommitPlan(message, options) {
  options = options || {};
  var pixelData = messageToPixels(message, options);
  var commits = [];
  
  var endDate = new Date();
  var startDate = options.startDate || new Date(endDate.getTime() - (52 * 7 * 24 * 60 * 60 * 1000));
  
  for (var week = 0; week < pixelData.length; week++) {
    for (var day = 0; day < pixelData[week].length; day++) {
      var intensity = pixelData[week][day];
      
      if (intensity > 0) {
        var commitDate = new Date(startDate);
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

/**
 * Generate preview data for frontend
 */
function generatePreviewData(message, options) {
  options = options || {};
  var pixelData = messageToPixels(message, options);
  
  var commitCount = 0;
  for (var week = 0; week < pixelData.length; week++) {
    for (var day = 0; day < pixelData[week].length; day++) {
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

/**
 * Render animated SVG for GitHub contribution graph visualization with LaMetric-style scrolling
 */
function renderAnimatedSVG(commitPlan, options) {
  options = options || {};
  
  var defaults = {
    cellSize: 11,
    cellGap: 2,
    colors: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    darkMode: true,
    animationDuration: 0.8,
    staggerDelay: 0.03,
    message: 'GITGRAPH',
    scrollSpeed: 3,
    fadeIn: true
  };
  
  var config = {
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
  
  // Use GitHub's actual colors for better authenticity
  if (!config.darkMode) {
    config.colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  }
  
  if (!commitPlan || commitPlan.length === 0) {
    commitPlan = [{ x: 0, y: 0, intensity: 1 }];
  }
  
  // Calculate grid dimensions - GitHub standard is 53 weeks x 7 days
  var gridWidth = 53;
  var gridHeight = 7;
  var totalWidth = gridWidth * (config.cellSize + config.cellGap) - config.cellGap;
  var totalHeight = gridHeight * (config.cellSize + config.cellGap) - config.cellGap;
  
  // SVG dimensions with proper padding
  var svgWidth = totalWidth + 40;
  var svgHeight = totalHeight + 80;
  
  // Check if message needs scrolling (longer than visible grid width)
  var messageWidth = getMessageWidth(config.message);
  var needsScrolling = messageWidth > gridWidth;
  var scrollDistance = needsScrolling ? (messageWidth - gridWidth + 5) * (config.cellSize + config.cellGap) : 0;
  
  // Generate background grid with GitHub styling
  var backgroundGrid = '';
  for (var x = 0; x < gridWidth; x++) {
    for (var y = 0; y < gridHeight; y++) {
      var squareX = x * (config.cellSize + config.cellGap) + 20;
      var squareY = y * (config.cellSize + config.cellGap) + 50;
      
      backgroundGrid += '    <rect x="' + squareX + '" y="' + squareY + '" ' +
                       'width="' + config.cellSize + '" height="' + config.cellSize + '" ' +
                       'fill="' + config.colors[0] + '" rx="2" ry="2" />\n';
    }
  }
  
  // Generate animated commit squares with wave-like animation
  var animatedSquares = '';
  var maxDelay = 0;
  
  // Create scrolling group if needed
  var scrollingGroup = needsScrolling ? 
    '<g>\n' +
    '  <animateTransform attributeName="transform" type="translate" ' +
    'values="0,0; -' + scrollDistance + ',0; -' + scrollDistance + ',0; 0,0" ' +
    'dur="' + (config.scrollSpeed * 2) + 's" repeatCount="indefinite" />\n' : '<g>';
  
  commitPlan.forEach(function(commit, index) {
    var squareX = commit.x * (config.cellSize + config.cellGap) + 20;
    var squareY = commit.y * (config.cellSize + config.cellGap) + 50;
    var intensity = Math.min(Math.max(commit.intensity || 1, 1), 4);
    var color = config.colors[intensity];
    
    // Wave animation with smooth staggering
    var baseDelay = commit.x * config.staggerDelay + commit.y * config.staggerDelay * 0.1;
    var fadeDelay = config.fadeIn ? baseDelay : 0;
    maxDelay = Math.max(maxDelay, baseDelay);
    
    animatedSquares += '    <rect x="' + squareX + '" y="' + squareY + '" ' +
                      'width="' + config.cellSize + '" height="' + config.cellSize + '" ' +
                      'fill="' + color + '" rx="2" ry="2" opacity="0">\n';
    
    if (config.fadeIn) {
      animatedSquares += '      <animate attributeName="opacity" values="0;1" ' +
                        'dur="' + config.animationDuration + 's" begin="' + fadeDelay + 's" ' +
                        'fill="freeze" />\n';
      
      // Subtle scale animation for polish
      animatedSquares += '      <animateTransform attributeName="transform" type="scale" ' +
                        'values="0.3;1.1;1" dur="' + config.animationDuration + 's" ' +
                        'begin="' + fadeDelay + 's" fill="freeze" />\n';
    } else {
      animatedSquares += '      <animate attributeName="opacity" values="0;1" ' +
                        'dur="0.1s" begin="0s" fill="freeze" />\n';
    }
    
    animatedSquares += '    </rect>\n';
  });
  
  animatedSquares = scrollingGroup + '\n' + animatedSquares + '</g>\n';
  
  // Day labels with GitHub styling
  var dayLabels = '';
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (var d = 0; d < days.length; d++) {
    // Only show Mon, Wed, Fri for cleaner look (like GitHub)
    if (d % 2 === 1) {
      var labelY = d * (config.cellSize + config.cellGap) + 50 + (config.cellSize / 2) + 3;
      dayLabels += '    <text x="8" y="' + labelY + '" class="day-label">' + days[d] + '</text>\n';
    }
  }
  
  // Month labels with proper spacing
  var monthLabels = '';
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var monthSpacing = gridWidth / 12;
  for (var m = 0; m < 12; m++) {
    var labelX = m * monthSpacing * (config.cellSize + config.cellGap) + 20;
    if (labelX < totalWidth) {
      monthLabels += '    <text x="' + labelX + '" y="40" class="month-label">' + months[m] + '</text>\n';
    }
  }
  
  // Stats with better formatting
  var statsText = '';
  if (options.stats) {
    var stats = options.stats;
    var energyText = 'Energy: ' + (stats.kwhCharged || 0) + 'kWh';
    var sessionText = 'Sessions: ' + (stats.sessions || 0);
    var weatherText = stats.weather ? stats.weather.temp + '°C ' + stats.weather.condition : 'Weather: N/A';
    
    statsText = '    <text x="20" y="' + (svgHeight - 15) + '" class="stats-text">' +
               energyText + ' • ' + sessionText + ' • ' + weatherText +
               '</text>\n';
  }
  
  // Message display at top
  var messageDisplay = '';
  var displayMessage = config.message;
  var messageY = 25;
  
  if (needsScrolling) {
    // For long messages, show scrolling indicator
    messageDisplay = '  <text x="20" y="' + messageY + '" class="title-text">' +
                    'GitGraph: ' + displayMessage.substring(0, 20) + '...' +
                    '</text>\n';
  } else {
    messageDisplay = '  <text x="20" y="' + messageY + '" class="title-text">' +
                    'GitGraph: ' + displayMessage +
                    '</text>\n';
  }
  
  // Build complete SVG with GitHub-authentic styling
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" ' +
           'width="' + svgWidth + '" height="' + svgHeight + '" ' +
           'viewBox="0 0 ' + svgWidth + ' ' + svgHeight + '">\n' +
           '  <defs>\n' +
           '    <style>\n' +
           '      .title-text { \n' +
           '        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif; \n' +
           '        font-size: 14px; font-weight: 600; \n' +
           '        fill: ' + (config.darkMode ? '#f0f6fc' : '#24292f') + '; \n' +
           '      }\n' +
           '      .day-label { \n' +
           '        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; \n' +
           '        font-size: 9px; \n' +
           '        fill: ' + (config.darkMode ? '#7d8590' : '#656d76') + '; \n' +
           '        text-anchor: end; \n' +
           '      }\n' +
           '      .month-label { \n' +
           '        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; \n' +
           '        font-size: 10px; \n' +
           '        fill: ' + (config.darkMode ? '#7d8590' : '#656d76') + '; \n' +
           '      }\n' +
           '      .stats-text { \n' +
           '        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; \n' +
           '        font-size: 9px; \n' +
           '        fill: ' + (config.darkMode ? '#7d8590' : '#9ca3af') + '; \n' +
           '      }\n' +
           '      .background { \n' +
           '        fill: ' + (config.darkMode ? '#0d1117' : '#ffffff') + '; \n' +
           '      }\n' +
           '    </style>\n' +
           '  </defs>\n' +
           '  \n' +
           '  <!-- Background -->\n' +
           '  <rect width="100%" height="100%" class="background" />\n' +
           '  \n' +
           '  <!-- Title -->\n' +
           messageDisplay +
           '  \n' +
           '  <!-- Month Labels -->\n' +
           monthLabels +
           '  \n' +
           '  <!-- Day Labels -->\n' +
           dayLabels +
           '  \n' +
           '  <!-- Background Grid -->\n' +
           backgroundGrid +
           '  \n' +
           '  <!-- Animated Commit Squares -->\n' +
           animatedSquares +
           '  \n' +
           '  <!-- Stats -->\n' +
           statsText +
           '</svg>';
  
  return svg;
}

/**
 * Simulates how a message would appear on GitHub's contribution graph
 */
function previewGitHubMessage(message, containerId, options) {
  var container = document.getElementById(containerId);
  if (!container) return;
  
  var canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }
  
  var pixelData = messageToPixels(message, options);
  renderToCanvas(canvas, pixelData, options);
  
  return {
    pixelData: pixelData,
    getCommitPlan: function() {
      var commits = [];
      var now = new Date();
      var startDate = new Date(now);
      startDate.setDate(startDate.getDate() - (52 * 7));
      
      for (var week = 0; week < pixelData.length; week++) {
        for (var day = 0; day < pixelData[week].length; day++) {
          var intensity = pixelData[week][day];
          if (intensity > 0) {
            var commitDate = new Date(startDate);
            commitDate.setDate(commitDate.getDate() + (week * 7) + day);
            
            for (var i = 0; i < intensity; i++) {
              commits.push({
                date: new Date(commitDate),
                message: 'Auto commit for graph animation (' + message + ')'
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
 * Validate message for GitHub contribution constraints
 */
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
  
  var supportedPattern = /^[A-Z0-9\s!?.,:\-+=()]*$/;
  if (!supportedPattern.test(message.toUpperCase())) {
    return { valid: false, error: 'Message contains unsupported characters' };
  }
  
  return { valid: true };
}

/**
 * Get estimated render width for a message
 */
function getMessageWidth(message) {
  var width = 0;
  var cleanMessage = message.toUpperCase();
  
  for (var i = 0; i < cleanMessage.length; i++) {
    var char = cleanMessage[i];
    
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

// Export all functions (Node.js)
module.exports = {
  messageToPixels: messageToPixels,
  renderToCanvas: renderToCanvas,
  previewGitHubMessage: previewGitHubMessage,
  generateCommitPlan: generateCommitPlan,
  generatePreviewData: generatePreviewData,
  validateMessage: validateMessage,
  getMessageWidth: getMessageWidth,
  renderAnimatedSVG: renderAnimatedSVG, // NEW: SVG Animation function
  PIXEL_FONT: PIXEL_FONT
};