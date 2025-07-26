/**
 * Configuration Loader Utility
 * Handles loading and validating chatbot configuration files
 */

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class ConfigLoader {
    constructor() {
        this.configCache = new Map();
        this.configSchema = {
            required: ['client_id', 'business_name', 'contact', 'industry', 'responses'],
            optional: ['ai_enabled', 'openai_config', 'lead_capture', 'theme', 'quick_replies', 'fallback_response'],
            contact: ['phone', 'email', 'website'],
            industries: ['legal', 'real_estate', 'ecommerce', 'healthcare', 'fitness', 'restaurant', 'general']
        };
    }

    /**
     * Load configuration from file
     * @param {string} configPath - Path to configuration file
     * @returns {Object} - Configuration object
     */
    loadConfig(configPath) {
        try {
            // Check cache first
            if (this.configCache.has(configPath)) {
                return this.configCache.get(configPath);
            }

            // Check if file exists
            if (!fs.existsSync(configPath)) {
                throw new Error(`Configuration file not found: ${configPath}`);
            }

            // Read and parse configuration
            const configData = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configData);

            // Validate configuration
            const validation = this.validateConfig(config);
            if (!validation.isValid) {
                throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
            }

            // Cache configuration
            this.configCache.set(configPath, config);

            logger.info('Configuration loaded successfully', {
                path: configPath,
                clientId: config.client_id,
                industry: config.industry
            });

            return config;

        } catch (error) {
            logger.error('Failed to load configuration', {
                path: configPath,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Load configuration by client ID
     * @param {string} clientId - Client identifier
     * @param {string} configDir - Configuration directory
     * @returns {Object} - Configuration object
     */
    loadConfigByClientId(clientId, configDir = path.join(__dirname, '../configs')) {
        const configPath = path.join(configDir, `${clientId}.json`);
        return this.loadConfig(configPath);
    }

    /**
     * Validate configuration structure
     * @param {Object} config - Configuration object
     * @returns {Object} - Validation result
     */
    validateConfig(config) {
        const errors = [];

        // Check required fields
        this.configSchema.required.forEach(field => {
            if (!config[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });

        // Check contact information
        if (config.contact) {
            this.configSchema.contact.forEach(field => {
                if (!config.contact[field]) {
                    errors.push(`Missing contact field: ${field}`);
                }
            });
        }

        // Check industry
        if (config.industry && !this.configSchema.industries.includes(config.industry)) {
            errors.push(`Invalid industry: ${config.industry}`);
        }

        // Check responses structure
        if (config.responses && typeof config.responses !== 'object') {
            errors.push('Responses must be an object');
        }

        // Check AI configuration if enabled
        if (config.ai_enabled && config.openai_config) {
            if (!config.openai_config.api_key && !process.env.OPENAI_API_KEY) {
                errors.push('OpenAI API key required when AI is enabled');
            }
        }

        // Check lead capture configuration
        if (config.lead_capture) {
            if (!config.lead_capture.required_fields || !Array.isArray(config.lead_capture.required_fields)) {
                errors.push('Lead capture required_fields must be an array');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get all available configurations
     * @param {string} configDir - Configuration directory
     * @returns {Array} - Array of configuration objects
     */
    getAllConfigs(configDir = path.join(__dirname, '../configs')) {
        try {
            const configs = [];

            if (!fs.existsSync(configDir)) {
                return configs;
            }

            const files = fs.readdirSync(configDir);

            files.forEach(file => {
                if (file.endsWith('.json')) {
                    try {
                        const configPath = path.join(configDir, file);
                        const config = this.loadConfig(configPath);
                        configs.push(config);
                    } catch (error) {
                        logger.warn('Failed to load config file', {
                            file,
                            error: error.message
                        });
                    }
                }
            });

            return configs;

        } catch (error) {
            logger.error('Failed to get all configs', {
                configDir,
                error: error.message
            });
            return [];
        }
    }

    /**
     * Get configurations by industry
     * @param {string} industry - Industry filter
     * @param {string} configDir - Configuration directory
     * @returns {Array} - Array of configuration objects
     */
    getConfigsByIndustry(industry, configDir = path.join(__dirname, '../configs')) {
        const allConfigs = this.getAllConfigs(configDir);
        return allConfigs.filter(config => config.industry === industry);
    }

    /**
     * Create configuration template
     * @param {string} industry - Industry type
     * @returns {Object} - Configuration template
     */
    createConfigTemplate(industry = 'general') {
        const template = {
            client_id: 'client-name',
            business_name: 'Business Name',
            contact: {
                phone: '(555) 123-4567',
                email: 'info@business.com',
                website: 'www.business.com'
            },
            industry: industry,
            ai_enabled: false,
            openai_config: {
                api_key: process.env.OPENAI_API_KEY || '',
                model: 'gpt-3.5-turbo',
                max_tokens: 150,
                temperature: 0.7
            },
            lead_capture: {
                enabled: true,
                required_fields: ['name', 'email'],
                optional_fields: ['phone', 'company'],
                trigger_keywords: ['interested', 'contact', 'quote', 'appointment'],
                min_conversation_length: 3
            },
            responses: {
                'greeting|hello|hi': {
                    response: 'Hello! Welcome to {business_name}. How can I help you today?',
                    category: 'greeting'
                },
                'hours|open|time|schedule': {
                    response: 'We are open Monday-Friday 9AM-5PM. Is there anything specific you\'d like to know?',
                    category: 'hours'
                },
                'contact|phone|email|reach': {
                    response: 'You can reach us at:\n📞 {phone}\n💬 {email}\n🌐 {website}',
                    category: 'contact'
                }
            },
            quick_replies: [
                'What are your hours?',
                'How can I contact you?',
                'What services do you offer?'
            ],
            fallback_response: 'I\'m sorry, I don\'t have information about that. Please contact us directly at {phone} or {email} for assistance.',
            theme: {
                primary_color: '#007bff',
                secondary_color: '#6c757d',
                accent_color: '#28a745',
                font_family: 'Arial, sans-serif',
                border_radius: '8px'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        return template;
    }

    /**
     * Save configuration to file
     * @param {Object} config - Configuration object
     * @param {string} configPath - Path to save configuration
     */
    saveConfig(config, configPath) {
        try {
            // Validate configuration before saving
            const validation = this.validateConfig(config);
            if (!validation.isValid) {
                throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
            }

            // Ensure directory exists
            const dir = path.dirname(configPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Update timestamps
            config.updated_at = new Date().toISOString();
            if (!config.created_at) {
                config.created_at = new Date().toISOString();
            }

            // Save configuration
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            // Update cache
            this.configCache.set(configPath, config);

            logger.info('Configuration saved successfully', {
                path: configPath,
                clientId: config.client_id
            });

        } catch (error) {
            logger.error('Failed to save configuration', {
                path: configPath,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Clear configuration cache
     */
    clearCache() {
        this.configCache.clear();
        logger.info('Configuration cache cleared');
    }

    /**
     * Get configuration statistics
     * @param {string} configDir - Configuration directory
     * @returns {Object} - Statistics object
     */
    getConfigStats(configDir = path.join(__dirname, '../configs')) {
        try {
            const configs = this.getAllConfigs(configDir);

            const stats = {
                total: configs.length,
                byIndustry: {},
                aiEnabled: 0,
                leadCaptureEnabled: 0,
                averageResponses: 0
            };

            configs.forEach(config => {
                // Count by industry
                stats.byIndustry[config.industry] = (stats.byIndustry[config.industry] || 0) + 1;

                // Count AI enabled
                if (config.ai_enabled) {
                    stats.aiEnabled++;
                }

                // Count lead capture enabled
                if (config.lead_capture && config.lead_capture.enabled) {
                    stats.leadCaptureEnabled++;
                }
            });

            // Calculate average responses
            const totalResponses = configs.reduce((sum, config) => {
                return sum + (config.responses ? Object.keys(config.responses).length : 0);
            }, 0);
            stats.averageResponses = configs.length > 0 ? Math.round(totalResponses / configs.length) : 0;

            return stats;

        } catch (error) {
            logger.error('Failed to get config stats', {
                configDir,
                error: error.message
            });
            return {
                total: 0,
                byIndustry: {},
                aiEnabled: 0,
                leadCaptureEnabled: 0,
                averageResponses: 0
            };
        }
    }
}

module.exports = new ConfigLoader();
