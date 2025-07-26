/**
 * Response Generator
 * Handles response generation using template matching, dynamic content insertion,
 * and fallback response handling for enhanced rule-based chatbots.
 */

const Logger = require('../utils/logger');

class ResponseGenerator {
  constructor(config) {
    this.config = config;
    this.logger = new Logger('ResponseGenerator');
    this.templates = this.loadTemplates();
  }

  /**
   * Load response templates from configuration
   * @returns {Object} Response templates
   */
  loadTemplates() {
    const templates = {};

    if (this.config.responses) {
      Object.keys(this.config.responses).forEach(key => {
        templates[key] = this.config.responses[key];
      });
    }

    return templates;
  }

  /**
   * Generate response based on processed message
   * @param {Object} processedMessage - Processed message with intent
   * @param {Object} context - Conversation context
   * @returns {Promise<string>} Generated response
   */
  async generate(processedMessage, context = {}) {
    try {
      this.logger.info(`Generating response for intent: ${processedMessage.intent}`);

      let response = '';

      // Check if we have a template for the detected intent
      if (processedMessage.intent && this.templates[processedMessage.intent]) {
        response = this.templates[processedMessage.intent];
        this.logger.info(`Using template response for intent: ${processedMessage.intent}`);
      } else {
        // Use fallback response
        response = this.getFallbackResponse(processedMessage, context);
        this.logger.info('Using fallback response');
      }

      // Process dynamic content in response
      response = this.processDynamicContent(response, context);

      // Format response for better presentation
      response = this.formatResponse(response, processedMessage);

      return response;

    } catch (error) {
      this.logger.error(`Error generating response: ${error.message}`);
      return this.getErrorResponse();
    }
  }

  /**
   * Get fallback response when no intent matches
   * @param {Object} processedMessage - Processed message
   * @param {Object} context - Conversation context
   * @returns {string} Fallback response
   */
  getFallbackResponse(processedMessage, context) {
    // Check if custom fallback is configured
    if (this.config.fallback_response) {
      return this.config.fallback_response;
    }

    // Generate industry-specific fallback
    const industry = this.config.industry || 'general';
    const contact = this.config.contact || {};

    const fallbackTemplates = {
      legal: `I don't have specific information about that legal matter, but our attorneys can help!\n\n📞 Call us: ${contact.phone || '(555) LAW-FIRM'}\n📧 Email: ${contact.email || 'info@lawfirm.com'}\n🌐 Visit: ${contact.website || 'www.lawfirm.com'}\n\nFor legal advice, please schedule a consultation with our experienced attorneys.`,

      real_estate: `I don't have specific information about that property, but our agents can help!\n\n📞 Call us: ${contact.phone || '(555) REAL-EST'}\n📧 Email: ${contact.email || 'info@realestate.com'}\n🌐 Visit: ${contact.website || 'www.realestate.com'}\n\nOur experienced agents are available to answer all your real estate questions.`,

      ecommerce: `I don't have specific information about that product, but our support team can help!\n\n📞 Call us: ${contact.phone || '(555) SUPPORT'}\n📧 Email: ${contact.email || 'support@store.com'}\n🌐 Visit: ${contact.website || 'www.store.com'}\n\nOur customer service team is available to answer all your questions.`,

      general: `I'm sorry, I don't have specific information about that. Here's how you can get help:\n\n📞 Call us: ${contact.phone || '(555) 123-4567'}\n📧 Email: ${contact.email || 'info@business.com'}\n🌐 Visit: ${contact.website || 'www.business.com'}\n\nOur team is available during business hours to assist you personally!`
    };

    return fallbackTemplates[industry] || fallbackTemplates.general;
  }

  /**
   * Process dynamic content in response templates
   * @param {string} response - Response template
   * @param {Object} context - Conversation context
   * @returns {string} Processed response
   */
  processDynamicContent(response, context) {
    let processedResponse = response;

    // Replace contact information placeholders
    if (this.config.contact) {
      processedResponse = processedResponse.replace(/\{phone\}/g, this.config.contact.phone || '');
      processedResponse = processedResponse.replace(/\{email\}/g, this.config.contact.email || '');
      processedResponse = processedResponse.replace(/\{website\}/g, this.config.contact.website || '');
      processedResponse = processedResponse.replace(/\{address\}/g, this.config.contact.address || '');
    }

    // Replace business name placeholder
    if (this.config.business_name) {
      processedResponse = processedResponse.replace(/\{business_name\}/g, this.config.business_name);
    }

    // Replace context-specific placeholders
    if (context.userName) {
      processedResponse = processedResponse.replace(/\{user_name\}/g, context.userName);
    }

    if (context.previousTopic) {
      processedResponse = processedResponse.replace(/\{previous_topic\}/g, context.previousTopic);
    }

    // Replace time-based placeholders
    const now = new Date();
    processedResponse = processedResponse.replace(/\{current_time\}/g, now.toLocaleTimeString());
    processedResponse = processedResponse.replace(/\{current_date\}/g, now.toLocaleDateString());

    return processedResponse;
  }

  /**
   * Format response for better presentation
   * @param {string} response - Raw response
   * @param {Object} processedMessage - Processed message
   * @returns {string} Formatted response
   */
  formatResponse(response, processedMessage) {
    let formattedResponse = response;

    // Add greeting for first-time users
    if (processedMessage.context && processedMessage.context.isFirstMessage) {
      const greeting = this.getGreeting(processedMessage.context);
      formattedResponse = `${greeting}\n\n${formattedResponse}`;
    }

    // Add urgency indicators
    if (processedMessage.urgency === 'high') {
      formattedResponse = `🚨 URGENT: ${formattedResponse}`;
    }

    // Add sentiment-based modifiers
    if (processedMessage.sentiment === 'negative') {
      formattedResponse = `I understand your concern. ${formattedResponse}`;
    }

    // Add lead qualification prompts
    if (processedMessage.leadSignals && processedMessage.leadSignals.buyingIntent) {
      formattedResponse += '\n\nWould you like me to connect you with our team for more detailed information?';
    }

    return formattedResponse;
  }

  /**
   * Get appropriate greeting based on context
   * @param {Object} context - Conversation context
   * @returns {string} Greeting message
   */
  getGreeting(context) {
    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }

    const businessName = this.config.business_name || 'our team';
    return `${timeGreeting}! Welcome to ${businessName}. I'm here to help you with any questions you may have.`;
  }

  /**
   * Get error response when generation fails
   * @returns {string} Error response
   */
  getErrorResponse() {
    const errorResponses = [
      "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
      "I apologize, but I'm experiencing some technical difficulties. Our team is working to resolve this.",
      "I'm sorry, I couldn't generate a proper response. Please contact our support team for assistance."
    ];

    return errorResponses[Math.floor(Math.random() * errorResponses.length)];
  }

  /**
   * Generate contextual response based on conversation history
   * @param {Array} conversationHistory - Previous messages
   * @param {Object} currentMessage - Current message
   * @returns {string} Contextual response
   */
  generateContextualResponse(conversationHistory, currentMessage) {
    // Analyze conversation context
    const recentMessages = conversationHistory.slice(-3);
    const topics = this.extractTopics(recentMessages);

    // Generate contextual response
    if (topics.length > 0) {
      const mainTopic = topics[0];
      return `Regarding ${mainTopic}, ${this.getFallbackResponse(currentMessage, {})}`;
    }

    return this.getFallbackResponse(currentMessage, {});
  }

  /**
   * Extract topics from conversation history
   * @param {Array} messages - Recent messages
   * @returns {Array} Extracted topics
   */
  extractTopics(messages) {
    const topics = [];
    const topicKeywords = {
      'pricing': ['price', 'cost', 'fee', 'payment', 'budget'],
      'services': ['service', 'product', 'offer', 'provide'],
      'appointments': ['appointment', 'schedule', 'meeting', 'consultation'],
      'contact': ['contact', 'call', 'email', 'reach']
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
   * Add response template
   * @param {string} intent - Intent key
   * @param {string} response - Response template
   */
  addTemplate(intent, response) {
    this.templates[intent] = response;
  }

  /**
   * Get all available templates
   * @returns {Object} All response templates
   */
  getTemplates() {
    return this.templates;
  }
}

module.exports = ResponseGenerator;
