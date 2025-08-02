class LeadScorer {
  constructor(config) {
    this.config = config;
  }

  async scoreLead(message, sessionData, clientConfig) {
    try {
      console.log('📊 Lead Scorer - Analyzing message for lead scoring');

      const conversationHistory = sessionData.messages || [];
      const currentScore = sessionData.lead_score || 0;

      // Analyze ALL conversation messages together
      const allMessages = [...conversationHistory.map(m => m.text), message];
      const fullText = allMessages.join(' ').toLowerCase();

      // Calculate new score based on keywords found
      const newScore = this.calculateScore(fullText, currentScore);

      // Score can ONLY increase, never decrease
      const finalScore = Math.max(newScore, currentScore);

      // Generate reasoning for score increase
      const reasoning = this.generateReasoning(fullText, currentScore, finalScore);

      const result = {
        score: finalScore,
        reasoning: reasoning,
        caseType: this.identifyCaseType(fullText),
        urgency: this.determineUrgency(finalScore),
        valueRange: this.estimateValueRange(finalScore),
        confidence: 0.85,
        trajectory: finalScore > currentScore ? 'ascending' : 'stable',
        timestamp: new Date().toISOString()
      };

      console.log('✅ Single lead scoring completed:', result);
      return result;

    } catch (error) {
      console.error('❌ Lead scoring failed:', error.message);
      return this.getFallbackScore(message, sessionData);
    }
  }

  calculateScore(fullText, currentScore) {
    let score = currentScore;
    let increases = [];

    // Use word boundary regex patterns to prevent false positives
    const keywordPatterns = {
      // Truck/Commercial vehicle: +30 points
      'truck': /\b(18-wheeler|semi truck|commercial truck|big rig|truck driver|trucker|tractor trailer)\b/i,

      // Medical/Doctor/Surgery/Malpractice: +40 points
      'medical': /\b(doctor|surgeon|surgery|medical malpractice|hospital|malpractice|physician|nurse)\b/i,

      // Serious injury/Hospitalized/Emergency room: +25 points
      'serious_injury': /\b(hospitalized|emergency room|er visit|went to er|serious injury|broken|fracture|surgery)\b/i,

      // Police report/Cited/Fault/Evidence: +20 points
      'evidence': /\b(police report|cited|ticket|fault|police officer|officer said|witness)\b/i,

      // Lost work/Income/Wages: +15 points
      'work_impact': /\b(lost work|can't work|unable to work|missed work|lost wages|lost income|time off work)\b/i,

      // Pain/Suffering/Ongoing treatment: +15 points
      'pain_suffering': /\b(pain|suffering|ongoing treatment|physical therapy|rehabilitation|chronic pain|permanent injury)\b/i
    };

    // Check for each keyword pattern and add points if found
    for (const [category, pattern] of Object.entries(keywordPatterns)) {
      if (pattern.test(fullText)) {
        let points = 0;
        switch (category) {
          case 'truck': points = 30; break;
          case 'medical': points = 40; break;
          case 'serious_injury': points = 25; break;
          case 'evidence': points = 20; break;
          case 'work_impact': points = 15; break;
          case 'pain_suffering': points = 15; break;
        }
        score += points;
        increases.push(`${category}: +${points}`);
      }
    }

    // Cap at 100
    score = Math.min(score, 100);

    console.log(`📈 Score calculation: ${currentScore} → ${score} (increases: ${increases.join(', ')})`);

    return score;
  }

  generateReasoning(fullText, currentScore, finalScore) {
    if (finalScore === currentScore) {
      return `Lead score: ${finalScore}/100. No new high-value factors detected. Trajectory: stable.`;
    }

    const increase = finalScore - currentScore;
    return `Lead score: ${finalScore}/100 (increased by ${increase} points). High-value factors detected in conversation. Trajectory: ascending.`;
  }

  identifyCaseType(fullText) {
    if (fullText.includes('criminal') || fullText.includes('arrested') || fullText.includes('dui')) {
      return 'Criminal Defense';
    }
    if (fullText.includes('accident') || fullText.includes('injury') || fullText.includes('crash')) {
      return 'Personal Injury';
    }
    if (fullText.includes('divorce') || fullText.includes('custody') || fullText.includes('family')) {
      return 'Family Law';
    }
    return 'General';
  }

  determineUrgency(score) {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  }

  estimateValueRange(score) {
    if (score >= 85) return '$100k-$500k+';
    if (score >= 70) return '$50k-$200k';
    if (score >= 50) return '$25k-$100k';
    if (score >= 30) return '$10k-$50k';
    return '$5k-$25k';
  }

  getFallbackScore(message, sessionData) {
    const currentScore = sessionData.lead_score || 0;
    return {
      score: currentScore,
      reasoning: 'Fallback scoring applied - maintaining current score',
      caseType: 'General',
      urgency: 'Low',
      valueRange: '$5k-$25k',
      confidence: 0.5,
      trajectory: 'stable',
      timestamp: new Date().toISOString()
    };
  }

  updateSessionScore(sessionData, newScore) {
    sessionData.lead_score = newScore.score;
    sessionData.lead_data = {
      ...sessionData.lead_data,
      ...newScore
    };
  }

  getLeadQuality(score) {
    if (score >= 80) return 'Premium';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }

  getRecommendedAction(score) {
    if (score >= 80) return 'Immediate attorney contact';
    if (score >= 60) return 'Schedule consultation';
    if (score >= 40) return 'Continue qualification';
    return 'Gather more information';
  }
}

module.exports = LeadScorer;
