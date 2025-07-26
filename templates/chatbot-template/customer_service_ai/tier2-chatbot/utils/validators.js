/**
 * Validation Utility
 * Provides validation functions for data structures, API requests, and configuration objects
 */

class Validators {
    constructor() {
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        this.urlRegex = /^https?:\/\/.+/;
    }

    /**
     * Validate chat request data
     * @param {Object} data - Request data
     * @returns {Object} - Validation result
     */
    validateChatRequest(data) {
        const errors = {};

        // Required fields
        if (!data.clientId || typeof data.clientId !== 'string') {
            errors.clientId = 'Client ID is required and must be a string';
        }

        if (!data.message || typeof data.message !== 'string') {
            errors.message = 'Message is required and must be a string';
        } else if (data.message.length > 1000) {
            errors.message = 'Message must be less than 1000 characters';
        }

        // Optional fields
        if (data.conversationId && typeof data.conversationId !== 'string') {
            errors.conversationId = 'Conversation ID must be a string';
        }

        if (data.userId && typeof data.userId !== 'string') {
            errors.userId = 'User ID must be a string';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Validate lead data
     * @param {Object} data - Lead data
     * @returns {Object} - Validation result
     */
    validateLeadData(data) {
        const errors = {};

        // Required fields
        if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
            errors.name = 'Name is required and must be a non-empty string';
        } else if (data.name.length > 100) {
            errors.name = 'Name must be less than 100 characters';
        }

        if (!data.email || typeof data.email !== 'string') {
            errors.email = 'Email is required and must be a string';
        } else if (!this.emailRegex.test(data.email)) {
            errors.email = 'Email must be a valid email address';
        }

        // Optional fields
        if (data.phone && typeof data.phone === 'string') {
            const cleanPhone = data.phone.replace(/\D/g, '');
            if (!this.phoneRegex.test(cleanPhone)) {
                errors.phone = 'Phone must be a valid phone number';
            }
        }

        if (data.company && typeof data.company !== 'string') {
            errors.company = 'Company must be a string';
        } else if (data.company && data.company.length > 100) {
            errors.company = 'Company must be less than 100 characters';
        }

        if (data.message && typeof data.message !== 'string') {
            errors.message = 'Message must be a string';
        } else if (data.message && data.message.length > 1000) {
            errors.message = 'Message must be less than 1000 characters';
        }

        // Additional fields
        if (data.budget && (typeof data.budget !== 'string' && typeof data.budget !== 'number')) {
            errors.budget = 'Budget must be a string or number';
        }

        if (data.timeline && typeof data.timeline !== 'string') {
            errors.timeline = 'Timeline must be a string';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Validate lead update data
     * @param {Object} data - Lead update data
     * @returns {Object} - Validation result
     */
    validateLeadUpdate(data) {
        const errors = {};

        // At least one field must be provided
        const hasValidFields = Object.keys(data).some(key => {
            return ['name', 'email', 'phone', 'company', 'status', 'notes'].includes(key);
        });

        if (!hasValidFields) {
            errors.general = 'At least one valid field must be provided for update';
        }

        // Validate individual fields if provided
        if (data.name !== undefined) {
            if (typeof data.name !== 'string' || data.name.trim().length === 0) {
                errors.name = 'Name must be a non-empty string';
            } else if (data.name.length > 100) {
                errors.name = 'Name must be less than 100 characters';
            }
        }

        if (data.email !== undefined) {
            if (typeof data.email !== 'string') {
                errors.email = 'Email must be a string';
            } else if (!this.emailRegex.test(data.email)) {
                errors.email = 'Email must be a valid email address';
            }
        }

        if (data.phone !== undefined && data.phone !== null) {
            if (typeof data.phone !== 'string') {
                errors.phone = 'Phone must be a string';
            } else {
                const cleanPhone = data.phone.replace(/\D/g, '');
                if (!this.phoneRegex.test(cleanPhone)) {
                    errors.phone = 'Phone must be a valid phone number';
                }
            }
        }

        if (data.status !== undefined) {
            const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
            if (!validStatuses.includes(data.status)) {
                errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Validate configuration update data
     * @param {Object} data - Configuration update data
     * @returns {Object} - Validation result
     */
    validateConfigUpdate(data) {
        const errors = {};

        // Validate business information
        if (data.business_name !== undefined) {
            if (typeof data.business_name !== 'string' || data.business_name.trim().length === 0) {
                errors.business_name = 'Business name must be a non-empty string';
            } else if (data.business_name.length > 200) {
                errors.business_name = 'Business name must be less than 200 characters';
            }
        }

        // Validate contact information
        if (data.contact !== undefined) {
            if (typeof data.contact !== 'object') {
                errors.contact = 'Contact must be an object';
            } else {
                if (data.contact.phone !== undefined) {
                    const cleanPhone = data.contact.phone.replace(/\D/g, '');
                    if (!this.phoneRegex.test(cleanPhone)) {
                        errors.contact_phone = 'Phone must be a valid phone number';
                    }
                }

                if (data.contact.email !== undefined) {
                    if (!this.emailRegex.test(data.contact.email)) {
                        errors.contact_email = 'Email must be a valid email address';
                    }
                }

                if (data.contact.website !== undefined) {
                    if (!this.urlRegex.test(data.contact.website)) {
                        errors.contact_website = 'Website must be a valid URL';
                    }
                }
            }
        }

        // Validate industry
        if (data.industry !== undefined) {
            const validIndustries = ['legal', 'real_estate', 'ecommerce', 'healthcare', 'fitness', 'restaurant', 'general'];
            if (!validIndustries.includes(data.industry)) {
                errors.industry = `Industry must be one of: ${validIndustries.join(', ')}`;
            }
        }

        // Validate AI configuration
        if (data.ai_enabled !== undefined) {
            if (typeof data.ai_enabled !== 'boolean') {
                errors.ai_enabled = 'AI enabled must be a boolean';
            }
        }

        if (data.openai_config !== undefined) {
            if (typeof data.openai_config !== 'object') {
                errors.openai_config = 'OpenAI config must be an object';
            } else {
                if (data.openai_config.model && typeof data.openai_config.model !== 'string') {
                    errors.openai_model = 'OpenAI model must be a string';
                }

                if (data.openai_config.max_tokens && (typeof data.openai_config.max_tokens !== 'number' || data.openai_config.max_tokens < 1)) {
                    errors.openai_max_tokens = 'Max tokens must be a positive number';
                }

                if (data.openai_config.temperature !== undefined) {
                    if (typeof data.openai_config.temperature !== 'number' || data.openai_config.temperature < 0 || data.openai_config.temperature > 2) {
                        errors.openai_temperature = 'Temperature must be a number between 0 and 2';
                    }
                }
            }
        }

        // Validate lead capture configuration
        if (data.lead_capture !== undefined) {
            if (typeof data.lead_capture !== 'object') {
                errors.lead_capture = 'Lead capture must be an object';
            } else {
                if (data.lead_capture.enabled !== undefined && typeof data.lead_capture.enabled !== 'boolean') {
                    errors.lead_capture_enabled = 'Lead capture enabled must be a boolean';
                }

                if (data.lead_capture.required_fields !== undefined) {
                    if (!Array.isArray(data.lead_capture.required_fields)) {
                        errors.lead_capture_required_fields = 'Required fields must be an array';
                    } else {
                        const validFields = ['name', 'email', 'phone', 'company', 'message'];
                        data.lead_capture.required_fields.forEach(field => {
                            if (!validFields.includes(field)) {
                                errors.lead_capture_required_fields = `Invalid required field: ${field}`;
                            }
                        });
                    }
                }
            }
        }

        // Validate responses
        if (data.responses !== undefined) {
            if (typeof data.responses !== 'object') {
                errors.responses = 'Responses must be an object';
            } else {
                Object.entries(data.responses).forEach(([pattern, response]) => {
                    if (typeof pattern !== 'string' || pattern.trim().length === 0) {
                        errors.responses = 'Response patterns must be non-empty strings';
                    }
                    if (typeof response !== 'object' || typeof response.response !== 'string') {
                        errors.responses = 'Response objects must have a response string';
                    }
                });
            }
        }

        // Validate quick replies
        if (data.quick_replies !== undefined) {
            if (!Array.isArray(data.quick_replies)) {
                errors.quick_replies = 'Quick replies must be an array';
            } else {
                data.quick_replies.forEach((reply, index) => {
                    if (typeof reply !== 'string' || reply.trim().length === 0) {
                        errors.quick_replies = `Quick reply at index ${index} must be a non-empty string`;
                    }
                });
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} - Is valid email
     */
    isValidEmail(email) {
        return typeof email === 'string' && this.emailRegex.test(email);
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone to validate
     * @returns {boolean} - Is valid phone
     */
    isValidPhone(phone) {
        if (typeof phone !== 'string') return false;
        const cleanPhone = phone.replace(/\D/g, '');
        return this.phoneRegex.test(cleanPhone);
    }

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} - Is valid URL
     */
    isValidUrl(url) {
        return typeof url === 'string' && this.urlRegex.test(url);
    }

    /**
     * Validate required fields
     * @param {Object} data - Data object
     * @param {Array} required - Required field names
     * @returns {Object} - Validation result
     */
    validateRequired(data, required) {
        const errors = {};

        required.forEach(field => {
            if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
                errors[field] = `${field} is required`;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Sanitize string input
     * @param {string} input - Input string
     * @param {number} maxLength - Maximum length
     * @returns {string} - Sanitized string
     */
    sanitizeString(input, maxLength = 1000) {
        if (typeof input !== 'string') return '';

        // Remove HTML tags
        let sanitized = input.replace(/<[^>]*>/g, '');

        // Trim whitespace
        sanitized = sanitized.trim();

        // Limit length
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    /**
     * Validate pagination parameters
     * @param {Object} params - Pagination parameters
     * @returns {Object} - Validation result
     */
    validatePagination(params) {
        const errors = {};

        if (params.page !== undefined) {
            const page = parseInt(params.page);
            if (isNaN(page) || page < 1) {
                errors.page = 'Page must be a positive integer';
            }
        }

        if (params.limit !== undefined) {
            const limit = parseInt(params.limit);
            if (isNaN(limit) || limit < 1 || limit > 100) {
                errors.limit = 'Limit must be a positive integer between 1 and 100';
            }
        }

        if (params.sort_by !== undefined) {
            const validSortFields = ['created_at', 'updated_at', 'name', 'email', 'status'];
            if (!validSortFields.includes(params.sort_by)) {
                errors.sort_by = `Sort field must be one of: ${validSortFields.join(', ')}`;
            }
        }

        if (params.sort_order !== undefined) {
            const validSortOrders = ['asc', 'desc'];
            if (!validSortOrders.includes(params.sort_order.toLowerCase())) {
                errors.sort_order = 'Sort order must be "asc" or "desc"';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

module.exports = new Validators();
