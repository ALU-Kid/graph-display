// services/messageGenerator.js - Node 10 Compatible Smart Message Generator

class SmartMessageGenerator {
  constructor(options) {
    options = options || {};
    this.options = {
      maxLength: options.maxLength || 30,
      minLength: options.minLength || 3,
      weatherEnabled: options.weatherEnabled !== false,
      energyEnabled: options.energyEnabled !== false,
      timeEnabled: options.timeEnabled !== false
    };
    
    this.templates = {
      weather: {
        sunny: [
          'SUNNY CODING DAY',
          'BRIGHT CODE AHEAD',
          'SOLAR POWERED DEV',
          'SUNSHINE SYNTAX',
          'CLEAR SKIES CLEAN CODE',
          'BRIGHT IDEAS BRIGHT DAY',
          'SUN IS UP CODE IS UP'
        ],
        cloudy: [
          'CLOUDY WITH CODE',
          'OVERCAST CODING',
          'GRAY SKY GREAT CODE',
          'CLOUDY BUT PRODUCTIVE',
          'SOFT LIGHT SHARP CODE',
          'MOODY WEATHER GOOD CODE'
        ],
        rainy: [
          'RAINY DAY CODING',
          'WET WEATHER WARM CODE',
          'RAIN DROPS CODE DROPS',
          'STORMY SOLUTIONS',
          'CODING IN THE RAIN',
          'SPLASH OF INSPIRATION'
        ],
        cold: [
          'COLD OUTSIDE HOT CODE',
          'WINTER CODING SEASON',
          'FROSTY FUNCTIONS',
          'CHILL CODE VIBES',
          'COLD BREW COLD WEATHER',
          'WINTER WONDERCODE'
        ],
        windy: [
          'WINDY CODE WEATHER',
          'BREEZY DEBUGGING',
          'WIND POWERED WORK',
          'GUSTY GIT COMMITS'
        ]
      },
      energy: {
        high: [
          'CHARGED UP CODING',
          'FULL BATTERY CODE',
          'ENERGIZED ENGINEER',
          'POWER PACKED DEV',
          'HIGH VOLTAGE CODING',
          'SUPERCHARGED SESSION',
          'ELECTRIC ENERGY'
        ],
        medium: [
          'STEADY ENERGY FLOW',
          'BALANCED POWER MODE',
          'EFFICIENT CODING',
          'SUSTAINABLE SOLUTIONS',
          'STEADY AS SHE CODES',
          'CONSISTENT COMMITS'
        ],
        low: [
          'LOW POWER HIGH FOCUS',
          'CONSERVING ENERGY',
          'MINIMAL POWER MAX CODE',
          'BATTERY SAVER MODE',
          'QUIET EFFICIENCY',
          'LOW KEY HIGH VALUE'
        ],
        milestone: [
          'ENERGY MILESTONE HIT',
          'POWER LEVEL ACHIEVED',
          'CHARGING COMPLETE',
          'BATTERY MILESTONE',
          'ENERGY GOAL REACHED'
        ]
      },
      time: {
        morning: [
          'MORNING MOTIVATION',
          'EARLY BIRD CODES',
          'AM ALGORITHMS',
          'SUNRISE SOLUTIONS',
          'DAWN OF NEW CODE',
          'MORNING COFFEE CODING',
          'FRESH START FRESH CODE'
        ],
        afternoon: [
          'AFTERNOON PROGRESS',
          'MIDDAY MOMENTUM',
          'PM PRODUCTIVITY',
          'NOON INNOVATIONS',
          'LUNCH BREAK OVER',
          'AFTERNOON FLOW STATE'
        ],
        evening: [
          'EVENING EXCELLENCE',
          'TWILIGHT CODING',
          'SUNSET SYNTAX',
          'NIGHT MODE ON',
          'GOLDEN HOUR CODING',
          'EVENING PRODUCTIVITY'
        ],
        weekend: [
          'WEEKEND WARRIOR',
          'SATURDAY SOLUTIONS',
          'SUNDAY FUNDAY CODE',
          'WEEKEND PROJECT TIME',
          'NO REST FOR DEVS',
          'WEEKEND HUSTLE'
        ]
      },
      seasonal: {
        spring: [
          'SPRING INTO CODE',
          'BLOOMING ALGORITHMS',
          'FRESH CODE GROWTH',
          'SPRING CLEANING CODE',
          'NEW BEGINNINGS',
          'APRIL SHOWERS MAY CODE'
        ],
        summer: [
          'HOT CODE SUMMER',
          'SUMMER CODING HEAT',
          'VACATION MODE OFF',
          'SUNSHINE STATE CODE',
          'SUMMER SPRINT MODE',
          'HOT WEATHER HOT CODE'
        ],
        autumn: [
          'FALL INTO CODING',
          'AUTUMN ALGORITHMS',
          'LEAVES FALL CODE RISES',
          'HARVEST CODE SEASON',
          'OCTOBER OPTIMIZATION',
          'AUTUMN PRODUCTIVITY'
        ],
        winter: [
          'WINTER CODE SEASON',
          'DECEMBER DEVELOPMENT',
          'COLD WEATHER WARM CODE',
          'HOLIDAY HACKATHON',
          'WINTER WONDERCODE',
          'COZY CODING TIME'
        ]
      },
      general: [
        'PUSH TO PRODUCTION',
        'COMMIT TO EXCELLENCE',
        'MERGE WITH SUCCESS',
        'DEBUGGING LIFE',
        'FEATURE COMPLETE',
        'CODE REVIEW APPROVED',
        'TESTS ARE PASSING',
        'DEPLOY WITH CONFIDENCE',
        'CLEAN CODE CLEAN MIND',
        'DRY PRINCIPLES APPLY',
        'SOLID FOUNDATIONS',
        'REFACTOR EVERYTHING',
        'OPTIMIZE ALL THE THINGS',
        'SCALABLE SOLUTIONS',
        'MICROSERVICES MINDSET',
        'API FIRST APPROACH',
        'CONTINUOUS INTEGRATION',
        'AGILE METHODOLOGY',
        'SHIP IT FRIDAY',
        'HOTFIX MONDAY'
      ],
      motivational: [
        'NEVER STOP LEARNING',
        'CODE LIKE POETRY',
        'BUILD THE FUTURE',
        'ITERATE TO GREATNESS',
        'FAIL FAST LEARN FASTER',
        'MVPS FOR THE WIN',
        'SHIP EARLY SHIP OFTEN',
        'PERFECTION IS THE ENEMY',
        'DONE IS BETTER THAN PERFECT',
        'PROGRESS OVER PERFECTION'
      ],
      technical: [
        'ASYNC AWAIT LIFE',
        'TRY CATCH EVERYTHING',
        'NULL POINTER EXCEPTION',
        'MEMORY LEAK DETECTED',
        'STACK OVERFLOW HELP',
        'RECURSION BASE CASE',
        'BIG O NOTATION MATTERS',
        'CACHE INVALIDATION HARD',
        'TWO HARD PROBLEMS',
        'NAMING THINGS IS HARD'
      ]
    };
    
    this.recentMessages = [];
    this.maxRecentMessages = 50;
  }
  
  generateMessages(weatherData, energyData, count) {
    count = count || 5;
    var messages = [];
    var contexts = this.analyzeContext(weatherData, energyData);
    
    console.log('🔍 Analysis context:', JSON.stringify(contexts, null, 2));
    
    for (var i = 0; i < count; i++) {
      var attempts = 0;
      var message;
      
      do {
        message = this.generateSingleMessage(contexts);
        attempts++;
      } while (this.isRecentMessage(message) && attempts < 15);
      
      if (message && !this.isRecentMessage(message)) {
        messages.push(message);
        this.addToRecentMessages(message);
      }
    }
    
    return messages;
  }
  
  analyzeContext(weatherData, energyData) {
    var context = {
      weather: this.analyzeWeather(weatherData),
      energy: this.analyzeEnergy(energyData),
      time: this.analyzeTime(),
      season: this.analyzeSeason()
    };
    
    return context;
  }
  
  analyzeWeather(weatherData) {
    if (!weatherData || !this.options.weatherEnabled) {
      return null;
    }
    
    var condition = (weatherData.condition || '').toLowerCase();
    var temp = weatherData.temp || 0;
    var wind = weatherData.wind || 0;
    
    // Determine weather type
    if (condition.indexOf('sun') !== -1 || condition.indexOf('clear') !== -1) {
      return { type: 'sunny', temp: temp };
    } else if (condition.indexOf('cloud') !== -1 || condition.indexOf('overcast') !== -1) {
      return { type: 'cloudy', temp: temp };
    } else if (condition.indexOf('rain') !== -1 || condition.indexOf('drizzle') !== -1 || condition.indexOf('storm') !== -1) {
      return { type: 'rainy', temp: temp };
    } else if (wind > 15) {
      return { type: 'windy', temp: temp };
    } else if (temp < 5) {
      return { type: 'cold', temp: temp };
    }
    
    return { type: 'sunny', temp: temp };
  }
  
  analyzeEnergy(energyData) {
    if (!energyData || !this.options.energyEnabled) {
      return null;
    }
    
    var kwh = energyData.kwhCharged || 0;
    var sessions = energyData.sessions || 0;
    
    // Determine energy level
    var level = 'medium';
    if (kwh > 200 || sessions > 75) {
      level = 'high';
    } else if (kwh < 20 || sessions < 10) {
      level = 'low';
    }
    
    // Check for milestones
    var milestones = this.checkEnergyMilestones(kwh, sessions);
    
    return {
      level: level,
      kwh: kwh,
      sessions: sessions,
      milestones: milestones,
      efficiency: sessions > 0 ? Math.round((kwh / sessions) * 100) / 100 : 0
    };
  }
  
  analyzeTime() {
    if (!this.options.timeEnabled) {
      return null;
    }
    
    var now = new Date();
    var hour = now.getHours();
    var day = now.getDay();
    
    var period = 'morning';
    if (hour >= 12 && hour < 17) {
      period = 'afternoon';
    } else if (hour >= 17) {
      period = 'evening';
    }
    
    var isWeekend = day === 0 || day === 6;
    
    return {
      period: period,
      hour: hour,
      isWeekend: isWeekend,
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
    };
  }
  
  analyzeSeason() {
    var now = new Date();
    var month = now.getMonth() + 1; // getMonth() returns 0-11
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }
  
  checkEnergyMilestones(kwh, sessions) {
    var milestones = [];
    
    // kWh milestones (check if recently achieved)
    var kwhMilestones = [50, 100, 250, 500, 1000, 2000];
    for (var i = 0; i < kwhMilestones.length; i++) {
      var milestone = kwhMilestones[i];
      if (kwh >= milestone && kwh < milestone + 25) {
        milestones.push(milestone + 'KWH');
      }
    }
    
    // Session milestones
    var sessionMilestones = [25, 50, 100, 250, 500, 1000];
    for (var j = 0; j < sessionMilestones.length; j++) {
      var sessionMilestone = sessionMilestones[j];
      if (sessions >= sessionMilestone && sessions < sessionMilestone + 10) {
        milestones.push(sessionMilestone + 'SESSIONS');
      }
    }
    
    return milestones;
  }
  
  generateSingleMessage(contexts) {
    var strategies = [];
    
    // Weather-based messages
    if (contexts.weather && this.templates.weather[contexts.weather.type]) {
      strategies.push({ type: 'weather', weight: 4 });
    }
    
    // Energy-based messages
    if (contexts.energy) {
      if (contexts.energy.milestones.length > 0) {
        strategies.push({ type: 'energy_milestone', weight: 6 });
      } else {
        strategies.push({ type: 'energy', weight: 3 });
      }
    }
    
    // Time-based messages
    if (contexts.time) {
      strategies.push({ type: 'time', weight: 2 });
      if (contexts.time.isWeekend) {
        strategies.push({ type: 'weekend', weight: 3 });
      }
    }
    
    // Seasonal messages
    if (contexts.season) {
      strategies.push({ type: 'seasonal', weight: 2 });
    }
    
    // Always include general options
    strategies.push({ type: 'general', weight: 3 });
    strategies.push({ type: 'motivational', weight: 2 });
    strategies.push({ type: 'technical', weight: 2 });
    
    var strategy = this.weightedRandomSelect(strategies);
    
    switch (strategy.type) {
      case 'weather':
        return this.generateWeatherMessage(contexts.weather);
      case 'energy':
        return this.generateEnergyMessage(contexts.energy);
      case 'energy_milestone':
        return this.generateMilestoneMessage(contexts.energy);
      case 'time':
        return this.generateTimeMessage(contexts.time);
      case 'weekend':
        return this.generateWeekendMessage();
      case 'seasonal':
        return this.generateSeasonalMessage(contexts.season);
      case 'motivational':
        return this.randomSelect(this.templates.motivational);
      case 'technical':
        return this.randomSelect(this.templates.technical);
      case 'general':
      default:
        return this.randomSelect(this.templates.general);
    }
  }
  
  generateWeatherMessage(weather) {
    var templates = this.templates.weather[weather.type] || this.templates.weather.sunny;
    var baseMessage = this.randomSelect(templates);
    
    // Sometimes add temperature info (20% chance)
    if (Math.random() < 0.2 && weather.temp) {
      var tempMessages = [
        Math.round(weather.temp) + 'C CODING DAY',
        'CODING AT ' + Math.round(weather.temp) + 'C'
      ];
      return this.randomSelect(tempMessages);
    }
    
    return baseMessage;
  }
  
  generateEnergyMessage(energy) {
    var templates = this.templates.energy[energy.level];
    var baseMessage = this.randomSelect(templates);
    
    // Sometimes add specific numbers (25% chance)
    if (Math.random() < 0.25 && energy.kwh > 0) {
      var variations = [
        Math.round(energy.kwh) + 'KWH POWERED',
        energy.sessions + ' CHARGES STRONG',
        'EFFICIENCY ' + energy.efficiency + 'KWH'
      ];
      return this.randomSelect(variations);
    }
    
    return baseMessage;
  }
  
  generateMilestoneMessage(energy) {
    if (energy.milestones.length > 0) {
      var milestone = energy.milestones[0];
      return milestone + ' ACHIEVED';
    }
    return this.randomSelect(this.templates.energy.milestone);
  }
  
  generateTimeMessage(time) {
    var templates = this.templates.time[time.period];
    return this.randomSelect(templates);
  }
  
  generateWeekendMessage() {
    var templates = this.templates.time.weekend;
    return this.randomSelect(templates);
  }
  
  generateSeasonalMessage(season) {
    var templates = this.templates.seasonal[season];
    return this.randomSelect(templates);
  }
  
  weightedRandomSelect(items) {
    var totalWeight = 0;
    for (var i = 0; i < items.length; i++) {
      totalWeight += items[i].weight;
    }
    
    var random = Math.random() * totalWeight;
    
    for (var j = 0; j < items.length; j++) {
      random -= items[j].weight;
      if (random <= 0) {
        return items[j];
      }
    }
    
    return items[items.length - 1];
  }
  
  randomSelect(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  isRecentMessage(message) {
    return this.recentMessages.indexOf(message) !== -1;
  }
  
  addToRecentMessages(message) {
    this.recentMessages.push(message);
    
    if (this.recentMessages.length > this.maxRecentMessages) {
      this.recentMessages.shift(); // Remove oldest
    }
  }
  
  validateMessage(message) {
    if (!message || typeof message !== 'string') {
      return { valid: false, error: 'Message must be a string' };
    }
    
    if (message.length > this.options.maxLength) {
      return { valid: false, error: 'Message too long (max ' + this.options.maxLength + ')' };
    }
    
    if (message.length < this.options.minLength) {
      return { valid: false, error: 'Message too short (min ' + this.options.minLength + ')' };
    }
    
    // Check for unsupported characters (Node 10 compatible regex)
    var supportedPattern = /^[A-Z0-9\s!?.,:\-+=()]*$/;
    if (!supportedPattern.test(message)) {
      return { valid: false, error: 'Message contains unsupported characters' };
    }
    
    return { valid: true };
  }
  
  // Get context summary for debugging
  getContextSummary(weatherData, energyData) {
    var contexts = this.analyzeContext(weatherData, energyData);
    var summary = [];
    
    if (contexts.weather) {
      summary.push('Weather: ' + contexts.weather.type + ' (' + contexts.weather.temp + '°C)');
    }
    
    if (contexts.energy) {
      summary.push('Energy: ' + contexts.energy.level + ' (' + contexts.energy.kwh + 'kWh, ' + contexts.energy.sessions + ' sessions)');
      if (contexts.energy.milestones.length > 0) {
        summary.push('Milestones: ' + contexts.energy.milestones.join(', '));
      }
    }
    
    if (contexts.time) {
      summary.push('Time: ' + contexts.time.period + (contexts.time.isWeekend ? ' (weekend)' : ''));
    }
    
    if (contexts.season) {
      summary.push('Season: ' + contexts.season);
    }
    
    return summary.join(', ');
  }
}

// Validation function for external use
function validateMessage(message) {
  var generator = new SmartMessageGenerator();
  return generator.validateMessage(message);
}

module.exports = SmartMessageGenerator;
module.exports.validateMessage = validateMessage;// services/messageGenerator.js - Node 10 Compatible Version

class SmartMessageGenerator {
  constructor(options) {
    options = options || {};
    this.options = {
      maxLength: options.maxLength || 30,
      minLength: options.minLength || 3,
      weatherEnabled: options.weatherEnabled !== false,
      energyEnabled: options.energyEnabled !== false,
      timeEnabled: options.timeEnabled !== false
    };
    
    this.templates = {
      weather: {
        sunny: [
          'SUNNY CODING DAY',
          'BRIGHT CODE AHEAD',
          'SOLAR POWERED DEV',
          'SUNSHINE SYNTAX'
        ],
        cloudy: [
          'CLOUDY WITH CODE',
          'OVERCAST CODING',
          'GRAY SKY GREAT CODE',
          'CLOUDY BUT PRODUCTIVE'
        ],
        rainy: [
          'RAINY DAY CODING',
          'WET WEATHER WARM CODE',
          'RAIN DROPS CODE DROPS',
          'STORMY SOLUTIONS'
        ],
        cold: [
          'COLD OUTSIDE HOT CODE',
          'WINTER CODING',
          'FROSTY FUNCTIONS',
          'CHILL CODE VIBES'
        ]
      },
      energy: {
        high: [
          'CHARGED UP CODING',
          'FULL BATTERY CODE',
          'ENERGIZED ENGINEER',
          'POWER PACKED'
        ],
        medium: [
          'STEADY ENERGY FLOW',
          'BALANCED POWER',
          'EFFICIENT CODING',
          'SUSTAINABLE SOLUTIONS'
        ],
        low: [
          'LOW POWER HIGH FOCUS',
          'CONSERVING ENERGY',
          'MINIMAL POWER MAX CODE',
          'BATTERY SAVER MODE'
        ]
      },
      time: {
        morning: [
          'MORNING MOTIVATION',
          'EARLY BIRD CODES',
          'AM ALGORITHMS',
          'SUNRISE SOLUTIONS'
        ],
        afternoon: [
          'AFTERNOON PROGRESS',
          'MIDDAY MOMENTUM',
          'PM PRODUCTIVITY',
          'NOON INNOVATIONS'
        ],
        evening: [
          'EVENING EXCELLENCE',
          'TWILIGHT CODING',
          'SUNSET SYNTAX',
          'NIGHT MODE ON'
        ]
      },
      general: [
        'PUSH TO PRODUCTION',
        'COMMIT TO EXCELLENCE',
        'MERGE WITH SUCCESS',
        'DEBUGGING LIFE',
        'FEATURE COMPLETE',
        'CODE REVIEW APPROVED',
        'TESTS ARE PASSING',
        'DEPLOY CONFIDENCE',
        'CLEAN CODE MIND',
        'DRY PRINCIPLES'
      ]
    };
    
    this.recentMessages = [];
    this.maxRecentMessages = 20;
  }
  
  generateMessages(weatherData, energyData, count) {
    count = count || 5;
    var messages = [];
    var contexts = this.analyzeContext(weatherData, energyData);
    
    for (var i = 0; i < count; i++) {
      var attempts = 0;
      var message;
      
      do {
        message = this.generateSingleMessage(contexts);
        attempts++;
      } while (this.isRecentMessage(message) && attempts < 10);
      
      if (message && !this.isRecentMessage(message)) {
        messages.push(message);
        this.addToRecentMessages(message);
      }
    }
    
    return messages;
  }
  
  analyzeContext(weatherData, energyData) {
    var context = {
      weather: this.analyzeWeather(weatherData),
      energy: this.analyzeEnergy(energyData),
      time: this.analyzeTime()
    };
    
    return context;
  }
  
  analyzeWeather(weatherData) {
    if (!weatherData || !this.options.weatherEnabled) {
      return null;
    }
    
    var condition = (weatherData.condition || '').toLowerCase();
    var temp = weatherData.temp || 0;
    
    if (condition.indexOf('sun') !== -1 || condition.indexOf('clear') !== -1) {
      return { type: 'sunny' };
    } else if (condition.indexOf('cloud') !== -1 || condition.indexOf('overcast') !== -1) {
      return { type: 'cloudy' };
    } else if (condition.indexOf('rain') !== -1 || condition.indexOf('storm') !== -1) {
      return { type: 'rainy' };
    } else if (temp < 5) {
      return { type: 'cold' };
    }
    
    return { type: 'sunny' }; // Default
  }
  
  analyzeEnergy(energyData) {
    if (!energyData || !this.options.energyEnabled) {
      return null;
    }
    
    var kwh = energyData.kwhCharged || 0;
    var sessions = energyData.sessions || 0;
    
    var level = 'medium';
    if (kwh > 100 || sessions > 50) {
      level = 'high';
    } else if (kwh < 10 || sessions < 5) {
      level = 'low';
    }
    
    return {
      level: level,
      kwh: kwh,
      sessions: sessions
    };
  }
  
  analyzeTime() {
    if (!this.options.timeEnabled) {
      return null;
    }
    
    var now = new Date();
    var hour = now.getHours();
    
    var period = 'morning';
    if (hour >= 12 && hour < 17) {
      period = 'afternoon';
    } else if (hour >= 17) {
      period = 'evening';
    }
    
    return { period: period };
  }
  
  generateSingleMessage(contexts) {
    var strategies = [];
    
    if (contexts.weather && this.templates.weather[contexts.weather.type]) {
      strategies.push({ type: 'weather', weight: 3 });
    }
    
    if (contexts.energy) {
      strategies.push({ type: 'energy', weight: 3 });
    }
    
    if (contexts.time) {
      strategies.push({ type: 'time', weight: 2 });
    }
    
    strategies.push({ type: 'general', weight: 2 });
    
    var strategy = this.weightedRandomSelect(strategies);
    
    switch (strategy.type) {
      case 'weather':
        return this.generateWeatherMessage(contexts.weather);
      case 'energy':
        return this.generateEnergyMessage(contexts.energy);
      case 'time':
        return this.generateTimeMessage(contexts.time);
      case 'general':
        return this.randomSelect(this.templates.general);
      default:
        return this.randomSelect(this.templates.general);
    }
  }
  
  generateWeatherMessage(weather) {
    var templates = this.templates.weather[weather.type] || this.templates.weather.sunny;
    return this.randomSelect(templates);
  }
  
  generateEnergyMessage(energy) {
    var templates = this.templates.energy[energy.level];
    var baseMessage = this.randomSelect(templates);
    
    // Sometimes add specific numbers (30% chance)
    if (Math.random() < 0.3 && energy.kwh > 0) {
      var variations = [
        energy.kwh + 'KWH POWERED',
        energy.sessions + ' CHARGES STRONG'
      ];
      return this.randomSelect(variations);
    }
    
    return baseMessage;
  }
  
  generateTimeMessage(time) {
    var templates = this.templates.time[time.period];
    return this.randomSelect(templates);
  }
  
  weightedRandomSelect(items) {
    var totalWeight = 0;
    for (var i = 0; i < items.length; i++) {
      totalWeight += items[i].weight;
    }
    
    var random = Math.random() * totalWeight;
    
    for (var j = 0; j < items.length; j++) {
      random -= items[j].weight;
      if (random <= 0) {
        return items[j];
      }
    }
    
    return items[items.length - 1];
  }
  
  randomSelect(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  isRecentMessage(message) {
    return this.recentMessages.indexOf(message) !== -1;
  }
  
  addToRecentMessages(message) {
    this.recentMessages.push(message);
    
    if (this.recentMessages.length > this.maxRecentMessages) {
      this.recentMessages.shift(); // Remove oldest
    }
  }
  
  validateMessage(message) {
    if (!message || typeof message !== 'string') {
      return { valid: false, error: 'Message must be a string' };
    }
    
    if (message.length > this.options.maxLength) {
      return { valid: false, error: 'Message too long (max ' + this.options.maxLength + ')' };
    }
    
    if (message.length < this.options.minLength) {
      return { valid: false, error: 'Message too short (min ' + this.options.minLength + ')' };
    }
    
    // Check for unsupported characters (Node 10 compatible regex)
    var supportedPattern = /^[A-Z0-9\s!?.,:\-+=()]*$/;
    if (!supportedPattern.test(message)) {
      return { valid: false, error: 'Message contains unsupported characters' };
    }
    
    return { valid: true };
  }
}

module.exports = SmartMessageGenerator;