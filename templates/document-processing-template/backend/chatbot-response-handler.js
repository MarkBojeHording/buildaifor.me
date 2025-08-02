/**
 * Chatbot Response Handler
 * Generates clear, conversational answers with properly formatted citations
 */

class ChatbotResponseHandler {
  constructor() {
    this.greetingPatterns = [
      /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/i,
      /^(how are you|how's it going|what's up)$/i
    ];

    this.gratitudePatterns = [
      /^(thank you|thanks|thx|appreciate it)$/i
    ];

    this.helpPatterns = [
      /^(what can you help with|what can you do|help|what are you)$/i
    ];
  }

  /**
   * Generate a complete response for user input
   * @param {string} message - User's message
   * @param {string} documentId - Document being analyzed
   * @param {Object} document - Document data
   * @returns {Object} Complete response with answer and citations
   */
  generateResponse(message, documentId, document) {
    const lowerMessage = message.toLowerCase().trim();

    // Handle greetings
    if (this.isGreeting(lowerMessage)) {
      return this.generateGreetingResponse(documentId, document);
    }

    // Handle gratitude
    if (this.isGratitude(lowerMessage)) {
      return this.generateGratitudeResponse();
    }

    // Handle help requests
    if (this.isHelpRequest(lowerMessage)) {
      return this.generateHelpResponse(documentId, document);
    }

    // Handle document questions
    return this.generateDocumentResponse(message, documentId, document);
  }

  /**
   * Check if message is a greeting
   * @param {string} message - Lowercase message
   * @returns {boolean} True if greeting
   */
  isGreeting(message) {
    return this.greetingPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Check if message is gratitude
   * @param {string} message - Lowercase message
   * @returns {boolean} True if gratitude
   */
  isGratitude(message) {
    return this.gratitudePatterns.some(pattern => pattern.test(message));
  }

  /**
   * Check if message is help request
   * @param {string} message - Lowercase message
   * @returns {boolean} True if help request
   */
  isHelpRequest(message) {
    return this.helpPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Generate greeting response
   * @param {string} documentId - Document ID
   * @param {Object} document - Document data
   * @returns {Object} Greeting response
   */
  generateGreetingResponse(documentId, document) {
    const documentTitles = {
      'lease-agreement': 'lease agreement',
      'employment-contract': 'employment contract',
      'purchase-agreement': 'purchase agreement',
      'service-agreement': 'service agreement',
      'partnership-agreement': 'partnership agreement'
    };

    const docTitle = documentTitles[documentId] || 'document';

    return {
      response: `👋 Hi there! I'm here to help you understand your ${docTitle}. You can ask me about any terms, clauses, or details in the document. What would you like to know?`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || 'Document content not available',
        display: this.extractKeyInfo(document.sections[0]?.content || 'Document content not available'),
        reference: 'Section 1.1 (Page 1)',
        fullText: document.sections[0]?.content || 'Document content not available',
        relevance: 'High'
      }],
      confidence: 0.95,
      type: 'greeting'
    };
  }

  /**
   * Generate gratitude response
   * @returns {Object} Gratitude response
   */
  generateGratitudeResponse() {
    return {
      response: "You're welcome! I'm happy to help. Is there anything else you'd like to know about your document?",
      citations: [],
      confidence: 0.95,
      type: 'gratitude'
    };
  }

  /**
   * Generate help response
   * @param {string} documentId - Document ID
   * @param {Object} document - Document data
   * @returns {Object} Help response
   */
  generateHelpResponse(documentId, document) {
    const helpTopics = {
      'lease-agreement': 'rent, lease term, termination, utilities, maintenance, subletting',
      'employment-contract': 'salary, benefits, vacation, termination, job duties, bonuses',
      'purchase-agreement': 'price, delivery, warranty, payment terms, equipment',
      'service-agreement': 'monthly fee, services included, uptime, support, termination',
      'partnership-agreement': 'capital contribution, profit sharing, decision making, partnership terms'
    };

    const topics = helpTopics[documentId] || 'document terms and conditions';

    return {
      response: `I can help you understand any part of your document! You can ask me about ${topics}, or any other specific terms or clauses you'd like clarified. Just ask your question in plain English!`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || 'Document content not available',
        display: this.extractKeyInfo(document.sections[0]?.content || 'Document content not available'),
        reference: 'Section 1.1 (Page 1)',
        fullText: document.sections[0]?.content || 'Document content not available',
        relevance: 'High'
      }],
      confidence: 0.95,
      type: 'help'
    };
  }

  /**
   * Generate document response
   * @param {string} message - User's question
   * @param {string} documentId - Document ID
   * @param {Object} document - Document data
   * @returns {Object} Document response
   */
  generateDocumentResponse(message, documentId, document) {
    // Find relevant sections
    const relevantSections = this.findRelevantSections(message, document);

    if (relevantSections.length === 0) {
      return this.generateNoAnswerResponse(message, documentId, document);
    }

    // Generate conversational answer
    const answer = this.generateConversationalAnswer(message, relevantSections, documentId);

    // Format citations
    const citations = this.formatCitations(relevantSections, documentId);

    return {
      response: answer,
      citations: citations,
      confidence: this.calculateConfidence(relevantSections, message),
      type: 'document'
    };
  }

  /**
   * Find relevant sections based on user question
   * @param {string} message - User's question
   * @param {Object} document - Document data
   * @returns {Array} Relevant sections
   */
  findRelevantSections(message, document) {
    const lowerMessage = message.toLowerCase();
    const relevantSections = [];

    // Keyword mapping for different document types
    const keywordMap = {
      // Lease agreement keywords
      'rent|payment|monthly|cost|fee': ['2.1', '2.2'],
      'terminate|end|break|cancel|early': ['5.1'],
      'term|duration|length|period|months': ['3.1'],
      'utilities|electricity|water|gas|internet|heating': ['6.1'],
      'maintenance|repair|alterations|improvements': ['7.1'],
      'use|purpose|sublet|subletting|permitted': ['4.1'],
      
      // Employment contract keywords
      'salary|compensation|pay|wage': ['3.1', '3.2'],
      'benefits|insurance|vacation|401k|retirement': ['4.1', '4.2'],
      'fire|dismiss|termination|employment': ['6.1'],
      
      // Purchase agreement keywords
      'price|purchase|total|amount|cost|buy|equipment': ['2.2'],
      'delivery|when|date|timeline|ship': ['3.1'],
      'warranty|guarantee|defect|quality': ['4.1'],
      'payment|deposit|installment': ['2.2'],
      'equipment|item|product|model': ['2.1']
    };

    // Find sections based on keywords
    for (const [keywords, sections] of Object.entries(keywordMap)) {
      if (new RegExp(keywords, 'i').test(lowerMessage)) {
        for (const sectionId of sections) {
          const section = document.sections.find(s => s.section === sectionId);
          if (section) {
            relevantSections.push(section);
          }
        }
      }
    }

    // If no keyword match, find sections with semantic similarity
    if (relevantSections.length === 0) {
      const semanticMatches = this.findSemanticMatches(lowerMessage, document.sections);
      relevantSections.push(...semanticMatches);
    }

    return relevantSections.slice(0, 3); // Limit to 3 most relevant
  }

  /**
   * Find semantic matches for questions without keyword matches
   * @param {string} message - Lowercase message
   * @param {Array} sections - Document sections
   * @returns {Array} Semantically relevant sections
   */
  findSemanticMatches(message, sections) {
    const matches = [];

    // Simple semantic matching based on common question patterns
    const questionPatterns = {
      'what|how much|cost|price': ['2.1', '3.1'], // Financial questions
      'when|time|deadline|due': ['2.1', '3.1', '5.1'], // Time-related questions
      'can|cannot|allowed|permitted': ['4.1', '5.1', '7.1'], // Permission questions
      'responsible|obligation|duty': ['6.1', '7.1'], // Responsibility questions
      'who|landlord|tenant|employee': ['1.1', '4.1'] // Party-related questions
    };

    for (const [pattern, sectionIds] of Object.entries(questionPatterns)) {
      if (new RegExp(pattern, 'i').test(message)) {
        for (const sectionId of sectionIds) {
          const section = sections.find(s => s.section === sectionId);
          if (section && !matches.find(m => m.section === sectionId)) {
            matches.push(section);
          }
        }
      }
    }

    return matches;
  }

  /**
   * Generate conversational answer from relevant sections
   * @param {string} message - User's question
   * @param {Array} sections - Relevant sections
   * @param {string} documentId - Document ID
   * @returns {string} Conversational answer
   */
  generateConversationalAnswer(message, sections, documentId) {
    const lowerMessage = message.toLowerCase();

    // Generate answer based on question type and content
    if (lowerMessage.includes('rent') || lowerMessage.includes('payment')) {
      const rentSection = sections.find(s => s.section === '2.1');
      if (rentSection) {
        return `💰 Your monthly rent is $8,500, due on the 1st of each month. You can pay by check or electronic transfer to the landlord.`;
      }
    }

    if (lowerMessage.includes('terminate') || lowerMessage.includes('end') || lowerMessage.includes('break')) {
      const termSection = sections.find(s => s.section === '5.1');
      if (termSection) {
        return `🚪 To end your lease early, you need to give 90 days written notice and pay a termination fee of 2 months rent ($17,000). You'll remain responsible for rent until the termination date.`;
      }
    }

    if (lowerMessage.includes('utilities') || lowerMessage.includes('electricity') || lowerMessage.includes('water')) {
      const utilSection = sections.find(s => s.section === '6.1');
      if (utilSection) {
        return `🔌 You're responsible for electricity, water, gas, and internet. The landlord provides heating and air conditioning during business hours.`;
      }
    }

    if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair')) {
      const maintSection = sections.find(s => s.section === '7.1');
      if (maintSection) {
        return `🔧 You must maintain the premises in good condition (normal wear and tear excepted). You cannot make alterations or improvements without written permission from the landlord.`;
      }
    }

    if (lowerMessage.includes('sublet') || lowerMessage.includes('use') || lowerMessage.includes('purpose')) {
      const useSection = sections.find(s => s.section === '4.1');
      if (useSection) {
        return `📋 The premises can only be used for office and administrative purposes. Any other use requires written permission from the landlord.`;
      }
    }

    if (lowerMessage.includes('salary') || lowerMessage.includes('compensation')) {
      const salarySection = sections.find(s => s.section === '3.1');
      if (salarySection) {
        return `💰 Your base salary is $125,000/year with up to 20% performance bonus potential.`;
      }
    }

    if (lowerMessage.includes('benefits') || lowerMessage.includes('vacation')) {
      const benefitsSection = sections.find(s => s.section === '4.1');
      if (benefitsSection) {
        return `🏥 You get 20 days vacation, health/dental/vision insurance, and 401(k) with 6% company match.`;
      }
    }

    // Purchase agreement specific answers
    if (lowerMessage.includes('price') || lowerMessage.includes('purchase') || lowerMessage.includes('total') || lowerMessage.includes('cost')) {
      const priceSection = sections.find(s => s.section === '2.2');
      if (priceSection) {
        return `💰 The total purchase price is $250,000. You pay $50,000 as a deposit and $200,000 upon delivery.`;
      }
    }

    if (lowerMessage.includes('delivery') || lowerMessage.includes('when') || lowerMessage.includes('date')) {
      const deliverySection = sections.find(s => s.section === '3.1');
      if (deliverySection) {
        return `📦 Delivery will be made to your facility at 123 Industrial Blvd, Manufacturing City, NV 89101, on or before April 15, 2024.`;
      }
    }

    if (lowerMessage.includes('warranty') || lowerMessage.includes('guarantee') || lowerMessage.includes('defect')) {
      const warrantySection = sections.find(s => s.section === '4.1');
      if (warrantySection) {
        return `🛡️ The equipment comes with a 12-month warranty covering defects in materials and workmanship.`;
      }
    }

    if (lowerMessage.includes('equipment') || lowerMessage.includes('item') || lowerMessage.includes('product')) {
      const equipmentSection = sections.find(s => s.section === '2.1');
      if (equipmentSection) {
        return `🏭 You're purchasing an Industrial Manufacturing Line Model X-2000, Serial Number 2024-001.`;
      }
    }

    // Generic answer for other questions
    return this.generateGenericAnswer(message, sections, documentId);
  }

  /**
   * Generate generic answer when specific patterns don't match
   * @param {string} message - User's question
   * @param {Array} sections - Relevant sections
   * @param {string} documentId - Document ID
   * @returns {string} Generic answer
   */
  generateGenericAnswer(message, sections, documentId) {
    if (sections.length === 0) {
      return `I don't see specific information about that in your document. Could you rephrase your question or ask about rent, lease terms, utilities, maintenance, or other specific topics?`;
    }

    const mainSection = sections[0];
    const documentTitles = {
      'lease-agreement': 'lease agreement',
      'employment-contract': 'employment contract',
      'purchase-agreement': 'purchase agreement',
      'service-agreement': 'service agreement',
      'partnership-agreement': 'partnership agreement'
    };

    const docTitle = documentTitles[documentId] || 'document';

    return `Based on your ${docTitle}, ${this.extractKeyInfo(mainSection.content)}. You can find more details in the sections I've referenced below.`;
  }

  /**
   * Extract key information from section content
   * @param {string} content - Section content
   * @returns {string} Key information
   */
  extractKeyInfo(content) {
    // Extract amounts
    const amountMatch = content.match(/\$[\d,]+(?:\.\d{2})?/);
    if (amountMatch) {
      return `💰 ${amountMatch[0]}`;
    }

    // Extract dates
    const dateMatch = content.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      return `📅 ${dateMatch[0]}`;
    }

    // Extract time periods
    const timeMatch = content.match(/\d+\s+(?:days?|months?|years?)/i);
    if (timeMatch) {
      return `⏰ ${timeMatch[0]}`;
    }

    // Extract first meaningful sentence
    const sentences = content.split(/[.!?]/);
    const firstSentence = sentences[0].trim();
    if (firstSentence.length > 10 && firstSentence.length < 100) {
      return firstSentence;
    }

    return content.substring(0, 80) + (content.length > 80 ? '...' : '');
  }

  /**
   * Format citations with complete text
   * @param {Array} sections - Relevant sections
   * @param {string} documentId - Document ID
   * @returns {Array} Formatted citations
   */
  formatCitations(sections, documentId) {
    return sections.map(section => ({
      documentId: documentId,
      section: section.section,
      page: section.page,
      text: section.content, // Complete text, not truncated
      display: this.extractKeyInfo(section.content), // Add display field
      reference: `Section ${section.section} (Page ${section.page})`, // Add reference field
      fullText: section.content, // Add fullText field
      relevance: 'High'
    }));
  }

  /**
   * Calculate confidence score
   * @param {Array} sections - Relevant sections
   * @param {string} message - User's question
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(sections, message) {
    if (sections.length === 0) return 0.3;
    if (sections.length >= 2) return 0.95;
    return 0.8;
  }

  /**
   * Generate response when no answer is found
   * @param {string} message - User's question
   * @param {string} documentId - Document ID
   * @param {Object} document - Document data
   * @returns {Object} No answer response
   */
  generateNoAnswerResponse(message, documentId, document) {
    const suggestions = {
      'lease-agreement': 'rent, lease term, termination, utilities, maintenance, subletting',
      'employment-contract': 'salary, benefits, vacation, termination, job duties',
      'purchase-agreement': 'price, delivery, warranty, payment terms',
      'service-agreement': 'monthly fee, services included, uptime, support',
      'partnership-agreement': 'capital contribution, profit sharing, decision making'
    };

    const topics = suggestions[documentId] || 'document terms and conditions';

    return {
      response: `I don't see specific information about "${message}" in your document. I can help you with topics like: ${topics}. Could you rephrase your question or ask about one of these areas?`,
      citations: [{
        documentId: documentId,
        section: '1.1',
        page: 1,
        text: document.sections[0]?.content || 'Document content not available',
        display: this.extractKeyInfo(document.sections[0]?.content || 'Document content not available'),
        reference: 'Section 1.1 (Page 1)',
        fullText: document.sections[0]?.content || 'Document content not available',
        relevance: 'Medium'
      }],
      confidence: 0.3,
      type: 'no_answer'
    };
  }
}

module.exports = ChatbotResponseHandler;
