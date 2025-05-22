// utils/pixel-preview.js - Complete Node 10 Compatible Version (FIXED)

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
          message: message
        });
      }
    }
  }
  
  return commits;
}

/**
 * Generate preview data for frontend (THIS WAS MISSING!)
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
  generatePreviewData: generatePreviewData,  // THIS WAS THE MISSING FUNCTION!
  validateMessage: validateMessage,
  getMessageWidth: getMessageWidth,
  PIXEL_FONT: PIXEL_FONT
};