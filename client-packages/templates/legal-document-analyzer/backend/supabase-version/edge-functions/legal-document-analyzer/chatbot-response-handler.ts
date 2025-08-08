// Chatbot Response Handler - Legal Document Analyzer Client Package
// Professional legal document analysis with intelligent response generation
// Target: Law firms, corporate legal departments, legal professionals

import { LegalDocument, DocumentSection } from './legal-documents-data.ts';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

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

export class ChatbotResponseHandler {
  private greetingPatterns: RegExp[];
  private gratitudePatterns: RegExp[];
  private helpPatterns: RegExp[];
  private legalTermPatterns: RegExp[];

  constructor() {
    // Legal professional greeting patterns
    this.greetingPatterns = [
      /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/i,
      /^(how are you|how's it going|what's up)$/i,
      /^(thank you for your assistance|appreciate your help)$/i
    ];

    // Legal professional gratitude patterns
    this.gratitudePatterns = [
      /^(thank you|thanks|thx|appreciate it|much obliged)$/i,
      /^(thank you for the analysis|appreciate the review)$/i
    ];

    // Legal professional help patterns
    this.helpPatterns = [
      /^(what can you help with|what can you do|help|what are you)$/i,
      /^(how does this work|what documents can you analyze)$/i,
      /^(what legal concepts can you identify|can you review contracts)$/i
    ];

    // Legal terminology patterns for enhanced analysis
    this.legalTermPatterns = [
      /(indemnification|liability|warranty|representation)/i,
      /(termination|breach|default|remedy)/i,
      /(confidentiality|non-compete|intellectual property)/i,
      /(governing law|jurisdiction|dispute resolution)/i,
      /(force majeure|material adverse change|closing conditions)/i
    ];
  }

  /**
   * Generate a comprehensive legal analysis response
   */
  async generateResponse(
    message: string,
    documentId: string,
    document: LegalDocument,
    conversationHistory: ConversationMessage[] = []
  ): Promise<RawResponse> {
    const lowerMessage = message.toLowerCase().trim();

    // Handle greetings for legal professionals
    if (this.isGreeting(lowerMessage)) {
      return this.generateLegalGreetingResponse(documentId, document);
    }

    // Handle gratitude responses
    if (this.isGratitude(lowerMessage)) {
      return this.generateLegalGratitudeResponse();
    }

    // Handle help requests
    if (this.isHelpRequest(lowerMessage)) {
      return this.generateLegalHelpResponse(documentId, document);
    }

    // Handle document-specific legal analysis
    return this.generateLegalDocumentResponse(message, documentId, document, conversationHistory);
  }

  /**
   * Check if message is a greeting
   */
  private isGreeting(message: string): boolean {
    return this.greetingPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Check if message is gratitude
   */
  private isGratitude(message: string): boolean {
    return this.gratitudePatterns.some(pattern => pattern.test(message));
  }

  /**
   * Check if message is help request
   */
  private isHelpRequest(message: string): boolean {
    return this.helpPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Generate greeting response for legal professionals
   */
  private generateLegalGreetingResponse(documentId: string, document: LegalDocument): RawResponse {
    const documentTitles = {
      'commercial-lease': 'Commercial Lease Agreement',
      'employment-contract': 'Employment Agreement',
      'purchase-agreement': 'Asset Purchase Agreement',
      'service-agreement': 'Professional Services Agreement',
      'partnership-agreement': 'General Partnership Agreement'
    };

    const docTitle = documentTitles[documentId as keyof typeof documentTitles] || 'legal document';

    return {
      response: `👨‍💼 Hello! I'm your AI Legal Document Analyzer. I'm here to help you analyze your ${docTitle}. I can identify key legal concepts, assess risk levels, provide citation references, and answer questions about specific clauses and provisions. What would you like to know about this document?`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || 'Document content not available',
        relevance: 'Medium'
      }],
      confidence: 0.95,
      type: 'greeting'
    };
  }

  /**
   * Generate gratitude response for legal professionals
   */
  private generateLegalGratitudeResponse(): RawResponse {
    return {
      response: `You're very welcome! I'm here to support your legal document analysis needs. If you have any other questions about the document or need assistance with legal concept identification, risk assessment, or citation references, please don't hesitate to ask.`,
      citations: [],
      confidence: 0.9,
      type: 'greeting'
    };
  }

  /**
   * Generate help response for legal professionals
   */
  private generateLegalHelpResponse(documentId: string, document: LegalDocument): RawResponse {
    const practiceArea = document.metadata.practiceArea;
    const sections = document.sections.map(s => s.title).join(', ');

    return {
      response: `🔍 I'm your AI Legal Document Analyzer specializing in ${practiceArea}. I can help you with:

• **Legal Concept Identification**: Identify key legal concepts and their implications
• **Risk Assessment**: Evaluate risk levels (low/medium/high) for different provisions
• **Citation References**: Provide precise section and page references with relevance scoring
• **Clause Analysis**: Analyze specific clauses, terms, and conditions
• **Compliance Review**: Check for regulatory compliance and best practices

This document contains ${document.sections.length} sections covering: ${sections}

What specific aspect would you like me to analyze?`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || 'Document content not available',
        relevance: 'Medium'
      }],
      confidence: 0.95,
      type: 'help'
    };
  }

  /**
   * Generate comprehensive legal document analysis response
   */
  private async generateLegalDocumentResponse(
    message: string,
    documentId: string,
    document: LegalDocument,
    conversationHistory: ConversationMessage[]
  ): Promise<RawResponse> {
    // Find relevant sections based on legal concepts and content
    const relevantSections = this.findRelevantLegalSections(message, document);

    if (relevantSections.length === 0) {
      return this.generateNoAnswerResponse(message, documentId, document);
    }

    // Generate conversational legal analysis
    const conversationalAnswer = this.generateConversationalLegalAnswer(message, relevantSections, documentId);

    // Format citations with legal relevance scoring
    const formattedCitations = this.formatLegalCitations(relevantSections, documentId);

    // Calculate confidence based on legal analysis
    const confidence = this.calculateLegalConfidence(relevantSections, message);

    return {
      response: conversationalAnswer,
      citations: formattedCitations,
      confidence: confidence,
      type: 'document'
    };
  }

  /**
   * Find relevant legal sections based on query and legal concepts
   */
  private findRelevantLegalSections(query: string, document: LegalDocument): DocumentSection[] {
    const lowerQuery = query.toLowerCase();
    const relevantSections: Array<{ section: DocumentSection; score: number }> = [];

    for (const section of document.sections) {
      let score = 0;

      // Check for direct keyword matches
      if (section.content.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }

      // Check for legal concept matches
      for (const concept of section.legalConcepts) {
        if (lowerQuery.includes(concept.toLowerCase())) {
          score += 2;
        }
      }

      // Check for section title matches
      if (section.title.toLowerCase().includes(lowerQuery)) {
        score += 2;
      }

      // Check for legal terminology patterns
      if (this.legalTermPatterns.some(pattern => pattern.test(section.content))) {
        score += 1;
      }

      // Risk level relevance
      if (section.riskLevel === 'high' && lowerQuery.includes('risk')) {
        score += 1;
      }

      if (score > 0) {
        relevantSections.push({ section, score });
      }
    }

    // Sort by relevance score and return top matches
    return relevantSections
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.section);
  }

  /**
   * Generate conversational legal analysis answer
   */
  private generateConversationalLegalAnswer(
    message: string,
    sections: DocumentSection[],
    documentId: string
  ): string {
    const primarySection = sections[0];
    const riskLevel = primarySection.riskLevel;
    const legalConcepts = primarySection.legalConcepts;

    let response = `📋 Based on my analysis of the ${primarySection.title} section (Page ${primarySection.page}), `;

    // Extract key information from the section
    const keyInfo = this.extractLegalKeyInfo(primarySection.content);

    response += keyInfo;

    // Add risk assessment if relevant
    if (riskLevel === 'high') {
      response += ` ⚠️ **Risk Level: HIGH** - This provision requires careful attention and may need legal review. `;
    } else if (riskLevel === 'medium') {
      response += ` ⚡ **Risk Level: MEDIUM** - This provision has moderate risk considerations. `;
    }

    // Add legal concept context
    if (legalConcepts.length > 0) {
      response += `\n\n**Key Legal Concepts**: ${legalConcepts.join(', ')}`;
    }

    // Add additional relevant sections if available
    if (sections.length > 1) {
      response += `\n\n**Related Sections**: ${sections.slice(1).map(s => `${s.title} (Page ${s.page})`).join(', ')}`;
    }

    return response;
  }

  /**
   * Extract key legal information from section content
   */
  private extractLegalKeyInfo(content: string): string {
    // Extract monetary amounts
    const moneyMatch = content.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (moneyMatch) {
      return `the document specifies ${moneyMatch.join(' and ')}. `;
    }

    // Extract time periods
    const timeMatch = content.match(/(\d+)\s*(days?|months?|years?)/gi);
    if (timeMatch) {
      return `the document establishes a ${timeMatch.join(' and ')} timeframe. `;
    }

    // Extract percentages
    const percentMatch = content.match(/(\d+(?:\.\d+)?)\s*%/g);
    if (percentMatch) {
      return `the document specifies ${percentMatch.join(' and ')}. `;
    }

    // Default response
    return `the document contains important provisions that require careful review. `;
  }

  /**
   * Format citations with legal relevance scoring
   */
  private formatLegalCitations(sections: DocumentSection[], documentId: string): Array<{
    documentId: string;
    section: string;
    page: number;
    text: string;
    relevance: 'High' | 'Medium' | 'Low';
  }> {
    return sections.map(section => ({
      documentId: documentId,
      section: section.title,
      page: section.page,
      text: section.content.length > 200 ? section.content.substring(0, 200) + '...' : section.content,
      relevance: this.calculateCitationRelevance(section)
    }));
  }

  /**
   * Calculate citation relevance based on legal factors
   */
  private calculateCitationRelevance(section: DocumentSection): 'High' | 'Medium' | 'Low' {
    let score = 0;

    // Risk level scoring
    if (section.riskLevel === 'high') score += 3;
    else if (section.riskLevel === 'medium') score += 2;
    else score += 1;

    // Legal concept density
    score += section.legalConcepts.length;

    // Content length factor
    if (section.content.length > 300) score += 1;

    if (score >= 5) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  }

  /**
   * Calculate confidence based on legal analysis quality
   */
  private calculateLegalConfidence(sections: DocumentSection[], message: string): number {
    if (sections.length === 0) return 0.1;

    let confidence = 0.5; // Base confidence

    // More sections = higher confidence
    confidence += sections.length * 0.1;

    // High-risk sections get higher confidence
    const highRiskSections = sections.filter(s => s.riskLevel === 'high');
    confidence += highRiskSections.length * 0.1;

    // Legal terminology presence increases confidence
    const hasLegalTerms = this.legalTermPatterns.some(pattern => pattern.test(message));
    if (hasLegalTerms) confidence += 0.2;

    // Cap at 0.95
    return Math.min(confidence, 0.95);
  }

  /**
   * Generate response when no relevant information is found
   */
  private generateNoAnswerResponse(message: string, documentId: string, document: LegalDocument): RawResponse {
    const suggestions = {
      'commercial-lease': 'rent terms, lease duration, security deposit, maintenance obligations, early termination',
      'employment-contract': 'salary and benefits, termination provisions, non-compete clauses, intellectual property rights',
      'purchase-agreement': 'purchase price, due diligence, representations and warranties, closing conditions',
      'service-agreement': 'service scope, payment terms, intellectual property, limitation of liability',
      'partnership-agreement': 'capital contributions, profit sharing, decision making, partnership dissolution'
    };

    const docSuggestions = suggestions[documentId as keyof typeof suggestions] || 'legal terms, clauses, and provisions';

    return {
      response: `I don't see specific information about "${message}" in this ${document.title}. I can help you analyze topics like: ${docSuggestions}. Please try asking about these specific areas or rephrase your question to focus on particular legal concepts, clauses, or sections mentioned in the document.`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || 'Document content not available',
        relevance: 'Low'
      }],
      confidence: 0.3,
      type: 'no_answer'
    };
  }
}
