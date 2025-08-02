const OpenAI = require('openai');

class CaseAssessor {
  constructor(config) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.config = config;
  }

  async assessCase(message, sessionData, clientConfig) {
    try {
      console.log('⚖️ Case Assessor - DISABLED: Returning neutral assessment');

      // DISABLED: Return neutral assessment that doesn't affect lead scoring
      return {
        strength: 'Standard',
        score: 50, // Neutral score - will be ignored by lead scorer
        factors: {
          liability: 'Standard',
          damages: 'Standard',
          limitations: 'Within',
          evidence: 'Standard'
        },
        explanation: 'Case assessment completed (scoring disabled)',
        recommendation: 'Continue with lead qualification process',
        caseType: 'civil',
        fallback: false,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Case assessment failed:', error.message);
      return this.getFallbackAssessment(message, sessionData);
    }
  }

  isCriminalCase(context) {
    const criminalKeywords = [
      'arrested', 'dui', 'dwi', 'criminal', 'charges', 'court date',
      'police', 'jail', 'bail', 'felony', 'misdemeanor', 'drug charge',
      'assault', 'theft', 'domestic violence', 'warrant', 'probation'
    ];
    return criminalKeywords.some(keyword => context.includes(keyword));
  }

  assessCriminalCase(message, conversationHistory, context) {
    console.log('⚖️ Assessing criminal case - DISABLED: Returning neutral assessment');

    // DISABLED: Return neutral assessment for criminal cases
    return {
      strength: 'Standard Criminal Defense',
      score: 50, // Neutral score - will be ignored by lead scorer
      factors: {
        liability: 'Standard',
        damages: 'Standard',
        limitations: 'Within',
        evidence: 'Standard'
      },
      explanation: 'Criminal case assessment completed (scoring disabled)',
      recommendation: 'Continue with lead qualification process',
      caseType: 'criminal',
      fallback: false,
      timestamp: new Date().toISOString()
    };
  }

  // DISABLED: All other methods return neutral responses
  getAssessmentSystemPrompt() {
    return 'You are a case assessment assistant. Provide neutral assessments only.';
  }

  buildAssessmentPrompt(message, sessionData, clientConfig) {
    return 'Provide a neutral case assessment without scoring.';
  }

  buildAssessmentContext(sessionData) {
    return 'Neutral assessment context.';
  }

  parseAssessmentResult(result) {
    // DISABLED: Return neutral parsed result
    return {
      strength: 'Standard',
      score: 50,
      factors: {
        liability: 'Standard',
        damages: 'Standard',
        limitations: 'Within',
        evidence: 'Standard'
      },
      explanation: 'Neutral assessment parsed',
      recommendation: 'Continue qualification',
      caseType: 'general',
      fallback: false,
      timestamp: new Date().toISOString()
    };
  }

  getFallbackAssessment(message, sessionData) {
    return {
      strength: 'Standard',
      score: 50, // Neutral score
      factors: {
        liability: 'Standard',
        damages: 'Standard',
        limitations: 'Within',
        evidence: 'Standard'
      },
      explanation: 'Fallback assessment applied',
      recommendation: 'Continue qualification process',
      caseType: 'general',
      fallback: true,
      timestamp: new Date().toISOString()
    };
  }

  updateSessionAssessment(sessionData, assessment) {
    // DISABLED: Don't update session with case assessment scores
    // Only store assessment data, not scores
    sessionData.case_assessment = {
      strength: assessment.strength,
      factors: assessment.factors,
      explanation: assessment.explanation,
      recommendation: assessment.recommendation,
      caseType: assessment.caseType
    };
    // DO NOT update lead_score - preserve lead scorer's score
  }

  getAttorneyRecommendation(assessment) {
    // DISABLED: Return neutral recommendation
    return 'Standard attorney consultation recommended';
  }

  shouldEscalate(assessment) {
    // DISABLED: No escalation based on case assessment
    return false;
  }

  getStatuteOfLimitations(caseType) {
    // Keep this functionality for informational purposes
    const limitations = {
      'personal_injury': '2 years',
      'medical_malpractice': '2 years',
      'criminal': 'Varies by charge',
      'family': 'Varies by issue',
      'general': 'Varies by case type'
    };
    return limitations[caseType] || 'Consult attorney for specific timeline';
  }
}

module.exports = CaseAssessor;
