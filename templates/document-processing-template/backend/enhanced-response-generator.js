/**
 * Enhanced Response Generator
 * Converts robotic responses to conversational ones with smart citation management
 */

class EnhancedResponseGenerator {
  constructor() {
    this.conversationContext = new Map();
  }

  /**
   * Format response with conversational tone and smart citations
   * @param {Object} rawResponse - Raw AI response with citations
   * @param {string} message - Original user message
   * @param {string} documentId - Document being analyzed
   * @returns {Object} Formatted response
   */
  formatResponse(rawResponse, message, documentId) {
    try {
      // Extract components
      const { response, citations, confidence } = rawResponse;

      // Convert to conversational tone
      const conversationalResponse = this.makeConversational(response, message);

      // Select and format top citations
      const formattedCitations = this.formatCitations(citations, 2);

      // Generate follow-up question
      const followUp = this.generateFollowUp(message, confidence);

      // Structure the response
      return {
        message: conversationalResponse,
        keyPoints: this.extractKeyPoints(response),
        citations: formattedCitations,
        confidence: confidence,
        followUp: followUp,
        showMoreCitations: citations.length > 2
      };

    } catch (error) {
      console.error('Error formatting response:', error);
      return this.getErrorResponse(message);
    }
  }

  /**
   * Convert formal response to conversational tone
   * @param {string} response - Original response
   * @param {string} message - User's message
   * @returns {string} Conversational response
   */
  makeConversational(response, message) {
    let conversational = response;

    // Remove formal legal language
    conversational = conversational
      .replace(/According to Section [\d.]+ on page \d+,\s*/gi, '')
      .replace(/According to the document,\s*/gi, '')
      .replace(/The document states that\s*/gi, '')
      .replace(/It is stated that\s*/gi, '');

    // Add conversational elements
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('how much') || lowerMessage.includes('cost') || lowerMessage.includes('payment')) {
      conversational = `💰 ${conversational}`;
    } else if (lowerMessage.includes('when') || lowerMessage.includes('time') || lowerMessage.includes('deadline')) {
      conversational = `⏰ ${conversational}`;
    } else if (lowerMessage.includes('can i') || lowerMessage.includes('allowed') || lowerMessage.includes('permitted')) {
      conversational = `✅ ${conversational}`;
    } else if (lowerMessage.includes('terminate') || lowerMessage.includes('end') || lowerMessage.includes('cancel')) {
      conversational = `🚪 ${conversational}`;
    }

    // Add personality elements
    conversational = this.addPersonalityElements(conversational, message);

    return conversational;
  }

  /**
   * Add personality elements to responses
   * @param {string} response - Response text
   * @param {string} message - User's message
   * @returns {string} Response with personality
   */
  addPersonalityElements(response, message) {
    const lowerMessage = message.toLowerCase();

    // Add appropriate personality elements
    if (lowerMessage.includes('thank')) {
      return `You're welcome! ${response}`;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return `Great question! ${response}`;
    }

    if (lowerMessage.includes('confused') || lowerMessage.includes('not sure')) {
      return `Let me clarify that for you. ${response}`;
    }

    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap')) {
      return `I understand this is urgent. ${response}`;
    }

    return response;
  }

  /**
   * Format citations for user-friendly display
   * @param {Array} citations - Raw citations
   * @param {number} maxCount - Maximum citations to show
   * @returns {Array} Formatted citations
   */
  formatCitations(citations, maxCount = 2) {
    if (!citations || citations.length === 0) {
      return [];
    }

    // Select top citations
    const topCitations = citations.slice(0, maxCount);

    return topCitations.map(citation => {
      // Extract key information from citation text
      const keyInfo = this.extractKeyInfo(citation.text);

      return {
        display: keyInfo,
        reference: `Section ${citation.section} (Page ${citation.page})`,
        fullText: citation.text,
        documentId: citation.documentId
      };
    });
  }

  /**
   * Extract key information from citation text
   * @param {string} text - Citation text
   * @returns {string} Key information
   */
  extractKeyInfo(text) {
    // Extract amounts
    const amountMatch = text.match(/\$[\d,]+(?:\.\d{2})?/);
    if (amountMatch) {
      return `💰 ${amountMatch[0]}`;
    }

    // Extract dates
    const dateMatch = text.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      return `📅 ${dateMatch[0]}`;
    }

    // Extract percentages
    const percentMatch = text.match(/\d+%/);
    if (percentMatch) {
      return `📊 ${percentMatch[0]}`;
    }

    // Extract time periods
    const timeMatch = text.match(/\d+\s+(?:days?|months?|years?)/i);
    if (timeMatch) {
      return `⏰ ${timeMatch[0]}`;
    }

    // Default: extract first meaningful phrase
    const sentences = text.split(/[.!?]/);
    const firstSentence = sentences[0].trim();
    if (firstSentence.length > 10 && firstSentence.length < 100) {
      return firstSentence;
    }

    return text.substring(0, 80) + (text.length > 80 ? '...' : '');
  }

  /**
   * Extract key points from response
   * @param {string} response - Response text
   * @returns {Array} Key points
   */
  extractKeyPoints(response) {
    const points = [];

    // Extract amounts
    const amounts = response.match(/\$[\d,]+(?:\.\d{2})?/g);
    if (amounts) {
      points.push(`Amount: ${amounts[0]}`);
    }

    // Extract dates
    const dates = response.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/g);
    if (dates) {
      points.push(`Date: ${dates[0]}`);
    }

    // Extract time periods
    const periods = response.match(/\d+\s+(?:days?|months?|years?)/gi);
    if (periods) {
      points.push(`Duration: ${periods[0]}`);
    }

    // Extract percentages
    const percentages = response.match(/\d+%/g);
    if (percentages) {
      points.push(`Rate: ${percentages[0]}`);
    }

    return points.slice(0, 3); // Max 3 points
  }

  /**
   * Generate follow-up question
   * @param {string} message - User's message
   * @param {number} confidence - Confidence score
   * @returns {string} Follow-up question
   */
  generateFollowUp(message, confidence) {
    const lowerMessage = message.toLowerCase();

    if (confidence < 0.7) {
      return "Could you rephrase your question or ask about something else in the document?";
    }

    // Context-aware follow-ups
    if (lowerMessage.includes('rent') || lowerMessage.includes('payment')) {
      return "Would you like to know about payment methods or late fees?";
    }

    if (lowerMessage.includes('terminate') || lowerMessage.includes('end')) {
      return "Do you need help understanding the termination process?";
    }

    if (lowerMessage.includes('utilities') || lowerMessage.includes('utilities')) {
      return "Would you like to know about maintenance responsibilities?";
    }

    if (lowerMessage.includes('salary') || lowerMessage.includes('compensation')) {
      return "Would you like to know about benefits or bonuses?";
    }

    return "Is there anything else you'd like to know about this document?";
  }

  /**
   * Generate contextual response based on conversation history
   * @param {Array} conversationHistory - Previous messages
   * @param {string} currentMessage - Current message
   * @returns {string} Contextual response
   */
  generateContextualResponse(conversationHistory, currentMessage) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return this.getWelcomeMessage();
    }

    // Analyze recent context
    const recentMessages = conversationHistory.slice(-3);
    const topics = this.extractTopics(recentMessages);

    if (topics.length > 0) {
      const mainTopic = topics[0];
      return `I see you're asking about ${mainTopic}. Let me check that for you...`;
    }

    return "Let me look that up for you...";
  }

  /**
   * Extract topics from conversation history
   * @param {Array} messages - Recent messages
   * @returns {Array} Extracted topics
   */
  extractTopics(messages) {
    const topics = [];
    const topicKeywords = {
      'rent': ['rent', 'payment', 'monthly', 'cost'],
      'termination': ['terminate', 'end', 'cancel', 'break'],
      'utilities': ['utilities', 'electricity', 'water', 'gas'],
      'maintenance': ['maintenance', 'repair', 'fix'],
      'salary': ['salary', 'compensation', 'pay'],
      'benefits': ['benefits', 'insurance', 'vacation']
    };

    messages.forEach(message => {
      const content = message.content.toLowerCase();
      Object.keys(topicKeywords).forEach(topic => {
        if (topicKeywords[topic].some(keyword => content.includes(keyword))) {
          if (!topics.includes(topic)) {
            topics.push(topic);
          }
        }
      });
    });

    return topics;
  }

  /**
   * Get welcome message for first interaction
   * @returns {string} Welcome message
   */
  getWelcomeMessage() {
    return "Hi! I'm here to help you understand your legal documents. I can answer questions about rent, payments, terms, and more. What would you like to know?";
  }

  /**
   * Get error response
   * @param {string} message - Original message
   * @returns {Object} Error response
   */
  getErrorResponse(message) {
    return {
      message: "I don't see that specific detail in your document. Could you rephrase your question, or would you like me to show you what I do have about related topics?",
      keyPoints: [],
      citations: [],
      confidence: 0.3,
      followUp: "What other aspects of the document would you like to know about?",
      showMoreCitations: false
    };
  }

  /**
   * Format response for simple questions
   * @param {string} question - User question
   * @param {string} answer - Direct answer
   * @param {Object} citation - Citation data
   * @returns {Object} Formatted response
   */
  formatSimpleResponse(question, answer, citation) {
    return {
      message: answer,
      keyPoints: [this.extractKeyInfo(citation.text)],
      citations: [{
        display: this.extractKeyInfo(citation.text),
        reference: `Section ${citation.section} (Page ${citation.page})`,
        fullText: citation.text,
        documentId: citation.documentId
      }],
      confidence: 0.9,
      followUp: "Is there anything else you'd like to know?",
      showMoreCitations: false
    };
  }
}

module.exports = EnhancedResponseGenerator;
