/**
 * AI Service
 * Handles OpenAI API integration for enhanced chatbot responses
 * when AI is enabled in the configuration.
 */

const Logger = require('../utils/logger');

class AIService {
  constructor(config) {
    this.config = config || {};
    this.logger = new Logger('AIService');
    this.isInitialized = false;
    this.openai = null;
  }

  /**
   * Initialize AI service with OpenAI configuration
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      this.logger.info('Initializing AI service');

      // Check if OpenAI API key is available
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not found in environment variables');
      }

      // Initialize OpenAI client (placeholder for actual OpenAI SDK)
      // TODO: Replace with actual OpenAI SDK initialization
      this.openai = {
        apiKey: apiKey,
        model: this.config.model || 'gpt-3.5-turbo',
        temperature: this.config.temperature || 0.7,
        maxTokens: this.config.max_tokens || 150
      };

      this.isInitialized = true;
      this.logger.info('AI service initialized successfully');
      return true;

    } catch (error) {
      this.logger.error(`Failed to initialize AI service: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate AI-powered response
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Previous conversation messages
   * @param {Object} config - Chatbot configuration
   * @returns {Promise<string>} AI-generated response
   */
  async generateResponse(message, conversationHistory, config) {
    if (!this.isInitialized) {
      throw new Error('AI service not initialized');
    }

    try {
      this.logger.info('Generating AI response');

      // Build system prompt based on configuration
      const systemPrompt = this.buildSystemPrompt(config);

      // Build conversation context
      const messages = this.buildMessageContext(systemPrompt, conversationHistory, message);

      // Generate response using OpenAI
      const response = await this.callOpenAI(messages);

      this.logger.info('AI response generated successfully');
      return response;

    } catch (error) {
      this.logger.error(`Error generating AI response: ${error.message}`);
      // Fallback to rule-based response
      return this.getFallbackResponse(config);
    }
  }

  /**
   * Build system prompt for AI
   * @param {Object} config - Chatbot configuration
   * @returns {string} System prompt
   */
  buildSystemPrompt(config) {
    const businessName = config.business_name || 'our business';
    const industry = config.industry || 'general';
    const contact = config.contact || {};

    const industryContexts = {
      legal: `You are an AI assistant for ${businessName}, a law firm. You help potential clients with general information about legal services, consultation appointments, and basic legal questions. You cannot provide specific legal advice, but you can direct clients to schedule consultations with attorneys. Always be professional, empathetic, and encourage clients to speak with qualified attorneys for legal advice.`,

      real_estate: `You are an AI assistant for ${businessName}, a real estate agency. You help potential clients with information about properties, market trends, buying/selling processes, and scheduling viewings. You provide general information but always encourage clients to work with licensed real estate agents for specific transactions.`,

      ecommerce: `You are an AI assistant for ${businessName}, an online store. You help customers with product information, order status, return policies, and general customer service questions. You provide helpful information while encouraging customers to contact support for complex issues.`,

      general: `You are an AI assistant for ${businessName}. You help customers with general information, answer questions about services, and provide helpful guidance. Always be professional, friendly, and encourage customers to contact the business for specific assistance.`
    };

    const basePrompt = industryContexts[industry] || industryContexts.general;

    return `${basePrompt}

Contact Information:
- Phone: ${contact.phone || 'Available on website'}
- Email: ${contact.email || 'Available on website'}
- Website: ${contact.website || 'Available on website'}

Guidelines:
1. Be helpful and professional
2. Don't make up information you don't have
3. Encourage human contact for complex issues
4. Keep responses concise and clear
5. Use appropriate emojis sparingly
6. Always provide contact information when relevant`;
  }

  /**
   * Build message context for OpenAI API
   * @param {string} systemPrompt - System prompt
   * @param {Array} conversationHistory - Previous messages
   * @param {string} currentMessage - Current user message
   * @returns {Array} Message array for OpenAI
   */
  buildMessageContext(systemPrompt, conversationHistory, currentMessage) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add recent conversation history (limit to last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: currentMessage
    });

    return messages;
  }

  /**
   * Call OpenAI API (placeholder implementation)
   * @param {Array} messages - Message array
   * @returns {Promise<string>} AI response
   */
  async callOpenAI(messages) {
    // TODO: Replace with actual OpenAI API call
    // This is a placeholder implementation

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For now, return a contextual response based on the last user message
      const lastUserMessage = messages[messages.length - 1].content.toLowerCase();

      if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi')) {
        return "Hello! I'm here to help you with any questions you might have. How can I assist you today?";
      }

      if (lastUserMessage.includes('thank')) {
        return "You're very welcome! Is there anything else I can help you with?";
      }

      if (lastUserMessage.includes('bye') || lastUserMessage.includes('goodbye')) {
        return "Thank you for chatting with us! Have a great day, and feel free to reach out if you need anything else.";
      }

      // Default contextual response
      return "I understand your question. Let me help you with that. Could you provide a bit more context so I can give you the most accurate information?";

    } catch (error) {
      this.logger.error(`OpenAI API call failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get fallback response when AI fails
   * @param {Object} config - Chatbot configuration
   * @returns {string} Fallback response
   */
  getFallbackResponse(config) {
    const fallbackResponses = [
      "I'm having trouble processing that right now. Let me connect you with our team for personalized assistance.",
      "I apologize, but I'm experiencing some technical difficulties. Our team is here to help you directly.",
      "I'm sorry, I couldn't generate a proper response. Please contact our support team for immediate assistance."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  /**
   * Analyze conversation sentiment
   * @param {Array} conversationHistory - Conversation messages
   * @returns {Object} Sentiment analysis result
   */
  async analyzeSentiment(conversationHistory) {
    if (!this.isInitialized) {
      return { sentiment: 'neutral', confidence: 0 };
    }

    try {
      // TODO: Implement actual sentiment analysis
      // This is a placeholder implementation

      const recentMessages = conversationHistory.slice(-5);
      let positiveCount = 0;
      let negativeCount = 0;

      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'satisfied'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'disappointed'];

      recentMessages.forEach(msg => {
        const content = msg.content.toLowerCase();
        positiveCount += positiveWords.filter(word => content.includes(word)).length;
        negativeCount += negativeWords.filter(word => content.includes(word)).length;
      });

      if (positiveCount > negativeCount) {
        return { sentiment: 'positive', confidence: 0.7 };
      } else if (negativeCount > positiveCount) {
        return { sentiment: 'negative', confidence: 0.7 };
      } else {
        return { sentiment: 'neutral', confidence: 0.5 };
      }

    } catch (error) {
      this.logger.error(`Sentiment analysis failed: ${error.message}`);
      return { sentiment: 'neutral', confidence: 0 };
    }
  }

  /**
   * Extract key topics from conversation
   * @param {Array} conversationHistory - Conversation messages
   * @returns {Array} Extracted topics
   */
  async extractTopics(conversationHistory) {
    if (!this.isInitialized) {
      return [];
    }

    try {
      // TODO: Implement actual topic extraction
      // This is a placeholder implementation

      const topics = [];
      const topicKeywords = {
        'pricing': ['price', 'cost', 'fee', 'payment', 'budget'],
        'services': ['service', 'product', 'offer', 'provide'],
        'appointments': ['appointment', 'schedule', 'meeting', 'consultation'],
        'contact': ['contact', 'call', 'email', 'reach']
      };

      conversationHistory.forEach(msg => {
        const content = msg.content.toLowerCase();
        Object.keys(topicKeywords).forEach(topic => {
          if (topicKeywords[topic].some(keyword => content.includes(keyword))) {
            if (!topics.includes(topic)) {
              topics.push(topic);
            }
          }
        });
      });

      return topics;

    } catch (error) {
      this.logger.error(`Topic extraction failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Check if AI service is ready
   * @returns {boolean} Initialization status
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Get AI service configuration
   * @returns {Object} Configuration
   */
  getConfig() {
    return this.config;
  }
}

module.exports = AIService;
