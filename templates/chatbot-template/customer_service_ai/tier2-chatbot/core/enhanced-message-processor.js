const AIResponseGenerator = require('./ai-response-generator');
const LeadScorer = require('./lead-scorer');
const IntentDetector = require('./intent-detector');
const CaseAssessor = require('./case-assessor');
const AttorneyRouter = require('./attorney-router');
const PatternBasedProcessor = require('./pattern-based-processor');

class EnhancedMessageProcessor {
  constructor(config) {
    this.config = config;
    this.aiResponseGenerator = new AIResponseGenerator(config);
    this.leadScorer = new LeadScorer(config);
    this.intentDetector = new IntentDetector(config);
    this.caseAssessor = new CaseAssessor(config);
    this.attorneyRouter = new AttorneyRouter();

    try {
      this.patternProcessor = new PatternBasedProcessor();
      console.log('✅ Pattern-based processor initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize pattern-based processor:', error.message);
      this.patternProcessor = null;
    }
  }

    async processMessage(message, sessionData, clientConfig) {
    console.log('\n🚀 === ENHANCED MESSAGE PROCESSOR ===');
    console.log('📋 Client:', clientConfig.business_name);
    console.log('📨 Message:', message);
    console.log('📊 Session stage:', sessionData.conversation_stage || 'initial');

            try {
      // Force use of pattern-based processor for law firm demos
      if (clientConfig.clientId === 'law-firm-demo' && this.patternProcessor) {
        console.log('🎯 Using pattern-based processor for law firm demo');
        try {
          const patternResult = await this.patternProcessor.processMessage(message, sessionData, clientConfig);
          console.log('📊 Pattern result:', patternResult ? 'Success' : 'No result');

          if (patternResult && patternResult.response) {
            console.log('✅ Pattern-based processing completed');

            // Add debug logging for score tracking
            console.log(`🔍 SCORING DEBUG:`);
            console.log(`  Pattern Processor Score: ${patternResult.aiData?.lead_score || 'N/A'}`);
            console.log(`  Final sessionData.lead_score: ${sessionData.lead_score}`);

            return patternResult;
          } else {
            console.log('⚠️ Pattern processor returned no response, falling back to legacy');
          }
        } catch (error) {
          console.error('❌ Pattern processor error:', error.message);
          console.log('🔄 Falling back to legacy processing due to error');
        }
      } else if (clientConfig.clientId === 'law-firm-demo') {
        console.log('⚠️ Pattern processor not available, using legacy processing');
      }

      // Fallback to original processing
      console.log('🔄 Using legacy processing');
      return await this.legacyProcessMessage(message, sessionData, clientConfig);

    } catch (error) {
      console.error('❌ Enhanced processing failed:', error);
      return this.getFallbackResponse(message, clientConfig);
    }
  }

  async legacyProcessMessage(message, sessionData, clientConfig) {
    console.log('🔄 Using legacy processing');

    const conversationId = sessionData.session_id || 'default';

    // Step 1: Intent Detection
    console.log('🎯 Step 1: Intent Detection');
    const intentResult = await this.intentDetector.detectIntent(message, sessionData, clientConfig);

    // Step 2: SINGLE LEAD SCORING SYSTEM (ONLY THIS ONE COUNTS)
    console.log('📊 Step 2: Single Lead Scoring System');
    const leadScore = await this.leadScorer.scoreLead(message, sessionData, clientConfig);

    // CRITICAL: Update session with lead score and NEVER let other systems override it
    this.leadScorer.updateSessionScore(sessionData, leadScore);

    console.log(`🔍 SINGLE SCORING SYSTEM: Lead Score = ${leadScore.score}/100`);

    // Step 3: Case Assessment (DISABLED - NO SCORING)
    console.log('⚖️ Step 3: Case Assessment (Scoring Disabled)');
    let caseAssessment = null;

    // Always run case assessment for law firm demos (but ignore its scores)
    if (clientConfig.industry === 'legal' || clientConfig.business_type === 'law_firm' || clientConfig.clientId === 'law-firm-demo') {
      // Special handling for criminal cases
      if (intentResult.primary && intentResult.primary.intent === 'CRIMINAL_DEFENSE') {
        caseAssessment = await this.assessCriminalCase(message, sessionData, intentResult);
      } else {
        caseAssessment = await this.caseAssessor.assessCase(message, sessionData, clientConfig);
      }

      // CRITICAL: Case assessor is DISABLED - it cannot override lead score
      this.caseAssessor.updateSessionAssessment(sessionData, caseAssessment);
      // Lead score remains unchanged - only lead scorer can set it

      console.log(`🔍 SCORING DEBUG:`);
      console.log(`  Lead Scorer Score: ${leadScore.score} (ONLY SCORE THAT COUNTS)`);
      console.log(`  Case Assessor Score: ${caseAssessment.score} (IGNORED - DISABLED)`);
      console.log(`  Final Lead Score: ${sessionData.lead_score} (PRESERVED)`);
    }

    // Step 4: Attorney Routing Based on SINGLE Lead Score
    console.log('👨‍💼 Step 4: Attorney Routing (Based on Lead Score Only)');
    const attorneyMatch = this.attorneyRouter.determineAttorney(
      leadScore.score, // Use ONLY the lead score
      intentResult,
      caseAssessment,
      conversationId
    );

    // Step 5: Generate AI Response
    console.log('🤖 Step 5: AI Response Generation');

    // Build conversation history for context
    const conversationHistory = sessionData.messages || [];

    const aiResponse = await this.aiResponseGenerator.generateResponse(
      message,
      sessionData,
      clientConfig
    );

    // Step 6: Build comprehensive response
    console.log('📝 Step 6: Building Response');
    const response = this.buildComprehensiveResponse(
      aiResponse,
      intentResult,
      leadScore,
      caseAssessment,
      attorneyMatch,
      sessionData,
      clientConfig
    );

    // Step 7: Update conversation stage
    this.updateConversationStage(sessionData, intentResult, leadScore);

    console.log('✅ Single scoring system processing completed');
    return response;
  }

  async assessCriminalCase(message, sessionData, intentResult) {
    // Criminal cases use different assessment criteria
    const conversationHistory = sessionData.messages || [];
    const context = conversationHistory.map(m => m.text).join(' ') + ' ' + message;
    const lowerContext = context.toLowerCase();

    let strength = 'Standard Criminal Defense';
    let score = 50;
    let factors = {
      liability: 'Unclear',
      damages: 'Low',
      limitations: 'Within',
      evidence: 'Some'
    };

    // DUI-specific assessment
    if (lowerContext.includes('dui') || lowerContext.includes('dwi')) {
      if (lowerContext.includes('first offense') || lowerContext.includes('first time')) {
        strength = 'Defendable - First Offense';
        score = 65;
        factors = {
          liability: 'Defendable',
          damages: 'Low',
          limitations: 'Within',
          evidence: 'Standard'
        };
      } else {
        strength = 'Complex - Multiple Offenses';
        score = 40;
        factors = {
          liability: 'Challenging',
          damages: 'Low',
          limitations: 'Within',
          evidence: 'Complex'
        };
      }
    }

    // Other criminal cases
    if (lowerContext.includes('assault') || lowerContext.includes('domestic')) {
      strength = 'Complex - Violent Crime';
      score = 45;
      factors = {
        liability: 'Challenging',
        damages: 'Low',
        limitations: 'Within',
        evidence: 'Complex'
      };
    }

    return {
      strength: strength,
      score: score,
      factors: factors,
      explanation: `Criminal defense case assessment: ${strength}`,
      recommendation: 'Immediate attorney consultation recommended',
      caseType: 'criminal_defense',
      timestamp: new Date().toISOString()
    };
  }

  buildComprehensiveResponse(aiResponse, intentResult, leadScore, caseAssessment, attorneyMatch, sessionData, clientConfig) {
    // Use sessionData.lead_score as the single source of truth
    const finalLeadScore = sessionData.lead_score || leadScore.score;

    const response = {
      response: aiResponse,
      aiData: {
        lead_score: finalLeadScore,
        detected_intent: intentResult.primary.intent,
        intent_confidence: intentResult.primary.confidence,
        case_strength: caseAssessment ? caseAssessment.strength : 'Not assessed',
        attorney_match: attorneyMatch.attorney,
        attorney_reason: attorneyMatch.reasoning,
        priority: attorneyMatch.urgency,
        next_steps: this.attorneyRouter.getNextSteps(attorneyMatch),
        consultation_priority: this.attorneyRouter.getConsultationPriority(attorneyMatch),
        escalation_needed: this.attorneyRouter.shouldEscalate(attorneyMatch),
        practice_area: intentResult.practiceArea || 'general',
        case_type: leadScore.caseType,
        urgency: leadScore.urgency,
        value_range: leadScore.valueRange,
        confidence: leadScore.confidence,
        trajectory: leadScore.trajectory,
        reasoning: leadScore.reasoning
      }
    };

    return response;
  }

  updateConversationStage(sessionData, intentResult, leadScore) {
    const currentStage = sessionData.conversation_stage || 'initial';
    let newStage = currentStage;

    // Update stage based on intent and lead score
    if (intentResult.primary.intent === 'CRIMINAL_DEFENSE') {
      newStage = 'case_qualification';
    } else if (intentResult.primary.intent === 'INJURY_DETAILS' && leadScore.score >= 60) {
      newStage = 'qualified_lead';
    } else if (intentResult.primary.intent === 'CONSULTATION_REQUEST') {
      newStage = 'consultation_ready';
    } else if (leadScore.score >= 70) {
      newStage = 'qualified_lead';
    } else if (leadScore.score >= 40) {
      newStage = 'case_qualification';
    }

    if (newStage !== currentStage) {
      console.log(`🔄 Conversation stage updated: ${currentStage} → ${newStage}`);
      sessionData.conversation_stage = newStage;
    }
  }

  getFallbackResponse(message, clientConfig) {
    console.log('🔄 Using fallback response');

    const lowerMessage = message.toLowerCase();
    let response = 'Thank you for contacting us. How can I help you with your legal matter today?';
    let attorneyMatch = 'Junior Attorney';
    let priority = 'standard';

    // Criminal defense fallback
    if (lowerMessage.includes('arrest') || lowerMessage.includes('charges') || lowerMessage.includes('criminal')) {
      response = 'I understand you have a criminal matter. This requires immediate attention. Our criminal defense partner will contact you right away. Can you tell me more about your situation?';
      attorneyMatch = 'Criminal Defense Partner';
      priority = 'immediate';
    }
    // Injury case fallback
    else if (lowerMessage.includes('injury') || lowerMessage.includes('accident') || lowerMessage.includes('hurt')) {
      response = 'I see you have an injury case. This could be a valuable claim. Can you tell me more about the accident and your injuries?';
      attorneyMatch = 'Senior Attorney';
      priority = 'high';
    }
    // General fallback
    else {
      response = 'Thank you for reaching out. I\'d be happy to help you with your legal matter. Can you tell me more about your situation?';
    }

    return {
      response: response,
      aiData: {
        lead_score: 25,
        detected_intent: 'GENERAL_INFO',
        intent_confidence: 0.6,
        case_strength: 'Not assessed',
        attorney_match: attorneyMatch,
        attorney_reason: 'Fallback routing',
        priority: priority,
        next_steps: 'Continue qualification process',
        consultation_priority: 'Low',
        escalation_needed: false,
        practice_area: 'general',
        case_type: 'General',
        urgency: 'Low',
        value_range: '$5k-$25k',
        confidence: 0.5,
        trajectory: 'stable',
        reasoning: 'Fallback analysis applied'
      }
    };
  }

  generateSessionSummary(sessionData) {
    const summary = {
      total_messages: sessionData.message_count || 0,
      lead_score: sessionData.lead_score || 0,
      conversation_stage: sessionData.conversation_stage || 'initial',
      duration: this.calculateDuration(sessionData),
      intent_history: sessionData.intent_history || [],
      lead_quality: this.leadScorer.getLeadQuality(sessionData.lead_score || 0)
    };

    return summary;
  }

  calculateDuration(sessionData) {
    if (!sessionData.start_time) {
      return 'Unknown';
    }

    const startTime = new Date(sessionData.start_time);
    const endTime = new Date();
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  }
}

module.exports = EnhancedMessageProcessor;
