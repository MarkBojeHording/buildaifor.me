// Enhanced Response Generator - EXACT REPLICATION from Node.js backend

interface RawResponse {
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

interface FormattedResponse {
  message: string
  keyPoints: string[]
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
  followUp?: string
  showMoreCitations: boolean
}

export class EnhancedResponseGenerator {
  private conversationContext: Map<string, any>

  constructor() {
    this.conversationContext = new Map()
  }

  /**
   * Format response with conversational tone and smart citations - EXACT REPLICATION
   */
  formatResponse(rawResponse: RawResponse, message: string, documentId: string): FormattedResponse {
    try {
      // Extract components
      const { response, citations, confidence } = rawResponse

      // Convert to conversational tone
      const conversationalResponse = this.makeConversational(response, message)

      // Select and format top citations
      const formattedCitations = this.formatCitations(citations, 2)

      // Generate follow-up question
      const followUp = this.generateFollowUp(message, confidence)

      // Structure the response
      return {
        message: conversationalResponse,
        keyPoints: this.extractKeyPoints(response),
        citations: formattedCitations,
        confidence: confidence,
        followUp: followUp,
        showMoreCitations: citations.length > 2
      }

    } catch (error) {
      console.error('Error formatting response:', error)
      return this.getErrorResponse(message)
    }
  }

  /**
   * Convert formal response to conversational tone - EXACT REPLICATION
   */
  private makeConversational(response: string, message: string): string {
    let conversational = response

    // Remove formal legal language
    conversational = conversational
      .replace(/According to Section [\d.]+ on page \d+,\s*/gi, '')
      .replace(/According to the document,\s*/gi, '')
      .replace(/The document states that\s*/gi, '')
      .replace(/It is stated that\s*/gi, '')

    // Add conversational elements
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('how much') || lowerMessage.includes('cost') || lowerMessage.includes('payment')) {
      conversational = `💰 ${conversational}`
    } else if (lowerMessage.includes('when') || lowerMessage.includes('time') || lowerMessage.includes('deadline')) {
      conversational = `⏰ ${conversational}`
    } else if (lowerMessage.includes('can i') || lowerMessage.includes('allowed') || lowerMessage.includes('permitted')) {
      conversational = `✅ ${conversational}`
    } else if (lowerMessage.includes('terminate') || lowerMessage.includes('end') || lowerMessage.includes('cancel')) {
      conversational = `🚪 ${conversational}`
    }

    // Add personality elements
    conversational = this.addPersonalityElements(conversational, message)

    return conversational
  }

  /**
   * Add personality elements to responses - EXACT REPLICATION
   */
  private addPersonalityElements(response: string, message: string): string {
    const lowerMessage = message.toLowerCase()

    // Add appropriate personality elements
    if (lowerMessage.includes('thank')) {
      return `You're welcome! ${response}`
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return `Great question! ${response}`
    }

    if (lowerMessage.includes('confused') || lowerMessage.includes('unclear')) {
      return `Let me clarify that for you: ${response}`
    }

    if (lowerMessage.includes('important') || lowerMessage.includes('critical')) {
      return `This is indeed important: ${response}`
    }

    return response
  }

  /**
   * Format citations with smart selection - EXACT REPLICATION
   */
  private formatCitations(citations: Array<{
    documentId: string
    section: string
    page: number
    text?: string
    display?: string
    reference?: string
    fullText?: string
  }>, maxCount: number = 2): Array<{
    documentId: string
    section: string
    page: number
    text?: string
    display?: string
    reference?: string
    fullText?: string
  }> {
    // Sort citations by relevance (simplified scoring)
    const sortedCitations = citations.sort((a, b) => {
      const aScore = this.calculateCitationRelevance(a)
      const bScore = this.calculateCitationRelevance(b)
      return bScore - aScore
    })

    // Take top citations and format them
    return sortedCitations.slice(0, maxCount).map(citation => ({
      ...citation,
      display: citation.display || `Section ${citation.section}`,
      reference: citation.reference || `Section ${citation.section} on page ${citation.page}`,
      text: citation.text || this.extractKeyInfo(citation.fullText || '')
    }))
  }

  /**
   * Calculate citation relevance - EXACT REPLICATION
   */
  private calculateCitationRelevance(citation: {
    documentId: string
    section: string
    page: number
    text?: string
    display?: string
    reference?: string
    fullText?: string
  }): number {
    let score = 0

    // Higher score for earlier sections (usually more important)
    const sectionNumber = parseFloat(citation.section)
    if (sectionNumber <= 3) score += 2
    else if (sectionNumber <= 5) score += 1

    // Higher score for content length (more detailed)
    const contentLength = citation.fullText?.length || 0
    if (contentLength > 200) score += 1
    else if (contentLength > 100) score += 0.5

    // Higher score for specific legal terms
    const legalTerms = ['payment', 'terminate', 'liability', 'confidential', 'warrant', 'represent']
    const lowerContent = citation.fullText?.toLowerCase() || ''
    for (const term of legalTerms) {
      if (lowerContent.includes(term)) score += 0.5
    }

    return score
  }

  /**
   * Extract key information from text - EXACT REPLICATION
   */
  private extractKeyInfo(text: string): string {
    if (!text) return ''

    // Remove common legal boilerplate
    let info = text
      .replace(/This.*?Agreement.*?between.*?and.*?\./i, '')
      .replace(/The parties hereby.*?\./i, '')
      .replace(/This document.*?\./i, '')
      .trim()

    // Clean up extra spaces and punctuation
    info = info.replace(/\s+/g, ' ').replace(/\.+$/, '')

    // Limit length for display
    if (info.length > 150) {
      info = info.substring(0, 150) + '...'
    }

    return info || text.substring(0, 100) + '...'
  }

  /**
   * Extract key points from response - EXACT REPLICATION
   */
  private extractKeyPoints(response: string): string[] {
    const keyPoints: string[] = []
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10)

    // Extract sentences with key information
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase()

      // Look for sentences with important legal terms
      const importantTerms = [
        'payment', 'terminate', 'liability', 'confidential', 'warrant', 'represent',
        'dollars', 'days', 'months', 'years', 'shall', 'must', 'agree'
      ]

      const hasImportantTerm = importantTerms.some(term => lowerSentence.includes(term))

      if (hasImportantTerm && sentence.trim().length > 20) {
        keyPoints.push(sentence.trim())
      }

      // Limit to 3 key points
      if (keyPoints.length >= 3) break
    }

    return keyPoints.length > 0 ? keyPoints : [response.substring(0, 100) + '...']
  }

  /**
   * Generate follow-up question - EXACT REPLICATION
   */
  private generateFollowUp(message: string, confidence: number): string | undefined {
    const lowerMessage = message.toLowerCase()

    // Don't generate follow-up for low confidence responses
    if (confidence < 0.5) return undefined

    // Generate contextual follow-up questions
    if (lowerMessage.includes('payment') || lowerMessage.includes('cost') || lowerMessage.includes('amount')) {
      return 'Would you like to know about the payment schedule or late payment penalties?'
    }

    if (lowerMessage.includes('terminate') || lowerMessage.includes('end') || lowerMessage.includes('cancel')) {
      return 'Would you like to know about the termination process or any penalties for early termination?'
    }

    if (lowerMessage.includes('duration') || lowerMessage.includes('term') || lowerMessage.includes('length')) {
      return 'Would you like to know about renewal options or extension terms?'
    }

    if (lowerMessage.includes('use') || lowerMessage.includes('purpose') || lowerMessage.includes('premises')) {
      return 'Would you like to know about restrictions on use or permitted activities?'
    }

    if (lowerMessage.includes('utilities') || lowerMessage.includes('maintenance')) {
      return 'Would you like to know about utility responsibilities or maintenance obligations?'
    }

    if (lowerMessage.includes('benefits') || lowerMessage.includes('vacation') || lowerMessage.includes('insurance')) {
      return 'Would you like to know about additional benefits or eligibility requirements?'
    }

    // Generic follow-up for other questions
    return 'Is there anything else about this contract you\'d like me to explain?'
  }

  /**
   * Generate contextual response based on conversation history - EXACT REPLICATION
   */
  private generateContextualResponse(conversationHistory: Array<{role: string, content: string}>, currentMessage: string): string {
    if (conversationHistory.length === 0) return currentMessage

    // Extract topics from conversation history
    const topics = this.extractTopics(conversationHistory)

    // Add context if relevant
    if (topics.length > 0) {
      return `Building on our previous discussion about ${topics.join(', ')}, ${currentMessage}`
    }

    return currentMessage
  }

  /**
   * Extract topics from conversation history - EXACT REPLICATION
   */
  private extractTopics(messages: Array<{role: string, content: string}>): string[] {
    const topics: string[] = []
    const topicKeywords = {
      'payment': ['payment', 'rent', 'salary', 'fee', 'amount', 'dollars'],
      'termination': ['terminate', 'end', 'cancel', 'notice'],
      'duration': ['term', 'length', 'months', 'years'],
      'use': ['use', 'purpose', 'premises', 'office'],
      'utilities': ['utilities', 'electricity', 'water', 'gas'],
      'maintenance': ['maintain', 'repair', 'condition'],
      'benefits': ['benefits', 'vacation', 'holidays', 'insurance'],
      'confidentiality': ['confidential', 'proprietary', 'disclose'],
      'noncompete': ['compete', 'competition', 'radius'],
      'warranty': ['warrant', 'represent', 'title']
    }

    for (const message of messages) {
      const lowerContent = message.content.toLowerCase()

      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        for (const keyword of keywords) {
          if (lowerContent.includes(keyword) && !topics.includes(topic)) {
            topics.push(topic)
            break
          }
        }
      }
    }

    return topics.slice(0, 3) // Limit to 3 topics
  }

  /**
   * Get welcome message - EXACT REPLICATION
   */
  private getWelcomeMessage(): string {
    return `👋 Welcome! I'm your legal document assistant. I can help you understand contracts, identify key terms, and answer questions about legal documents. What would you like to know?`
  }

  /**
   * Get error response - EXACT REPLICATION
   */
  private getErrorResponse(message: string): FormattedResponse {
    return {
      message: "I apologize, but I'm having trouble processing your request right now. Please try rephrasing your question or ask about a different aspect of the document.",
      keyPoints: ['Try rephrasing your question', 'Ask about specific terms or clauses', 'Check your document selection'],
      citations: [],
      confidence: 0.1,
      showMoreCitations: false
    }
  }

  /**
   * Format simple response - EXACT REPLICATION
   */
  private formatSimpleResponse(question: string, answer: string, citation: {
    documentId: string
    section: string
    page: number
    text?: string
    display?: string
    reference?: string
    fullText?: string
  }): FormattedResponse {
    return {
      message: answer,
      keyPoints: [answer],
      citations: [citation],
      confidence: 0.8,
      showMoreCitations: false
    }
  }
}
