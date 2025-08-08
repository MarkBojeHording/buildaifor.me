// Chatbot Response Handler - EXACT REPLICATION from Node.js backend

import { Document, DocumentSection } from './document-data.ts'

interface Response {
  response: string
  citations: Array<{
    documentId: string
    section: string
    page: number
    text?: string
    display?: string
    reference?: string
    fullText?: string
  }>
  confidence: number
}

export class ChatbotResponseHandler {
  private greetingPatterns: RegExp[]
  private gratitudePatterns: RegExp[]
  private helpPatterns: RegExp[]

  constructor() {
    this.greetingPatterns = [
      /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/i,
      /^(how are you|how's it going|what's up)$/i
    ]

    this.gratitudePatterns = [
      /^(thank you|thanks|thx|appreciate it)$/i
    ]

    this.helpPatterns = [
      /^(what can you help with|what can you do|help|what are you)$/i
    ]
  }

  /**
   * Generate a complete response for user input - EXACT REPLICATION
   */
  async generateResponse(message: string, documentId: string, document: Document): Promise<Response> {
    const lowerMessage = message.toLowerCase().trim()

    // Handle greetings
    if (this.isGreeting(lowerMessage)) {
      return this.generateGreetingResponse(documentId, document)
    }

    // Handle gratitude
    if (this.isGratitude(lowerMessage)) {
      return this.generateGratitudeResponse()
    }

    // Handle help requests
    if (this.isHelpRequest(lowerMessage)) {
      return this.generateHelpResponse(documentId, document)
    }

    // Handle document questions
    return this.generateDocumentResponse(message, documentId, document)
  }

  /**
   * Check if message is a greeting - EXACT REPLICATION
   */
  private isGreeting(message: string): boolean {
    return this.greetingPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is gratitude - EXACT REPLICATION
   */
  private isGratitude(message: string): boolean {
    return this.gratitudePatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is help request - EXACT REPLICATION
   */
  private isHelpRequest(message: string): boolean {
    return this.helpPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Generate greeting response - EXACT REPLICATION
   */
  private generateGreetingResponse(documentId: string, document: Document): Response {
    const documentTitles = {
      'lease-agreement': 'lease agreement',
      'employment-contract': 'employment contract',
      'purchase-agreement': 'purchase agreement',
      'service-agreement': 'service agreement',
      'partnership-agreement': 'partnership agreement'
    }

    const docTitle = documentTitles[documentId as keyof typeof documentTitles] || 'document'

    return {
      response: `👋 Hi there! I'm here to help you understand your ${docTitle}. You can ask me about any terms, clauses, or details in the document. What would you like to know?`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || '',
        display: 'Document Introduction',
        reference: 'Section 1.1',
        fullText: document.sections[0]?.content || ''
      }],
      confidence: 1.0
    }
  }

  /**
   * Generate gratitude response - EXACT REPLICATION
   */
  private generateGratitudeResponse(): Response {
    return {
      response: "You're very welcome! I'm here to help you understand your legal documents. Is there anything specific about the contract you'd like me to explain?",
      citations: [],
      confidence: 1.0
    }
  }

  /**
   * Generate help response - EXACT REPLICATION
   */
  private generateHelpResponse(documentId: string, document: Document): Response {
    const documentTitles = {
      'lease-agreement': 'lease agreement',
      'employment-contract': 'employment contract',
      'purchase-agreement': 'purchase agreement',
      'service-agreement': 'service agreement',
      'partnership-agreement': 'partnership agreement'
    }

    const docTitle = documentTitles[documentId as keyof typeof documentTitles] || 'document'

    return {
      response: `I can help you analyze your ${docTitle} in several ways:

🔍 **Ask specific questions** about terms, clauses, or sections
💰 **Get payment information** like amounts, due dates, and methods
⏰ **Understand timelines** for termination, renewal, or deadlines
⚠️ **Identify risks** and potential issues in the contract
📋 **Review compliance** with legal requirements
📄 **Get explanations** of complex legal language

Try asking something like:
• "What are the payment terms?"
• "How can I terminate this contract?"
• "What are the key risks in this agreement?"
• "Explain the non-compete clause"`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || '',
        display: 'Document Overview',
        reference: 'Section 1.1',
        fullText: document.sections[0]?.content || ''
      }],
      confidence: 1.0
    }
  }

  /**
   * Generate document response - EXACT REPLICATION
   */
  private async generateDocumentResponse(message: string, documentId: string, document: Document): Promise<Response> {
    try {
      // Find relevant sections
      const relevantSections = this.findRelevantSections(message, document)

      if (relevantSections.length === 0) {
        return this.generateNoAnswerResponse(message, documentId, document)
      }

      // Generate conversational answer
      const answer = this.generateConversationalAnswer(message, relevantSections, documentId)

      // Format citations
      const citations = this.formatCitations(relevantSections, documentId)

      // Calculate confidence
      const confidence = this.calculateConfidence(relevantSections, message)

      return {
        response: answer,
        citations: citations,
        confidence: confidence
      }

    } catch (error) {
      console.error('Error generating document response:', error)
      return this.generateNoAnswerResponse(message, documentId, document)
    }
  }

  /**
   * Find relevant sections - EXACT REPLICATION
   */
  private findRelevantSections(message: string, document: Document): DocumentSection[] {
    const lowerMessage = message.toLowerCase()
    const relevantSections: Array<{section: DocumentSection, score: number}> = []

    // Keywords for different types of questions
    const keywords = {
      payment: ['payment', 'rent', 'salary', 'fee', 'cost', 'price', 'amount', 'dollars', '$'],
      termination: ['terminate', 'termination', 'end', 'cancel', 'notice', 'days', 'months'],
      duration: ['term', 'duration', 'length', 'months', 'years', 'commencing', 'ending'],
      use: ['use', 'purpose', 'premises', 'office', 'business', 'activities'],
      utilities: ['utilities', 'electricity', 'water', 'gas', 'internet', 'heating', 'air conditioning'],
      maintenance: ['maintain', 'repair', 'condition', 'alterations', 'improvements'],
      benefits: ['benefits', 'vacation', 'holidays', 'insurance', '401k', 'bonus'],
      confidentiality: ['confidential', 'proprietary', 'disclose', 'information'],
      noncompete: ['compete', 'competition', 'radius', 'miles', 'months'],
      warranty: ['warrant', 'represent', 'title', 'liens', 'encumbrances'],
      due_diligence: ['due diligence', 'investigation', 'review', 'examination'],
      uptime: ['uptime', 'availability', '99.9%', 'maintenance', 'support'],
      security: ['security', 'data protection', 'privacy', 'compliance']
    }

    // Score each section based on keyword matches
    for (const section of document.sections) {
      let score = 0
      const lowerContent = section.content.toLowerCase()

      // Check for keyword matches
      for (const [category, categoryKeywords] of Object.entries(keywords)) {
        for (const keyword of categoryKeywords) {
          if (lowerMessage.includes(keyword) && lowerContent.includes(keyword)) {
            score += 2
          } else if (lowerMessage.includes(keyword) || lowerContent.includes(keyword)) {
            score += 1
          }
        }
      }

      // Check for semantic matches
      const semanticMatches = this.findSemanticMatches(message, [section])
      score += semanticMatches.length

      if (score > 0) {
        relevantSections.push({ section, score })
      }
    }

    // Sort by score and return top 3
    return relevantSections
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.section)
  }

  /**
   * Find semantic matches - EXACT REPLICATION
   */
  private findSemanticMatches(message: string, sections: DocumentSection[]): DocumentSection[] {
    const lowerMessage = message.toLowerCase()
    const matches: DocumentSection[] = []

    // Common legal terms and their variations
    const legalTerms = {
      'payment': ['payment', 'rent', 'fee', 'amount', 'dollars'],
      'termination': ['terminate', 'end', 'cancel', 'notice'],
      'duration': ['term', 'length', 'commencing', 'ending'],
      'use': ['use', 'purpose', 'premises', 'office'],
      'utilities': ['utilities', 'electricity', 'water', 'gas'],
      'maintenance': ['maintain', 'repair', 'condition'],
      'benefits': ['benefits', 'vacation', 'holidays', 'insurance'],
      'confidentiality': ['confidential', 'proprietary', 'disclose'],
      'noncompete': ['compete', 'competition', 'radius'],
      'warranty': ['warrant', 'represent', 'title'],
      'due_diligence': ['due diligence', 'investigation', 'review'],
      'uptime': ['uptime', 'availability', '99.9%'],
      'security': ['security', 'data protection', 'privacy']
    }

    for (const section of sections) {
      const lowerContent = section.content.toLowerCase()

      for (const [category, terms] of Object.entries(legalTerms)) {
        for (const term of terms) {
          if (lowerMessage.includes(term) && lowerContent.includes(term)) {
            matches.push(section)
            break
          }
        }
      }
    }

    return matches
  }

  /**
   * Generate conversational answer - EXACT REPLICATION
   */
  private generateConversationalAnswer(message: string, sections: DocumentSection[], documentId: string): string {
    const lowerMessage = message.toLowerCase()

    // Extract key information from sections
    const keyInfo = sections.map(section => this.extractKeyInfo(section.content)).join(' ')

    // Generate contextual response based on question type
    if (lowerMessage.includes('how much') || lowerMessage.includes('cost') || lowerMessage.includes('payment')) {
      const amounts = keyInfo.match(/\$[\d,]+/g) || []
      if (amounts.length > 0) {
        return `💰 Based on the contract, the payment amount is ${amounts[0]}. ${keyInfo}`
      }
    }

    if (lowerMessage.includes('when') || lowerMessage.includes('time') || lowerMessage.includes('deadline')) {
      const timeframes = keyInfo.match(/\d+\s*(days?|months?|years?)/gi) || []
      if (timeframes.length > 0) {
        return `⏰ The contract specifies ${timeframes[0]}. ${keyInfo}`
      }
    }

    if (lowerMessage.includes('can i') || lowerMessage.includes('allowed') || lowerMessage.includes('permitted')) {
      if (keyInfo.toLowerCase().includes('shall') || keyInfo.toLowerCase().includes('must')) {
        return `✅ Yes, you are allowed to do this according to the contract. ${keyInfo}`
      } else if (keyInfo.toLowerCase().includes('not') || keyInfo.toLowerCase().includes('prohibited')) {
        return `❌ No, this is not permitted under the contract. ${keyInfo}`
      }
    }

    if (lowerMessage.includes('terminate') || lowerMessage.includes('end') || lowerMessage.includes('cancel')) {
      return `🚪 To terminate this contract, you need to provide notice. ${keyInfo}`
    }

    // Default response
    return `Based on the contract, ${keyInfo}`
  }

  /**
   * Generate generic answer - EXACT REPLICATION
   */
  private generateGenericAnswer(message: string, sections: DocumentSection[], documentId: string): string {
    const keyInfo = sections.map(section => this.extractKeyInfo(section.content)).join(' ')
    return `According to the contract, ${keyInfo}`
  }

  /**
   * Extract key information - EXACT REPLICATION
   */
  private extractKeyInfo(content: string): string {
    // Remove legal boilerplate and extract key information
    let info = content
      .replace(/This.*?Agreement.*?between.*?and.*?\./i, '')
      .replace(/The parties hereby.*?\./i, '')
      .replace(/This document.*?\./i, '')
      .trim()

    // Clean up extra spaces and punctuation
    info = info.replace(/\s+/g, ' ').replace(/\.+$/, '')

    return info || content
  }

  /**
   * Format citations - EXACT REPLICATION
   */
  private formatCitations(sections: DocumentSection[], documentId: string): Array<{
    documentId: string
    section: string
    page: number
    text?: string
    display?: string
    reference?: string
    fullText?: string
  }> {
    return sections.map(section => ({
      documentId: documentId,
      section: section.section,
      page: section.page,
      text: section.content.substring(0, 100) + '...',
      display: `Section ${section.section}`,
      reference: `Section ${section.section} on page ${section.page}`,
      fullText: section.content
    }))
  }

  /**
   * Calculate confidence - EXACT REPLICATION
   */
  private calculateConfidence(sections: DocumentSection[], message: string): number {
    if (sections.length === 0) return 0.1

    const lowerMessage = message.toLowerCase()
    let confidence = 0.5

    // Increase confidence based on keyword matches
    const keywords = ['payment', 'terminate', 'duration', 'use', 'utilities', 'maintenance', 'benefits']
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        confidence += 0.1
      }
    }

    // Increase confidence based on number of relevant sections
    confidence += Math.min(sections.length * 0.1, 0.3)

    return Math.min(confidence, 0.95)
  }

  /**
   * Generate no answer response - EXACT REPLICATION
   */
  private generateNoAnswerResponse(message: string, documentId: string, document: Document): Response {
    const documentTitles = {
      'lease-agreement': 'lease agreement',
      'employment-contract': 'employment contract',
      'purchase-agreement': 'purchase agreement',
      'service-agreement': 'service agreement',
      'partnership-agreement': 'partnership agreement'
    }

    const docTitle = documentTitles[documentId as keyof typeof documentTitles] || 'document'

    return {
      response: `I don't see specific information about "${message}" in this ${docTitle}. You might want to ask about:
• Payment terms and amounts
• Contract duration and termination
• Rights and obligations
• Specific clauses or sections
• Compliance requirements

Or try rephrasing your question to be more specific about what you're looking for.`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || '',
        display: 'Document Overview',
        reference: 'Section 1.1',
        fullText: document.sections[0]?.content || ''
      }],
      confidence: 0.2
    }
  }
}
