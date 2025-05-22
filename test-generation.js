// test-generation.js - Test message generation

const SmartMessageGenerator = require('./services/messageGenerator');

console.log('🧪 Testing Smart Message Generation...');

const generator = new SmartMessageGenerator({
  maxLength: 30,
  weatherEnabled: true,
  energyEnabled: true
});

// Test different scenarios
const scenarios = [
  {
    name: 'Sunny Day + High Energy',
    weather: { condition: 'Clear', temp: 25, wind: 5, humidity: 60 },
    energy: { kwhCharged: 250, sessions: 80 }
  },
  {
    name: 'Rainy Day + Low Energy', 
    weather: { condition: 'Rain', temp: 15, wind: 12, humidity: 85 },
    energy: { kwhCharged: 15, sessions: 5 }
  },
  {
    name: 'Winter + Medium Energy',
    weather: { condition: 'Snow', temp: -2, wind: 8, humidity: 70 },
    energy: { kwhCharged: 100, sessions: 30 }
  }
];

scenarios.forEach(function(scenario) {
  console.log('\n' + scenario.name + ':');
  const messages = generator.generateMessages(scenario.weather, scenario.energy, 3);
  messages.forEach(function(msg, i) {
    console.log('  ' + (i + 1) + '. ' + msg);
  });
  
  const context = generator.getContextSummary(scenario.weather, scenario.energy);
  console.log('  Context: ' + context);
});

console.log('\n✅ Message generation test complete!');
