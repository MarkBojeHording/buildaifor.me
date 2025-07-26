const { CaseAssessor } = require('./case-assessor');
const { LeadScorer } = require('./lead-scorer');
const { LegalKnowledge } = require('./legal-knowledge');
const { IntentDetector } = require('../utils/intent-detector');

class MessageProcessor {
  constructor() {
    this.caseAssessor = new CaseAssessor();
    this.leadScorer = new LeadScorer();
    this.legalKnowledge = new LegalKnowledge();
    this.intentDetector = new IntentDetector();
  }

  extractCaseDetails(message, intent, prevCaseDetails = {}) {
    // TODO: Implement real entity extraction
    return prevCaseDetails;
  }

  extractUserInfo(message, intent, prevUserInfo = {}) {
    // TODO: Implement real user info extraction
    return prevUserInfo;
  }

  // Add this stub to prevent crash
  determineConversationStage(intent, sessionData) {
    // TODO: Implement real logic
    return 'initial';
  }

  async processMessage(message, sessionData, clientConfig) {
    try {
      console.log(`🏛️ Processing legal message: "${message}"`);
      const intent = await this.intentDetector.detectLegalIntent(message);
      console.log(`⚖️ Detected intent: ${intent.type} (confidence: ${intent.confidence})`);
      const updatedSession = {
        ...sessionData,
        lastIntent: intent.type,
        conversationStage: this.determineConversationStage(intent, sessionData),
        caseDetails: this.extractCaseDetails(message, intent, sessionData.caseDetails || {}),
        userInfo: this.extractUserInfo(message, intent, sessionData.userInfo || {}),
        conversationHistory: [
          ...(sessionData.conversationHistory || []),
          { role: 'user', message, intent: intent.type, timestamp: Date.now() }
        ]
      };
      let result;
      switch (intent.type) {
        case 'CASE_INQUIRY':
          result = await this.handleCaseInquiry(message, intent, updatedSession, clientConfig);
          break;
        case 'INJURY_DETAILS':
          result = await this.handleInjuryDetails(message, intent, updatedSession, clientConfig);
          break;
        case 'INCIDENT_INFO':
          result = await this.handleIncidentInfo(message, intent, updatedSession, clientConfig);
          break;
        case 'DAMAGES_INQUIRY':
          result = await this.handleDamagesInquiry(message, intent, updatedSession, clientConfig);
          break;
        case 'TIMELINE_QUESTION':
          result = await this.handleTimelineQuestion(message, intent, updatedSession, clientConfig);
          break;
        case 'FEE_INQUIRY':
          result = await this.handleFeeInquiry(message, intent, updatedSession, clientConfig);
          break;
        case 'DOCUMENT_QUESTION':
          result = await this.handleDocumentQuestion(message, intent, updatedSession, clientConfig);
          break;
        case 'CONSULTATION_REQUEST':
          result = await this.handleConsultationRequest(message, intent, updatedSession, clientConfig);
          break;
        case 'STATUTE_INQUIRY':
          result = await this.handleStatuteInquiry(message, intent, updatedSession, clientConfig);
          break;
        case 'GREETING':
          result = this.handleGreeting(updatedSession, clientConfig);
          break;
        default:
          result = this.handleGeneralLegalQuery(message, intent, updatedSession, clientConfig);
      }
      updatedSession.conversationHistory.push({
        role: 'assistant',
        message: result.response,
        intent: intent.type,
        confidence: result.confidence || 0.8,
        timestamp: Date.now()
      });
      return {
        response: result.response,
        confidence: result.confidence || 0.8,
        intent: intent.type,
        caseType: result.caseType,
        caseAssessment: result.caseAssessment,
        leadScore: result.leadScore,
        nextQuestions: result.nextQuestions || [],
        suggestedActions: result.suggestedActions || [],
        sessionData: updatedSession
      };
    } catch (error) {
      console.error('❌ Legal message processing error:', error);
      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please contact our office directly for immediate legal assistance.",
        confidence: 0.1,
        intent: 'ERROR',
        sessionData: sessionData,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
  // ... (rest of the class as in the prompt)
}

module.exports = { MessageProcessor };
