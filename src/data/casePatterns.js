// Comprehensive Case Pattern Database
// Replaces hard-coded rules with scalable, data-driven pattern matching

export const CASE_PATTERNS = {
  // High-Value Patterns (80-100 score)
  highValue: [
    {
      pattern: "drunk driver + rear-end + medical treatment",
      baseScore: 85,
      caseStrength: "Very Strong",
      attorney: "Senior Partner",
      keywords: ["drunk", "dui", "intoxicated", "rear-end", "medical", "hospital"],
      multipliers: {
        "emergency room": 1.2,
        "surgery": 1.5,
        "specialist": 1.3,
        "missed work": 1.2,
        "lost wages": 1.25
      },
      practiceArea: "personal_injury",
      urgency: "high"
    },
    {
      pattern: "clear liability + serious injury + lost wages",
      baseScore: 80,
      caseStrength: "Very Strong",
      attorney: "Senior Partner",
      keywords: ["rear-end", "red light", "stopped", "serious", "surgery", "lost wages"],
      multipliers: {
        "emergency room": 1.15,
        "surgery": 1.4,
        "specialist": 1.25,
        "missed work": 1.2
      },
      practiceArea: "personal_injury",
      urgency: "high"
    },
    {
      pattern: "criminal defense + first offense + dui",
      baseScore: 75,
      caseStrength: "Strong",
      attorney: "Senior Attorney",
      keywords: ["dui", "first offense", "first time", "arrested", "criminal"],
      multipliers: {
        "first offense": 1.3,
        "cooperative": 1.2,
        "no prior record": 1.25
      },
      practiceArea: "criminal_defense",
      urgency: "high"
    }
  ],

  // Medium-Value Patterns (60-79 score)
  mediumValue: [
    {
      pattern: "rear-end + medical treatment + minor injuries",
      baseScore: 70,
      caseStrength: "Strong",
      attorney: "Senior Attorney",
      keywords: ["rear-end", "medical", "doctor", "back pain", "neck pain"],
      multipliers: {
        "emergency room": 1.15,
        "specialist": 1.25,
        "physical therapy": 1.1,
        "missed work": 1.15
      },
      practiceArea: "personal_injury",
      urgency: "medium"
    },
    {
      pattern: "slip and fall + medical treatment",
      baseScore: 65,
      caseStrength: "Moderate",
      attorney: "Associate Attorney",
      keywords: ["slip", "fall", "wet floor", "medical", "doctor"],
      multipliers: {
        "emergency room": 1.2,
        "surgery": 1.4,
        "witness": 1.3,
        "photos": 1.2
      },
      practiceArea: "personal_injury",
      urgency: "medium"
    },
    {
      pattern: "criminal defense + misdemeanor + first offense",
      baseScore: 60,
      caseStrength: "Moderate",
      attorney: "Associate Attorney",
      keywords: ["misdemeanor", "first offense", "arrested", "criminal"],
      multipliers: {
        "first offense": 1.2,
        "cooperative": 1.1
      },
      practiceArea: "criminal_defense",
      urgency: "medium"
    }
  ],

  // Low-Value Patterns (20-39 score)
  lowValue: [
    {
      pattern: "minor collision + no injuries + property damage only",
      baseScore: 25,
      caseStrength: "Weak",
      attorney: "Junior Attorney",
      keywords: ["minor", "fender bender", "no injuries", "property damage"],
      multipliers: {},
      practiceArea: "personal_injury",
      urgency: "low"
    },
    {
      pattern: "general inquiry + no specific case",
      baseScore: 20,
      caseStrength: "Very Weak",
      attorney: "Junior Attorney",
      keywords: ["hello", "hi", "help", "question"],
      multipliers: {},
      practiceArea: "general",
      urgency: "low"
    }
  ]
};

// Criminal Defense Specific Patterns
export const CRIMINAL_PATTERNS = {
  dui: {
    firstOffense: {
      baseScore: 75,
      caseStrength: "Strong",
      attorney: "Senior Attorney",
      keywords: ["dui", "first offense", "first time", "driving under influence"],
      multipliers: {
        "cooperative": 1.2,
        "no prior record": 1.25,
        "low bac": 1.3
      }
    },
    repeatOffense: {
      baseScore: 45,
      caseStrength: "Weak",
      attorney: "Associate Attorney",
      keywords: ["dui", "second offense", "repeat", "prior"],
      multipliers: {
        "cooperative": 1.1
      }
    }
  },

  drugCrimes: {
    possession: {
      baseScore: 60,
      caseStrength: "Moderate",
      attorney: "Associate Attorney",
      keywords: ["drug", "possession", "marijuana", "controlled substance"],
      multipliers: {
        "small amount": 1.2,
        "first offense": 1.3,
        "medical": 1.4
      }
    }
  }
};

// Response Templates by Pattern
export const RESPONSE_TEMPLATES = {
  "drunk driver + rear-end + medical treatment": {
    initial: "🚨 I'm very sorry this happened. A drunk driver rear-ending you with medical treatment - this is exactly the type of case that results in significant settlements.",
    followUp: "⚡ With {medicalType} and {workStatus}, you have a very strong case. Cases like this often settle for six figures.",
    consultation: "🚨 Our Senior Partner needs to meet with you immediately for a case this valuable."
  },

  "rear-end + medical treatment + minor injuries": {
    initial: "I'm sorry about your accident. Rear-end collisions with medical treatment typically result in good settlements.",
    followUp: "⚡ With {medicalType}, you have a strong case. The other driver's insurance will likely be liable.",
    consultation: "Let's get you scheduled with one of our senior attorneys who handles these cases."
  },

  "criminal defense + first offense + dui": {
    initial: "I understand this is a difficult situation. First-time DUI cases often have good outcomes with proper representation.",
    followUp: "⚡ As a first offense, we can likely negotiate for reduced charges or diversion programs.",
    consultation: "Our criminal defense attorney needs to meet with you quickly to protect your rights."
  },

  "default": {
    initial: "I'm sorry to hear about your situation. Let me help assess your case.",
    followUp: "Based on what you've shared, {assessment}.",
    consultation: "I'd like to connect you with {attorney} to discuss your options."
  }
};

// Attorney Hierarchy for Routing
export const ATTORNEY_HIERARCHY = {
  'Junior Attorney': 1,
  'Associate Attorney': 2,
  'Senior Attorney': 3,
  'Senior Partner': 4
};

// Urgency Levels
export const URGENCY_LEVELS = {
  low: { threshold: 40, emoji: '', priority: 1 },
  medium: { threshold: 65, emoji: '⚡', priority: 2 },
  high: { threshold: 80, emoji: '🚨', priority: 3 }
};

// Value Range Mapping
export const VALUE_RANGES = {
  95: '$100k-$500k+',
  85: '$75k-$200k',
  75: '$50k-$150k',
  65: '$25k-$100k',
  55: '$15k-$75k',
  45: '$10k-$50k',
  35: '$5k-$25k',
  25: '$2k-$15k',
  15: '$1k-$10k'
};
