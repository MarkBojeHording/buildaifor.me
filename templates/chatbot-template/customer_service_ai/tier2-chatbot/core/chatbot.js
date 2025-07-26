/**
 * Main Chatbot Class
 * Handles the core chatbot functionality including message processing,
 * response generation, and lead capture for Tier 2 chatbots.
 */

const MessageProcessor = require('./message-processor');
const ResponseGenerator = require('./response-generator');
const LeadCapture = require('./lead-capture');
const AIService = require('./ai-service');
const ConfigLoader = require('../utils/config-loader');
const Logger = require('../utils/logger');

class Chatbot {
  constructor(clientId) {
    this.clientId = clientId;
    this.config = null;
    this.messageProcessor = null;
    this.responseGenerator = null;
    this.leadCapture = null;
    this.aiService = null;
    this.conversationHistory = [];
    this.isInitialized = false;

    this.logger = new Logger('Chatbot');
  }

  /**
   * Initialize the chatbot with client configuration
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      this.logger.info(`Initializing chatbot for client: ${this.clientId}`);

      // Load client configuration
      this.config = await ConfigLoader.loadClientConfig(this.clientId);
      if (!this.config) {
        throw new Error(`Configuration not found for client: ${this.clientId}`);
      }

      // Initialize components
      this.messageProcessor = new MessageProcessor(this.config);
      this.responseGenerator = new ResponseGenerator(this.config);
      this.leadCapture = new LeadCapture(this.config);

      // Initialize AI service if enabled
      if (this.config.ai_enabled) {
        this.aiService = new AIService(this.config.openai_config);
        await this.aiService.initialize();
      }

      this.isInitialized = true;
      this.logger.info(`Chatbot initialized successfully for ${this.config.business_name}`);
      return true;

    } catch (error) {
      this.logger.error(`Failed to initialize chatbot: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process incoming message and generate response
   * @param {string} message - User's message
   * @param {Object} context - Conversation context
   * @returns {Promise<Object>} Response object
   */
  async processMessage(message, context = {}) {
    if (!this.isInitialized) {
      throw new Error('Chatbot not initialized. Call initialize() first.');
    }

    try {
      this.logger.info(`Processing message: "${message.substring(0, 50)}..."`);

      // Add message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

      // Process message and determine intent
      const processedMessage = await this.messageProcessor.process(message, context);

      // Check if lead capture is needed
      if (this.leadCapture.shouldCaptureLead(processedMessage, context)) {
        const leadResponse = await this.leadCapture.startCapture(processedMessage, context);
        return {
          response: leadResponse.message,
          type: 'lead_capture',
          data: leadResponse.data
        };
      }

      // Generate response
      let response;
      if (this.config.ai_enabled && this.aiService) {
        response = await this.aiService.generateResponse(message, this.conversationHistory, this.config);
      } else {
        response = await this.responseGenerator.generate(processedMessage, context);
      }

      // Add response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      });

      // Limit conversation history to prevent memory issues
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return {
        response: response,
        type: 'message',
        quickReplies: this.config.quick_replies || []
      };

    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
      return {
        response: this.config.fallback_response || "I'm sorry, I encountered an error. Please try again.",
        type: 'error',
        error: error.message
      };
    }
  }

  /**
   * Handle lead capture form submission
   * @param {Object} leadData - Lead information
   * @returns {Promise<Object>} Lead capture result
   */
  async handleLeadCapture(leadData) {
    if (!this.isInitialized) {
      throw new Error('Chatbot not initialized');
    }

    try {
      const result = await this.leadCapture.processLead(leadData);
      this.logger.info(`Lead captured successfully: ${result.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Lead capture failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get chatbot configuration
   * @returns {Object} Configuration object
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get conversation history
   * @returns {Array} Conversation history
   */
  getConversationHistory() {
    return this.conversationHistory;
  }

  /**
   * Reset conversation history
   */
  resetConversation() {
    this.conversationHistory = [];
    this.logger.info('Conversation history reset');
  }

  /**
   * Check if chatbot is ready
   * @returns {boolean} Initialization status
   */
  isReady() {
    return this.isInitialized;
  }
}

module.exports = Chatbot;
