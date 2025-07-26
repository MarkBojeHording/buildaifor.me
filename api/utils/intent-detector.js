class IntentDetector {
  async detectLegalIntent(message) {
    const messageLower = message.toLowerCase().trim();
    const legalIntents = [
      { type: 'GREETING', patterns: [/^(hi|hello|hey|good morning|good afternoon)/i, /^(help|assist|support)/i], keywords: ['hello', 'hi', 'hey', 'help', 'assist'], confidence: 0.9 },
      { type: 'CASE_INQUIRY', patterns: [/(injured|hurt|accident|incident)/i, /(case|claim|lawsuit|legal action)/i, /(happened to me|what happened)/i], keywords: ['injured', 'accident', 'case', 'lawsuit', 'incident', 'hurt', 'happened'], confidence: 0.9 },
      { type: 'INJURY_DETAILS', patterns: [/(broke|broken|fractured)/i, /(back pain|neck pain|head injury)/i, /(surgery|hospital|medical)/i], keywords: ['broke', 'broken', 'pain', 'surgery', 'hospital', 'medical', 'injury', 'hurt'], confidence: 0.8 },
      { type: 'INCIDENT_INFO', patterns: [/(when|date|time|ago)/i, /(happened|occurred|took place)/i, /(last week|last month|yesterday)/i], keywords: ['when', 'date', 'happened', 'occurred', 'ago', 'time'], confidence: 0.8 },
      { type: 'DAMAGES_INQUIRY', patterns: [/(compensation|money|payment|settlement)/i, /(worth|value|damages|recover)/i, /(medical bills|lost wages)/i], keywords: ['compensation', 'money', 'settlement', 'damages', 'bills', 'wages'], confidence: 0.8 },
      { type: 'TIMELINE_QUESTION', patterns: [/(how long|timeline|process|take)/i, /(when will|how soon)/i], keywords: ['how long', 'timeline', 'process', 'when will', 'how soon'], confidence: 0.7 },
      { type: 'FEE_INQUIRY', patterns: [/(cost|fee|price|charge|expensive)/i, /(contingency|percentage|upfront)/i, /(pay|payment|afford)/i], keywords: ['cost', 'fee', 'price', 'contingency', 'pay', 'afford'], confidence: 0.8 },
      { type: 'CONSULTATION_REQUEST', patterns: [/(consultation|appointment|meeting|speak)/i, /(schedule|book|arrange)/i, /(attorney|lawyer)/i], keywords: ['consultation', 'appointment', 'schedule', 'attorney', 'lawyer', 'meeting'], confidence: 0.9 },
      { type: 'DOCUMENT_QUESTION', patterns: [/(documents|paperwork|records|reports)/i, /(police report|medical records)/i, /(need|required|bring)/i], keywords: ['documents', 'paperwork', 'records', 'police report', 'medical'], confidence: 0.7 },
      { type: 'STATUTE_INQUIRY', patterns: [/(statute|limitation|deadline|time limit)/i, /(too late|expired|still time)/i], keywords: ['statute', 'limitation', 'deadline', 'time limit', 'too late'], confidence: 0.8 }
    ];
    for (const intent of legalIntents) {
      if (intent.patterns) {
        for (const pattern of intent.patterns) {
          if (pattern.test(messageLower)) {
            return { type: intent.type, confidence: intent.confidence + 0.1, method: 'pattern', pattern: pattern.source };
          }
        }
      }
    }
    for (const intent of legalIntents) {
      const matchedKeywords = intent.keywords.filter(keyword => messageLower.includes(keyword));
      if (matchedKeywords.length > 0) {
        const confidence = intent.confidence * (matchedKeywords.length / intent.keywords.length);
        return { type: intent.type, confidence, method: 'keyword', matchedKeywords };
      }
    }
    return { type: 'GENERAL_LEGAL', confidence: 0.3, method: 'fallback' };
  }
}

module.exports = { IntentDetector };
