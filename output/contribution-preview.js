// Fixed saveSVG function with proper error handling and Node 10 compatibility

const fs = require('fs').promises;
const path = require('path');
const { renderAnimatedSVG, generateCommitPlan } = require('./utils/pixel-preview');

/**
 * Save SVG to file with proper error handling
 */
async function saveSVG(commitPlan, options) {
  try {
    // Set default options
    options = options || {};
    var filename = options.filename || 'contribution-preview.svg';
    var outputDir = options.outputDir || path.join(__dirname, 'output');
    var svgOptions = options.svgOptions || {};
    
    // Ensure output directory exists
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
      // Directory might already exist, that's fine
    }
    
    // Validate commit plan
    if (!commitPlan || !Array.isArray(commitPlan)) {
      throw new Error('Invalid commit plan provided');
    }
    
    if (commitPlan.length === 0) {
      console.log('⚠️ Empty commit plan, creating placeholder SVG');
      commitPlan = [{ x: 0, y: 0, intensity: 1, message: 'EMPTY' }];
    }
    
    // Generate SVG content
    var svg = renderAnimatedSVG(commitPlan, svgOptions);
    
    if (!svg || typeof svg !== 'string') {
      throw new Error('Failed to generate SVG content');
    }
    
    // Write to file
    var outPath = path.join(outputDir, filename);
    await fs.writeFile(outPath, svg, 'utf8');
    
    console.log('✅ SVG saved to:', outPath);
    return outPath;
    
  } catch (err) {
    console.error('❌ Error saving SVG:', err.message);
    throw err; // Re-throw so calling function can handle it
  }
}

/**
 * Generate commit plan and save SVG with comprehensive error handling
 */
async function generateAndSaveSVG(message, options) {
  try {
    // Validate message
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message provided');
    }
    
    console.log('🎨 Generating SVG for message:', message);
    
    // Generate commit plan
    var commitPlan = generateCommitPlan(message);
    
    if (!commitPlan || commitPlan.length === 0) {
      console.log('⚠️ No commit plan generated for message:', message);
      // Still try to create an SVG with placeholder data
      commitPlan = [{ x: 0, y: 0, intensity: 1, message: message }];
    }
    
    // Set up options with message context
    options = options || {};
    var svgOptions = options.svgOptions || {};
    svgOptions.message = message;
    
    // Add timestamp to filename if requested
    var filename = options.filename;
    if (options.addTimestamp) {
      var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      var baseName = filename ? filename.replace('.svg', '') : 'contribution';
      filename = baseName + '_' + timestamp + '.svg';
    }
    
    // Save the SVG
    var savedPath = await saveSVG(commitPlan, {
      filename: filename,
      outputDir: options.outputDir,
      svgOptions: svgOptions
    });
    
    console.log('✨ Successfully generated and saved SVG for:', message);
    return savedPath;
    
  } catch (err) {
    console.error('❌ Error in generateAndSaveSVG:', err.message);
    throw err;
  }
}

/**
 * Batch generate SVGs for multiple messages
 */
async function generateMultipleSVGs(messages, options) {
  try {
    options = options || {};
    var results = [];
    
    console.log('🔄 Generating SVGs for', messages.length, 'messages...');
    
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      try {
        var savedPath = await generateAndSaveSVG(message, {
          filename: 'contribution_' + (i + 1) + '_' + message.replace(/[^A-Z0-9]/g, '_') + '.svg',
          outputDir: options.outputDir,
          svgOptions: options.svgOptions
        });
        
        results.push({
          message: message,
          path: savedPath,
          success: true
        });
        
      } catch (err) {
        console.error('❌ Failed to generate SVG for message:', message, err.message);
        results.push({
          message: message,
          error: err.message,
          success: false
        });
      }
    }
    
    var successCount = results.filter(function(r) { return r.success; }).length;
    console.log('✅ Generated', successCount, 'of', messages.length, 'SVGs successfully');
    
    return results;
    
  } catch (err) {
    console.error('❌ Error in batch SVG generation:', err.message);
    throw err;
  }
}

/**
 * Save SVG with automatic backup/versioning
 */
async function saveSVGWithBackup(commitPlan, options) {
  try {
    options = options || {};
    var filename = options.filename || 'contribution-preview.svg';
    var outputDir = options.outputDir || path.join(__dirname, 'output');
    var backupDir = path.join(outputDir, 'backup');
    
    // Ensure directories exist
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(backupDir, { recursive: true });
    
    var mainPath = path.join(outputDir, filename);
    
    // If file exists, create backup
    try {
      await fs.access(mainPath);
      var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      var backupFilename = filename.replace('.svg', '_backup_' + timestamp + '.svg');
      var backupPath = path.join(backupDir, backupFilename);
      
      var existingContent = await fs.readFile(mainPath, 'utf8');
      await fs.writeFile(backupPath, existingContent, 'utf8');
      console.log('📁 Backed up existing SVG to:', backupPath);
    } catch (err) {
      // File doesn't exist yet, no backup needed
    }
    
    // Save new SVG
    return await saveSVG(commitPlan, options);
    
  } catch (err) {
    console.error('❌ Error in saveSVGWithBackup:', err.message);
    throw err;
  }
}

// Example usage functions for testing
async function testSVGGeneration() {
  try {
    // Test single message
    await generateAndSaveSVG('HELLO WORLD', {
      svgOptions: {
        darkMode: false,
        animationDuration: 2,
        staggerDelay: 0.1
      }
    });
    
    // Test with timestamp
    await generateAndSaveSVG('TEST MSG', {
      addTimestamp: true,
      svgOptions: { darkMode: true }
    });
    
    // Test batch generation
    await generateMultipleSVGs(['CODE', 'BUILD', 'DEPLOY'], {
      svgOptions: { animationDuration: 1.5 }
    });
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

// Export functions
module.exports = {
  saveSVG: saveSVG,
  generateAndSaveSVG: generateAndSaveSVG,
  generateMultipleSVGs: generateMultipleSVGs,
  saveSVGWithBackup: saveSVGWithBackup,
  testSVGGeneration: testSVGGeneration
};

// Example integration with your existing server.js
// Replace your renderSVG function with this:
async function renderSVG(message, options) {
  try {
    console.log('🎨 Rendering animated SVG for:', message);
    
    var svgOptions = options || {};
    svgOptions.message = message;
    
    // Add stats if available (pass them as parameter)
    if (options && options.stats) {
      svgOptions.stats = options.stats;
    }
    
    var savedPath = await generateAndSaveSVG(message, {
      filename: 'contribution-preview.svg',
      svgOptions: svgOptions
    });
    
    // Also save with timestamp for history
    await generateAndSaveSVG(message, {
      filename: message.replace(/[^A-Z0-9]/g, '_') + '_' + Date.now() + '.svg',
      outputDir: path.join(__dirname, 'output', 'history'),
      svgOptions: svgOptions
    });
    
    console.log('🖼️ Animated SVG rendered successfully');
    return true;
    
  } catch (err) {
    console.error('❌ SVG render failed:', err.message);
    return false;
  }
}