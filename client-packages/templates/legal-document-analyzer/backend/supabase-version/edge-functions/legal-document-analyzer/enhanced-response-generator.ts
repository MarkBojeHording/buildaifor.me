// Enhanced Response Generator - Legal Document Analyzer Client Package
// Professional legal response formatting and enhancement
// Target: Law firms, corporate legal departments, legal professionals

interface RawResponse {
  response: string;
  citations: Array<{
    documentId: string;
    section: string;
    page: number;
    text: string;
    relevance: 'High' | 'Medium' | 'Low';
  }>;
  confidence: number;
  type: 'document' | 'greeting' | 'help' | 'no_answer';
}

interface FormattedResponse {
  response: string;
  citations: Array<{
    documentId: string;
    section: string;
    page: number;
    text: string;
    display: string;
    reference: string;
    fullText: string;
    relevance: 'High' | 'Medium' | 'Low';
  }>;
  confidence: number;
  type: 'document' | 'greeting' | 'help' | 'no_answer';
  follow_up_questions?: string[];
  key_points?: string[];
}

export class EnhancedResponseGenerator {
  private conversationContext: Map<string, any>;
  private legalPersonalityElements: string[];
  private followUpTemplates: Map<string, string[]>;

  constructor() {
    this.conversationContext = new Map();
    this.legalPersonalityElements = [
      'Based on my legal analysis',
      'From a legal perspective',
      'In terms of legal implications',
      'From a compliance standpoint',
      'Regarding legal requirements'
    ];

    // Legal professional follow-up question templates
    this.followUpTemplates = new Map([
      ['commercial-lease', [
        'Would you like me to analyze the termination provisions?',
        'Should I review the maintenance and repair obligations?',
        'Would you like me to assess the security deposit terms?',
        'Should I examine the use restrictions and zoning compliance?'
      ]],
      ['employment-contract', [
        'Would you like me to review the non-compete provisions?',
        'Should I analyze the intellectual property assignment clauses?',
        'Would you like me to assess the termination and severance terms?',
        'Should I examine the confidentiality obligations?'
      ]],
      ['purchase-agreement', [
        'Would you like me to review the representations and warranties?',
        'Should I analyze the indemnification provisions?',
        'Would you like me to assess the closing conditions?',
        'Should I examine the due diligence requirements?'
      ]],
      ['service-agreement', [
        'Would you like me to review the scope of services?',
        'Should I analyze the payment terms and late fees?',
        'Would you like me to assess the intellectual property provisions?',
        'Should I examine the limitation of liability clauses?'
      ]],
      ['partnership-agreement', [
        'Would you like me to review the capital contribution terms?',
        'Should I analyze the profit and loss sharing provisions?',
        'Would you like me to assess the decision-making authority?',
        'Should I examine the partnership dissolution procedures?'
      ]]
    ]);
  }

  /**
   * Format and enhance the raw response for legal professionals
   */
  formatResponse(rawResponse: RawResponse, message: string, documentId: string): FormattedResponse {
    try {
      const { response, citations, confidence, type } = rawResponse;

      // Make the response more conversational for legal professionals
      const conversationalResponse = this.makeConversationalLegal(response, message);

      // Format citations with legal relevance scoring
      const formattedCitations = this.formatLegalCitations(citations, 3);

      // Extract key legal points
      const keyPoints = this.extractLegalKeyPoints(response);

      // Generate follow-up questions for legal professionals
      const followUp = this.generateLegalFollowUp(message, confidence, documentId);

      return {
        response: conversationalResponse,
        citations: formattedCitations,
        confidence: confidence,
        type: type,
        follow_up_questions: followUp,
        key_points: keyPoints
      };

    } catch (error) {
      console.error('Error in formatResponse:', error);
      return this.getErrorResponse(message);
    }
  }

  /**
   * Make the response more conversational for legal professionals
   */
  private makeConversationalLegal(response: string, message: string): string {
    let conversationalResponse = response;

    // Add legal personality elements for document analysis
    if (response.includes('Based on my analysis') || response.includes('📋')) {
      conversationalResponse = this.addLegalPersonalityElements(conversationalResponse);
    }

    // Add contextual legal insights
    conversationalResponse = this.addLegalContext(conversationalResponse, message);

    // Ensure professional legal tone
    conversationalResponse = this.ensureLegalProfessionalTone(conversationalResponse);

    return conversationalResponse;
  }

  /**
   * Add legal personality elements to the response
   */
  private addLegalPersonalityElements(response: string): string {
    const personalityElement = this.legalPersonalityElements[
      Math.floor(Math.random() * this.legalPersonalityElements.length)
    ];

    if (!response.includes(personalityElement)) {
      response = response.replace('📋 Based on my analysis', `📋 ${personalityElement}`);
    }

    return response;
  }

  /**
   * Add legal context to the response
   */
  private addLegalContext(response: string, message: string): string {
    const lowerMessage = message.toLowerCase();

    // Add risk assessment context
    if (lowerMessage.includes('risk') || lowerMessage.includes('liability')) {
      if (!response.includes('Risk Level')) {
        response += '\n\n**Risk Assessment**: This provision should be carefully reviewed for potential legal exposure.';
      }
    }

    // Add compliance context
    if (lowerMessage.includes('compliance') || lowerMessage.includes('regulation')) {
      if (!response.includes('compliance')) {
        response += '\n\n**Compliance Note**: Consider regulatory requirements and industry standards.';
      }
    }

    // Add negotiation context
    if (lowerMessage.includes('negotiate') || lowerMessage.includes('modify')) {
      response += '\n\n**Negotiation Point**: This provision may be subject to negotiation based on market standards.';
    }

    return response;
  }

  /**
   * Ensure professional legal tone
   */
  private ensureLegalProfessionalTone(response: string): string {
    // Replace casual language with professional legal terms
    response = response.replace(/you should know/g, 'it is important to note');
    response = response.replace(/you need to/g, 'it is recommended to');
    response = response.replace(/you have to/g, 'it is required to');
    response = response.replace(/you can/g, 'you may');
    response = response.replace(/you'll/g, 'you will');

    // Add legal disclaimers for high-risk content
    if (response.includes('Risk Level: HIGH')) {
      response += '\n\n**Legal Disclaimer**: This analysis is for informational purposes only and should not be considered legal advice. Consult with qualified legal counsel for specific legal matters.';
    }

    return response;
  }

  /**
   * Format citations with legal relevance scoring
   */
  private formatLegalCitations(citations: RawResponse['citations'], maxCitations: number): FormattedResponse['citations'] {
    return citations.slice(0, maxCitations).map(citation => {
      const relevanceScore = this.calculateCitationRelevance(citation);
      const display = this.generateCitationDisplay(citation);
      const reference = this.generateCitationReference(citation);

      return {
        documentId: citation.documentId,
        section: citation.section,
        page: citation.page,
        text: citation.text,
        display: display,
        reference: reference,
        fullText: citation.text,
        relevance: relevanceScore
      };
    });
  }

  /**
   * Calculate citation relevance for legal professionals
   */
  private calculateCitationRelevance(citation: RawResponse['citations'][0]): 'High' | 'Medium' | 'Low' {
    let score = 0;

    // Check for legal terminology
    const legalTerms = ['indemnification', 'liability', 'warranty', 'termination', 'breach', 'confidentiality'];
    for (const term of legalTerms) {
      if (citation.text.toLowerCase().includes(term)) {
        score += 2;
      }
    }

    // Check for monetary amounts
    if (/\$[\d,]+/.test(citation.text)) {
      score += 1;
    }

    // Check for time periods
    if (/(\d+)\s*(days?|months?|years?)/i.test(citation.text)) {
      score += 1;
    }

    // Check for percentages
    if (/(\d+(?:\.\d+)?)\s*%/.test(citation.text)) {
      score += 1;
    }

    if (score >= 4) return 'High';
    if (score >= 2) return 'Medium';
    return 'Low';
  }

  /**
   * Generate citation display for legal professionals
   */
  private generateCitationDisplay(citation: RawResponse['citations'][0]): string {
    const text = citation.text;

    // Extract monetary amounts
    const moneyMatch = text.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (moneyMatch) {
      return `💰 ${moneyMatch[0]} - ${citation.section}`;
    }

    // Extract time periods
    const timeMatch = text.match(/(\d+)\s*(days?|months?|years?)/i);
    if (timeMatch) {
      return `⏰ ${timeMatch[0]} - ${citation.section}`;
    }

    // Extract percentages
    const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
    if (percentMatch) {
      return `📊 ${percentMatch[0]} - ${citation.section}`;
    }

    // Default display
    return `${citation.section} (Page ${citation.page})`;
  }

  /**
   * Generate citation reference for legal professionals
   */
  private generateCitationReference(citation: RawResponse['citations'][0]): string {
    return `${citation.section} (Page ${citation.page})`;
  }

  /**
   * Extract key legal points from the response
   */
  private extractLegalKeyPoints(response: string): string[] {
    const keyPoints: string[] = [];

    // Extract risk levels
    if (response.includes('Risk Level: HIGH')) {
      keyPoints.push('High-risk provision requiring careful review');
    } else if (response.includes('Risk Level: MEDIUM')) {
      keyPoints.push('Moderate risk considerations present');
    }

    // Extract legal concepts
    const legalConcepts = response.match(/\*\*Key Legal Concepts\*\*: ([^*]+)/);
    if (legalConcepts) {
      keyPoints.push(`Legal concepts: ${legalConcepts[1].trim()}`);
    }

    // Extract monetary amounts
    const moneyMatch = response.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (moneyMatch) {
      keyPoints.push(`Financial terms: ${moneyMatch.join(', ')}`);
    }

    // Extract time periods
    const timeMatch = response.match(/(\d+)\s*(days?|months?|years?)/gi);
    if (timeMatch) {
      keyPoints.push(`Timeframes: ${timeMatch.join(', ')}`);
    }

    return keyPoints.length > 0 ? keyPoints : ['Document analysis completed'];
  }

  /**
   * Generate follow-up questions for legal professionals
   */
  private generateLegalFollowUp(message: string, confidence: number, documentId: string): string[] {
    if (confidence < 0.5) {
      return [
        'Could you clarify which specific legal concept you\'d like me to analyze?',
        'Would you like me to review a different section of the document?',
        'Should I focus on a particular type of legal provision?'
      ];
    }

    const templates = this.followUpTemplates.get(documentId) || [
      'Would you like me to analyze other provisions in this document?',
      'Should I review related legal concepts?',
      'Would you like me to assess compliance implications?'
    ];

    // Return 2-3 relevant follow-up questions
    return templates.slice(0, 3);
  }

  /**
   * Get error response for legal professionals
   */
  private getErrorResponse(message: string): FormattedResponse {
    return {
      response: 'I apologize, but I encountered an error while analyzing your legal document. Please try rephrasing your question or contact support if the issue persists. For urgent legal matters, please consult with qualified legal counsel.',
      citations: [],
      confidence: 0.1,
      type: 'no_answer',
      follow_up_questions: [
        'Would you like to try asking about a different legal concept?',
        'Should I review a different section of the document?',
        'Would you like me to provide a general overview of the document?'
      ],
      key_points: ['Error occurred during legal analysis']
    };
  }

  /**
   * Generate contextual response for specific legal queries
   */
  generateContextualResponse(message: string, documentId: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('risk')) {
      return 'I can help you identify and assess risk levels in different provisions of the document. Would you like me to analyze specific clauses for potential legal exposure?';
    }

    if (lowerMessage.includes('compliance')) {
      return 'I can review the document for compliance with relevant laws and regulations. Which specific compliance areas would you like me to examine?';
    }

    if (lowerMessage.includes('negotiation')) {
      return 'I can identify provisions that may be subject to negotiation based on market standards and legal best practices. Which terms would you like me to analyze?';
    }

    return 'I\'m here to help with your legal document analysis. What specific aspect would you like me to examine?';
  }

  /**
   * Extract legal topics from the message
   */
  extractLegalTopics(message: string): string[] {
    const topics: string[] = [];
    const legalTerms = [
      'indemnification', 'liability', 'warranty', 'representation',
      'termination', 'breach', 'default', 'remedy',
      'confidentiality', 'non-compete', 'intellectual property',
      'governing law', 'jurisdiction', 'dispute resolution'
    ];

    for (const term of legalTerms) {
      if (message.toLowerCase().includes(term)) {
        topics.push(term);
      }
    }

    return topics;
  }

  /**
   * Get welcome message for legal professionals
   */
  getWelcomeMessage(documentId: string): string {
    const documentTitles = {
      'commercial-lease': 'Commercial Lease Agreement',
      'employment-contract': 'Employment Agreement',
      'purchase-agreement': 'Asset Purchase Agreement',
      'service-agreement': 'Professional Services Agreement',
      'partnership-agreement': 'General Partnership Agreement'
    };

    const docTitle = documentTitles[documentId as keyof typeof documentTitles] || 'legal document';

    return `👨‍💼 Welcome to your AI Legal Document Analyzer! I'm here to help you analyze your ${docTitle}.

I can assist you with:
• **Legal Concept Identification** - Identify key legal concepts and their implications
• **Risk Assessment** - Evaluate risk levels for different provisions
• **Citation References** - Provide precise section and page references
• **Compliance Review** - Check for regulatory compliance
• **Clause Analysis** - Analyze specific terms and conditions

What would you like to know about this document?`;
  }
}
