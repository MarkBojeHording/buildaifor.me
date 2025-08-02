/**
 * Configuration-Driven Case Management System
 * Allows scaling and modification without code changes
 */

export const CASE_CONFIG = {
  // Practice Areas Configuration
  practiceAreas: {
    'personal-injury': {
      enabled: true,
      patterns: 'personalInjuryPatterns',
      scoreRange: [20, 100],
      attorneys: ['Junior Attorney', 'Associate Attorney', 'Senior Attorney', 'Senior Partner'],
      defaultAttorney: 'Associate Attorney'
    },
    'criminal-defense': {
      enabled: true,
      patterns: 'criminalDefensePatterns',
      scoreRange: [30, 90],
      attorneys: ['Associate Attorney', 'Senior Attorney', 'Senior Partner'],
      defaultAttorney: 'Senior Attorney'
    },
    'family-law': {
      enabled: false, // Can enable new practice areas
      patterns: 'familyLawPatterns',
      scoreRange: [25, 85],
      attorneys: ['Associate Attorney', 'Senior Attorney'],
      defaultAttorney: 'Associate Attorney'
    },
    'business-law': {
      enabled: false,
      patterns: 'businessLawPatterns',
      scoreRange: [40, 95],
      attorneys: ['Senior Attorney', 'Senior Partner'],
      defaultAttorney: 'Senior Attorney'
    }
  },

  // Attorney Routing Configuration
  attorneys: {
    'Junior Attorney': {
      minScore: 20,
      maxScore: 44,
      specialties: ['general', 'property-damage'],
      availability: 'standard'
    },
    'Associate Attorney': {
      minScore: 45,
      maxScore: 64,
      specialties: ['personal-injury', 'criminal-defense', 'family-law'],
      availability: 'standard'
    },
    'Senior Attorney': {
      minScore: 65,
      maxScore: 79,
      specialties: ['personal-injury', 'criminal-defense', 'complex-cases'],
      availability: 'high'
    },
    'Senior Partner': {
      minScore: 80,
      maxScore: 100,
      specialties: ['high-value-cases', 'complex-litigation', 'settlement-negotiation'],
      availability: 'premium'
    }
  },

  // Urgency Levels Configuration
  urgencyLevels: {
    low: {
      threshold: 40,
      emoji: '',
      priority: 1,
      responseTime: '24 hours',
      escalation: false
    },
    medium: {
      threshold: 65,
      emoji: '⚡',
      priority: 2,
      responseTime: '4 hours',
      escalation: false
    },
    high: {
      threshold: 80,
      emoji: '🚨',
      priority: 3,
      responseTime: '1 hour',
      escalation: true
    }
  },

  // Scoring Configuration
  scoring: {
    // Base multipliers for different factors
    multipliers: {
      'drunk driver': 1.5,
      'rear-end': 1.3,
      'emergency room': 1.2,
      'surgery': 1.4,
      'lost wages': 1.25,
      'first offense': 1.3,
      'clear liability': 1.2
    },

    // Penalty factors
    penalties: {
      'no injuries': 0.5,
      'minor damage': 0.7,
      'repeat offense': 0.6,
      'uncooperative': 0.8
    },

    // Consistency rules
    consistency: {
      maxDecrease: 0.2, // Maximum 20% decrease
      minIncrease: 0.05, // Minimum 5% increase for new info
      stabilityThreshold: 0.8 // 80% confidence for stable scores
    }
  },

  // Response Configuration
  responses: {
    // Legal disclaimer (shown only once)
    legalDisclaimer: "This communication does not create an attorney-client relationship. For legal advice, please consult with an attorney.",

    // Response length limits
    maxLength: 150,
    minLength: 20,

    // Tone settings
    tone: {
      professional: true,
      empathetic: true,
      urgent: true,
      conversational: true
    },

    // Question frequency
    questionsPerResponse: 1,
    questionPlacement: 'end'
  },

  // Business Intelligence Configuration
  businessIntelligence: {
    // Revenue potential mapping
    revenueMapping: {
      95: '$100k-$500k+',
      85: '$75k-$200k',
      75: '$50k-$150k',
      65: '$25k-$100k',
      55: '$15k-$75k',
      45: '$10k-$50k',
      35: '$5k-$25k',
      25: '$2k-$15k',
      15: '$1k-$10k'
    },

    // Priority levels
    priorityLevels: {
      'HIGH VALUE': { minScore: 80, color: 'red', action: 'immediate' },
      'MEDIUM': { minScore: 60, color: 'yellow', action: 'schedule' },
      'STANDARD': { minScore: 40, color: 'blue', action: 'monitor' },
      'LOW': { minScore: 20, color: 'gray', action: 'gather' }
    },

    // Action recommendations
    actions: {
      'immediate': 'Route to senior attorney immediately',
      'schedule': 'Schedule consultation within 24 hours',
      'monitor': 'Continue qualification and monitoring',
      'gather': 'Gather more information'
    }
  },

  // Learning System Configuration
  learning: {
    // Feedback collection
    collectFeedback: true,
    feedbackThreshold: 0.7, // Collect feedback if accuracy < 70%

    // Pattern optimization
    optimizePatterns: true,
    optimizationInterval: 'weekly',

    // Performance tracking
    trackMetrics: true,
    metrics: ['accuracy', 'conversion', 'satisfaction', 'response_time']
  },

  // System Configuration
  system: {
    // Conversation management
    maxConversationAge: 24 * 60 * 60 * 1000, // 24 hours
    maxActiveConversations: 1000,

    // Performance settings
    cacheEnabled: true,
    cacheTimeout: 300000, // 5 minutes

    // Logging
    logLevel: 'info',
    logConversations: true,
    logAnalysis: true
  }
};

// Dynamic configuration updates
export class ConfigManager {
  static updateConfig(path, value) {
    const keys = path.split('.');
    let current = CASE_CONFIG;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    return true;
  }

  static getConfig(path) {
    const keys = path.split('.');
    let current = CASE_CONFIG;

    for (const key of keys) {
      if (current[key] === undefined) return null;
      current = current[key];
    }

    return current;
  }

  static enablePracticeArea(area) {
    if (CASE_CONFIG.practiceAreas[area]) {
      CASE_CONFIG.practiceAreas[area].enabled = true;
      return true;
    }
    return false;
  }

  static disablePracticeArea(area) {
    if (CASE_CONFIG.practiceAreas[area]) {
      CASE_CONFIG.practiceAreas[area].enabled = false;
      return true;
    }
    return false;
  }

  static addAttorney(name, config) {
    CASE_CONFIG.attorneys[name] = config;
    return true;
  }

  static updateScoringMultiplier(factor, multiplier) {
    CASE_CONFIG.scoring.multipliers[factor] = multiplier;
    return true;
  }
}

export default CASE_CONFIG;
