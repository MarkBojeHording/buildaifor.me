/**
 * Lead Capture
 * Handles lead capture functionality including form generation, validation,
 * and lead qualification for enhanced chatbot interactions.
 */

const Logger = require('../utils/logger');
const Validators = require('../utils/validators');

class LeadCapture {
  constructor(config) {
    this.config = config;
    this.logger = new Logger('LeadCapture');
    this.requiredFields = config.lead_capture?.required_fields || [];
    this.optionalFields = config.lead_capture?.optional_fields || [];
    this.captureState = {};
  }

  /**
   * Check if lead capture should be triggered
   * @param {Object} processedMessage - Processed message
   * @param {Object} context - Conversation context
   * @returns {boolean} Whether to trigger lead capture
   */
  shouldCaptureLead(processedMessage, context) {
    // Check if lead capture is enabled
    if (!this.config.lead_capture?.enabled) {
      return false;
    }

    // Check for buying intent signals
    if (processedMessage.leadSignals?.buyingIntent) {
      return true;
    }

    // Check for ready to act signals
    if (processedMessage.leadSignals?.readyToAct) {
      return true;
    }

    // Check for specific keywords that indicate lead capture opportunity
    const leadKeywords = [
      'interested', 'want to', 'need help', 'contact me', 'call me',
      'schedule', 'appointment', 'consultation', 'quote', 'estimate'
    ];

    const messageLower = processedMessage.original.toLowerCase();
    if (leadKeywords.some(keyword => messageLower.includes(keyword))) {
      return true;
    }

    // Check conversation length (capture after 3+ exchanges)
    if (context.messageCount && context.messageCount >= 3) {
      return true;
    }

    return false;
  }

  /**
   * Start lead capture process
   * @param {Object} processedMessage - Processed message
   * @param {Object} context - Conversation context
   * @returns {Object} Lead capture response
   */
  async startCapture(processedMessage, context) {
    try {
      this.logger.info('Starting lead capture process');

      // Initialize capture state
      this.captureState = {
        step: 0,
        fields: {},
        context: context,
        startTime: new Date().toISOString()
      };

      // Generate initial capture message
      const message = this.generateCaptureMessage();
      const formData = this.generateFormData();

      return {
        message: message,
        data: {
          type: 'lead_capture',
          step: this.captureState.step,
          fields: formData,
          required: this.requiredFields,
          optional: this.optionalFields
        }
      };

    } catch (error) {
      this.logger.error(`Error starting lead capture: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process lead capture form submission
   * @param {Object} leadData - Lead information
   * @returns {Promise<Object>} Lead capture result
   */
  async processLead(leadData) {
    try {
      this.logger.info('Processing lead capture submission');

      // Validate required fields
      const validationResult = this.validateLeadData(leadData);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Enrich lead data
      const enrichedLead = this.enrichLeadData(leadData);

      // Save lead (placeholder for database integration)
      const savedLead = await this.saveLead(enrichedLead);

      // Generate success response
      const response = this.generateSuccessResponse(enrichedLead);

      return {
        success: true,
        lead: savedLead,
        message: response,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.logger.error(`Error processing lead: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate lead capture message
   * @returns {string} Capture message
   */
  generateCaptureMessage() {
    const industry = this.config.industry || 'general';
    const businessName = this.config.business_name || 'our team';

    const messages = {
      legal: `Great! I'd love to connect you with our legal team for a personalized consultation. To get started, I'll need a few details from you.`,

      real_estate: `Perfect! Let me gather some information so our real estate agents can help you find the perfect property.`,

      ecommerce: `Excellent! I'd like to help you find the right product. Let me get some details to provide you with the best recommendations.`,

      general: `I'd be happy to connect you with our team for personalized assistance. Let me gather a few details to better serve you.`
    };

    return messages[industry] || messages.general;
  }

  /**
   * Generate form data structure
   * @returns {Object} Form field definitions
   */
  generateFormData() {
    const formData = {};

    // Add required fields
    this.requiredFields.forEach(field => {
      formData[field] = {
        type: this.getFieldType(field),
        required: true,
        label: this.getFieldLabel(field),
        placeholder: this.getFieldPlaceholder(field),
        options: this.getFieldOptions(field)
      };
    });

    // Add optional fields
    this.optionalFields.forEach(field => {
      formData[field] = {
        type: this.getFieldType(field),
        required: false,
        label: this.getFieldLabel(field),
        placeholder: this.getFieldPlaceholder(field),
        options: this.getFieldOptions(field)
      };
    });

    return formData;
  }

  /**
   * Get field type based on field name
   * @param {string} field - Field name
   * @returns {string} Field type
   */
  getFieldType(field) {
    const fieldTypes = {
      name: 'text',
      email: 'email',
      phone: 'tel',
      case_type: 'select',
      property_interest: 'select',
      product_interest: 'select',
      budget_range: 'select',
      case_description: 'textarea',
      urgency: 'select',
      timeline: 'select',
      preferred_location: 'text',
      property_type: 'select',
      use_case: 'textarea',
      experience_level: 'select',
      preferred_brand: 'text'
    };

    return fieldTypes[field] || 'text';
  }

  /**
   * Get field label
   * @param {string} field - Field name
   * @returns {string} Field label
   */
  getFieldLabel(field) {
    const labels = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      case_type: 'Type of Case',
      property_interest: 'Property Interest',
      product_interest: 'Product Interest',
      budget_range: 'Budget Range',
      case_description: 'Case Description',
      urgency: 'Urgency Level',
      timeline: 'Timeline',
      preferred_location: 'Preferred Location',
      property_type: 'Property Type',
      use_case: 'Use Case',
      experience_level: 'Experience Level',
      preferred_brand: 'Preferred Brand'
    };

    return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Get field placeholder
   * @param {string} field - Field name
   * @returns {string} Field placeholder
   */
  getFieldPlaceholder(field) {
    const placeholders = {
      name: 'Enter your full name',
      email: 'Enter your email address',
      phone: 'Enter your phone number',
      case_description: 'Briefly describe your case',
      preferred_location: 'Enter preferred location',
      use_case: 'Describe how you plan to use this',
      preferred_brand: 'Enter preferred brand'
    };

    return placeholders[field] || `Enter ${field.replace(/_/g, ' ')}`;
  }

  /**
   * Get field options for select fields
   * @param {string} field - Field name
   * @returns {Array} Field options
   */
  getFieldOptions(field) {
    const configOptions = this.config.lead_capture;

    switch (field) {
      case 'case_type':
        return configOptions?.case_types || [];
      case 'property_interest':
        return configOptions?.property_types || [];
      case 'product_interest':
        return configOptions?.product_categories || [];
      case 'budget_range':
        return configOptions?.budget_ranges || [];
      case 'urgency':
        return ['Low', 'Medium', 'High', 'Urgent'];
      case 'timeline':
        return ['Immediately', 'Within 1 week', 'Within 1 month', 'Within 3 months', 'No rush'];
      case 'property_type':
        return configOptions?.property_types || [];
      case 'experience_level':
        return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      default:
        return [];
    }
  }

  /**
   * Validate lead data
   * @param {Object} leadData - Lead information
   * @returns {Object} Validation result
   */
  validateLeadData(leadData) {
    const errors = [];

    // Check required fields
    this.requiredFields.forEach(field => {
      if (!leadData[field] || leadData[field].trim() === '') {
        errors.push(`${this.getFieldLabel(field)} is required`);
      }
    });

    // Validate email format
    if (leadData.email && !Validators.isValidEmail(leadData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone format
    if (leadData.phone && !Validators.isValidPhone(leadData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Enrich lead data with additional information
   * @param {Object} leadData - Original lead data
   * @returns {Object} Enriched lead data
   */
  enrichLeadData(leadData) {
    return {
      ...leadData,
      client_id: this.config.client_id,
      business_name: this.config.business_name,
      industry: this.config.industry,
      capture_timestamp: new Date().toISOString(),
      source: 'chatbot',
      status: 'new',
      score: this.calculateLeadScore(leadData)
    };
  }

  /**
   * Calculate lead score based on data quality and signals
   * @param {Object} leadData - Lead data
   * @returns {number} Lead score (0-100)
   */
  calculateLeadScore(leadData) {
    // DISABLED: Lead capture scoring system disabled
    // Using single unified scoring system from lead-scorer.js only
    console.log('📊 Lead Capture Scoring - DISABLED: Using single scoring system');

    // Return neutral score that won't affect the main lead scoring
    return 50; // Neutral score - will be ignored by main scoring system
  }

  /**
   * Save lead to database (placeholder)
   * @param {Object} leadData - Lead data
   * @returns {Promise<Object>} Saved lead
   */
  async saveLead(leadData) {
    // TODO: Implement database integration
    this.logger.info(`Lead saved: ${leadData.email}`);

    // For now, return the lead data with an ID
    return {
      id: `lead_${Date.now()}`,
      ...leadData
    };
  }

  /**
   * Generate success response
   * @param {Object} leadData - Lead data
   * @returns {string} Success message
   */
  generateSuccessResponse(leadData) {
    const industry = this.config.industry || 'general';
    const contact = this.config.contact || {};

    const messages = {
      legal: `Thank you, ${leadData.name}! I've captured your information and our legal team will contact you within 24 hours at ${leadData.email} or ${leadData.phone}. We look forward to helping you with your ${leadData.case_type} case.`,

      real_estate: `Perfect, ${leadData.name}! I've shared your information with our real estate team. They'll reach out to you within 24 hours at ${leadData.email} or ${leadData.phone} to discuss your ${leadData.property_interest} needs.`,

      ecommerce: `Excellent, ${leadData.name}! I've sent your information to our product specialists. They'll contact you within 24 hours at ${leadData.email} or ${leadData.phone} with personalized recommendations for ${leadData.product_interest}.`,

      general: `Thank you, ${leadData.name}! I've captured your information and our team will contact you within 24 hours at ${leadData.email} or ${leadData.phone}. We're excited to help you!`
    };

    return messages[industry] || messages.general;
  }

  /**
   * Get capture state
   * @returns {Object} Current capture state
   */
  getCaptureState() {
    return this.captureState;
  }

  /**
   * Reset capture state
   */
  resetCapture() {
    this.captureState = {};
  }

  progressiveCapture(currentData, newData) {
    // Merge new data into current lead
    return { ...currentData, ...newData };
  }

  generateLeadSummary(leadData) {
    return `Lead Summary:\nName: ${leadData.name || ''}\nPhone: ${leadData.phone || ''}\nEmail: ${leadData.email || ''}\nBudget: ${leadData.budget || ''}\nLocation: ${leadData.location || ''}\nType: ${leadData.property_type || ''}\nTimeline: ${leadData.timeline || ''}\nScore: ${leadData.score ? leadData.score.type + ' (' + leadData.score.score + ')' : ''}`;
  }

  webhookPayload(leadData) {
    // Structure for CRM integration
    return {
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      budget: leadData.budget,
      location: leadData.location,
      property_type: leadData.property_type,
      timeline: leadData.timeline,
      score: leadData.score,
      agent: leadData.agent,
      preferred_contact: leadData.preferred_contact
    };
  }
}

module.exports = LeadCapture;
