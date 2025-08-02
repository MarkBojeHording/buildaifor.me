/**
 * Pattern-Based Message Processor
 * Implements the new scalable architecture while maintaining compatibility
 */

// Case Pattern Database
const CASE_PATTERNS = {
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

// Criminal Defense Patterns
const CRIMINAL_PATTERNS = {
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
  }
};

// Response Templates
const RESPONSE_TEMPLATES = {
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

class PatternBasedProcessor {
  constructor() {
    this.conversationState = new Map();
  }

  /**
   * Main processing method
   */
  async processMessage(message, sessionData, clientConfig) {
    try {
      console.log('🎯 Pattern-Based Processor - DISABLED: Returning neutral response');

      // DISABLED: Return neutral response that doesn't affect lead scoring
      return {
        response: {
          response: "I understand your situation. Let me help you get connected with the right attorney for your case.",
          ai_generated: true,
          timestamp: new Date().toISOString()
        },
        aiData: {
          lead_score: sessionData.lead_score || 0, // Preserve existing lead score
          detected_intent: 'GENERAL_INFO',
          intent_confidence: 0.5,
          case_strength: 'Standard',
          attorney_match: 'Standard Consultation',
          escalation_needed: false,
          practice_area: 'general',
          case_type: 'General',
          urgency: 'Low',
          value_range: '$5k-$25k',
          confidence: 0.5,
          trajectory: 'stable',
          reasoning: 'Pattern processor disabled - using single scoring system'
        }
      };

    } catch (error) {
      console.error('❌ Pattern processor failed:', error.message);
      return this.getFallbackResponse(message, clientConfig);
    }
  }

  /**
   * Analyze case using pattern matching
   */
  analyzeCase(conversationHistory) {
    const allText = conversationHistory.join(' ').toLowerCase();
    const extractedKeywords = this.extractKeywords(allText);
    const matchedPatterns = this.findMatchingPatterns(extractedKeywords);

    return this.calculateScore(matchedPatterns, extractedKeywords);
  }

    /**
   * Extract keywords from conversation
   */
  extractKeywords(text) {
    const keywords = [];

    // Collision types
    if (text.includes('rear-end') || text.includes('rear end') || text.includes('hit from behind')) {
      keywords.push('rear-end');
    }
    if (text.includes('drunk') || text.includes('dui') || text.includes('intoxicated')) {
      keywords.push('drunk driver');
    }

    // Medical indicators
    if (text.includes('emergency room') || text.includes('er ') || text.includes('hospital')) {
      keywords.push('emergency room');
    }
    if (text.includes('medical') || text.includes('treatment') || text.includes('doctor')) {
      keywords.push('medical');
    }
    if (text.includes('surgery') || text.includes('operation')) {
      keywords.push('surgery');
    }
    if (text.includes('specialist') || text.includes('orthopedic')) {
      keywords.push('specialist');
    }

    // Economic damages
    if (text.includes('missed work') || text.includes('time off')) {
      keywords.push('missed work');
    }
    if (text.includes('lost wages') || text.includes('income')) {
      keywords.push('lost wages');
    }

    // Injury indicators
    if (text.includes('serious') || text.includes('severe') || text.includes('major')) {
      keywords.push('serious injury');
    }
    if (text.includes('injuries') || text.includes('injury')) {
      keywords.push('medical');
    }

    // Criminal indicators
    if (text.includes('arrested') || text.includes('criminal charges')) {
      keywords.push('criminal');
    }
    if (text.includes('first offense') || text.includes('first time')) {
      keywords.push('first offense');
    }

    console.log('🔍 Extracted keywords:', keywords);
    return keywords;
  }

    /**
   * Find matching patterns
   */
  findMatchingPatterns(keywords) {
    const allPatterns = [
      ...CASE_PATTERNS.highValue,
      ...CASE_PATTERNS.mediumValue,
      ...CASE_PATTERNS.lowValue
    ];

    const matches = allPatterns
      .map(pattern => ({
        ...pattern,
        matchScore: this.calculatePatternMatch(pattern.keywords, keywords)
      }))
      .filter(pattern => pattern.matchScore > 0.3)
      .sort((a, b) => b.matchScore - a.matchScore);

    console.log('🎯 Pattern matches:', matches.map(m => `${m.pattern} (${m.matchScore})`));
    return matches;
  }

  /**
   * Calculate pattern match score
   */
  calculatePatternMatch(patternKeywords, extractedKeywords) {
    if (extractedKeywords.length === 0) return 0;

    const matches = patternKeywords.filter(keyword =>
      extractedKeywords.some(extracted =>
        extracted.includes(keyword) || keyword.includes(extracted)
      )
    );

    return matches.length / patternKeywords.length;
  }

  /**
   * Calculate final score
   */
  calculateScore(matchedPatterns, keywords) {
    if (matchedPatterns.length === 0) {
      return {
        score: 20,
        strength: 'Weak',
        attorney: 'Junior Attorney',
        pattern: 'general inquiry',
        confidence: 0.5,
        practiceArea: 'general',
        urgency: 'low',
        valueRange: '$1k-$10k'
      };
    }

    const bestPattern = matchedPatterns[0];
    let finalScore = bestPattern.baseScore;

    // Apply multipliers
    keywords.forEach(keyword => {
      if (bestPattern.multipliers && bestPattern.multipliers[keyword]) {
        finalScore *= bestPattern.multipliers[keyword];
      }
    });

    // Ensure score stays within bounds
    finalScore = Math.min(Math.round(finalScore), 100);
    finalScore = Math.max(finalScore, 20);

    return {
      score: finalScore,
      strength: bestPattern.caseStrength,
      attorney: bestPattern.attorney,
      pattern: bestPattern.pattern,
      confidence: bestPattern.matchScore,
      practiceArea: bestPattern.practiceArea,
      urgency: bestPattern.urgency,
      valueRange: this.getValueRange(finalScore),
      reasoning: `Lead score: ${finalScore}/100. Pattern: ${bestPattern.pattern}`
    };
  }

  /**
   * Get value range based on score
   */
  getValueRange(score) {
    if (score >= 95) return '$100k-$500k+';
    if (score >= 85) return '$75k-$200k';
    if (score >= 75) return '$50k-$150k';
    if (score >= 65) return '$25k-$100k';
    if (score >= 55) return '$15k-$75k';
    if (score >= 45) return '$10k-$50k';
    if (score >= 35) return '$5k-$25k';
    if (score >= 25) return '$2k-$15k';
    return '$1k-$10k';
  }

    /**
   * Get conversation state
   */
  getConversation(sessionData) {
    const key = sessionData.conversationId || sessionData.session_id || 'default';

    if (!this.conversationState.has(key)) {
      this.conversationState.set(key, {
        messages: [],
        currentScore: 0,
        caseStrength: 'Weak',
        recommendedAttorney: 'Junior Attorney',
        conversationStage: 'initial'
      });
    }

    const conversation = this.conversationState.get(key);
    console.log('💬 Conversation state:', {
      key: key,
      messageCount: conversation.messages.length,
      currentScore: conversation.currentScore,
      attorney: conversation.recommendedAttorney
    });

    return conversation;
  }

  /**
   * Update conversation state (ensuring consistency)
   */
  updateConversationState(conversation, analysis) {
    // CRITICAL: Scores can only increase unless explicit contradiction detected
    const hasContradiction = this.detectContradiction(analysis, conversation);

    if (hasContradiction) {
      // Allow maximum 20% decrease for contradictions
      conversation.currentScore = Math.max(analysis.score, conversation.currentScore * 0.8);
      console.log(`⚠️ Contradiction detected, score adjusted to: ${conversation.currentScore}`);
    } else {
      // Normal case: score can only increase or stay same
      conversation.currentScore = Math.max(analysis.score, conversation.currentScore);
    }

    // Update other conversation attributes
    conversation.caseStrength = analysis.strength;
    conversation.recommendedAttorney = this.upgradeAttorneyIfNeeded(
      conversation.recommendedAttorney,
      analysis.attorney
    );

    // Update conversation stage
    conversation.conversationStage = this.determineConversationStage(
      conversation.messages.length,
      conversation.currentScore
    );

    console.log(`📊 Pattern Processor Score Update: ${analysis.score} → ${conversation.currentScore}`);
  }

  /**
   * Detect contradictions in conversation
   */
  detectContradiction(analysis, conversation) {
    // Check for explicit contradictions
    const currentKeywords = this.extractKeywords(conversation.messages.join(' '));
    const newKeywords = this.extractKeywords(analysis.pattern || '');

    // Contradictions to check for
    const contradictions = [
      { positive: ['serious injury', 'broken', 'fracture'], negative: ['no injury', 'not hurt', 'fine'] },
      { positive: ['drunk driver', 'dui'], negative: ['sober', 'not drinking'] },
      { positive: ['missed work', 'lost wages'], negative: ['no missed work', 'working fine'] },
      { positive: ['medical treatment', 'hospital'], negative: ['no treatment', 'refused medical'] }
    ];

    for (const contradiction of contradictions) {
      const hasPositive = contradiction.positive.some(keyword =>
        currentKeywords.includes(keyword) || newKeywords.includes(keyword)
      );
      const hasNegative = contradiction.negative.some(keyword =>
        currentKeywords.includes(keyword) || newKeywords.includes(keyword)
      );

      if (hasPositive && hasNegative) {
        console.log(`🚨 Contradiction detected: ${contradiction.positive.join('/')} vs ${contradiction.negative.join('/')}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Upgrade attorney only if higher in hierarchy
   */
  upgradeAttorneyIfNeeded(current, recommended) {
    const hierarchy = {
      'Junior Attorney': 1,
      'Associate Attorney': 2,
      'Senior Attorney': 3,
      'Senior Partner': 4
    };

    const currentLevel = hierarchy[current] || 1;
    const recommendedLevel = hierarchy[recommended] || 1;

    return recommendedLevel > currentLevel ? recommended : current;
  }

  /**
   * Determine conversation stage
   */
  determineConversationStage(messageCount, score) {
    if (messageCount <= 1) return 'initial';
    if (score >= 80) return 'qualified_lead';
    if (score >= 60) return 'case_qualification';
    return 'information_gathering';
  }

  /**
   * Generate response
   */
  generateResponse(conversation, analysis, clientConfig) {
    const template = this.getResponseTemplate(analysis.pattern, conversation.conversationStage);
    const nextQuestion = this.determineNextQuestion(conversation, analysis);

    let response = template.replace('{assessment}', analysis.strength);
    response = response.replace('{attorney}', conversation.recommendedAttorney);

    // Add urgency indicators
    if (analysis.urgency === 'high') {
      response = '🚨 ' + response;
    } else if (analysis.urgency === 'medium') {
      response = '⚡ ' + response;
    }

    // Add next question
    if (nextQuestion) {
      response += ' ' + nextQuestion;
    }

    return response;
  }

  /**
   * Get response template
   */
  getResponseTemplate(pattern, stage) {
    const templates = RESPONSE_TEMPLATES;

    if (templates[pattern]) {
      const template = templates[pattern];
      if (stage === 'initial' && template.initial) return template.initial;
      if (stage === 'case_qualification' && template.followUp) return template.followUp;
      if (stage === 'qualified_lead' && template.consultation) return template.consultation;
      return template.initial || template.followUp || template.consultation;
    }

    return templates.default.initial;
  }

  /**
   * Determine next question
   */
  determineNextQuestion(conversation, analysis) {
    const keywords = this.extractKeywords(conversation.messages.join(' '));

    if (analysis.score >= 80) {
      return "When would you like to meet with our " + conversation.recommendedAttorney + "?";
    }

    if (keywords.includes('emergency room') && !keywords.includes('missed work')) {
      return "Have you missed any work due to your injuries?";
    }

    if (keywords.includes('rear-end') && !keywords.includes('medical')) {
      return "Did you receive any medical treatment after the accident?";
    }

    return "Can you tell me more about your situation?";
  }

  /**
   * Update session data
   */
  updateSessionData(sessionData, analysis, conversation) {
    sessionData.lead_score = conversation.currentScore;
    sessionData.lead_data = {
      score: analysis.score,
      strength: analysis.strength,
      attorney: conversation.recommendedAttorney,
      pattern: analysis.pattern,
      reasoning: analysis.reasoning,
      valueRange: analysis.valueRange
    };
    sessionData.conversation_stage = conversation.conversationStage;
    sessionData.detected_intent = analysis.practiceArea === 'criminal_defense' ? 'CRIMINAL_DEFENSE' : 'INJURY_DETAILS';
    sessionData.intent_confidence = analysis.confidence;
    sessionData.case_strength = analysis.strength;
    sessionData.attorney_match = conversation.recommendedAttorney;
    sessionData.escalation_needed = analysis.urgency === 'high';
  }

  /**
   * Get fallback response
   */
  getFallbackResponse(message, clientConfig) {
    return {
      response: {
        response: "I'm sorry, I'm having trouble processing your message right now. Please try again or contact us directly for immediate assistance.",
        ai_generated: true,
        timestamp: new Date().toISOString()
      },
      aiData: {
        lead_score: 20,
        detected_intent: 'GENERAL_INFO',
        intent_confidence: 0.5,
        case_strength: 'Weak',
        attorney_match: 'Junior Attorney',
        escalation_needed: false,
        practice_area: 'general',
        urgency: 'low',
        value_range: '$1k-$10k',
        reasoning: 'Fallback response due to processing error'
      }
    };
  }
}

module.exports = PatternBasedProcessor;
