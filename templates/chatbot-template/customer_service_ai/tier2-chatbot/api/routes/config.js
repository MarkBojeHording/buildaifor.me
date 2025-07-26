/**
 * Configuration API Routes
 * Handles chatbot configuration management, themes, and settings
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Import utilities
const logger = require('../../utils/logger');
const configLoader = require('../../utils/config-loader');
const validators = require('../../utils/validators');

/**
 * GET /api/config/:clientId
 * Get chatbot configuration
 */
router.get('/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  const configPath = path.join(__dirname, '../../configs', `${clientId}.json`);
  if (!fs.existsSync(configPath)) {
    return res.status(404).json({ error: `Configuration not found for client: ${clientId}` });
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  res.json(config);
});

/**
 * GET /api/config/:clientId/theme
 * Get chatbot theme configuration
 */
router.get('/:clientId/theme', (req, res) => {
    try {
        const { clientId } = req.params;
        const configPath = path.join(__dirname, '../../configs', `${clientId}.json`);

        if (!fs.existsSync(configPath)) {
            return res.status(404).json({
                error: 'Configuration not found',
                clientId
            });
        }

        const config = configLoader.loadConfig(configPath);

        res.json({
            success: true,
            theme: config.theme || {}
        });

    } catch (error) {
        logger.error('Get theme error:', error);

        res.status(500).json({
            error: 'Failed to load theme',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * GET /api/config/:clientId/responses
 * Get chatbot response templates
 */
router.get('/:clientId/responses', (req, res) => {
    try {
        const { clientId } = req.params;
        const configPath = path.join(__dirname, '../../configs', `${clientId}.json`);

        if (!fs.existsSync(configPath)) {
            return res.status(404).json({
                error: 'Configuration not found',
                clientId
            });
        }

        const config = configLoader.loadConfig(configPath);

        res.json({
            success: true,
            responses: config.responses || {},
            quick_replies: config.quick_replies || []
        });

    } catch (error) {
        logger.error('Get responses error:', error);

        res.status(500).json({
            error: 'Failed to load responses',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * GET /api/config/:clientId/lead-capture
 * Get lead capture configuration
 */
router.get('/:clientId/lead-capture', (req, res) => {
    try {
        const { clientId } = req.params;
        const configPath = path.join(__dirname, '../../configs', `${clientId}.json`);

        if (!fs.existsSync(configPath)) {
            return res.status(404).json({
                error: 'Configuration not found',
                clientId
            });
        }

        const config = configLoader.loadConfig(configPath);

        res.json({
            success: true,
            lead_capture: config.lead_capture || {}
        });

    } catch (error) {
        logger.error('Get lead capture config error:', error);

        res.status(500).json({
            error: 'Failed to load lead capture configuration',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * PUT /api/config/:clientId
 * Update chatbot configuration
 */
router.put('/:clientId', (req, res) => {
    try {
        const { clientId } = req.params;
        const updates = req.body;

        // Validate updates
        const validation = validators.validateConfigUpdate(updates);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Invalid configuration data',
                details: validation.errors
            });
        }

        const configPath = path.join(__dirname, '../../configs', `${clientId}.json`);

        if (!fs.existsSync(configPath)) {
            return res.status(404).json({
                error: 'Configuration not found',
                clientId
            });
        }

        // Load existing config
        const existingConfig = configLoader.loadConfig(configPath);

        // Merge updates
        const updatedConfig = {
            ...existingConfig,
            ...updates,
            updated_at: new Date().toISOString()
        };

        // Save updated config
        fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));

        logger.info('Configuration updated', {
            clientId,
            updatedFields: Object.keys(updates)
        });

        res.json({
            success: true,
            message: 'Configuration updated successfully',
            config: updatedConfig
        });

    } catch (error) {
        logger.error('Update config error:', error);

        res.status(500).json({
            error: 'Failed to update configuration',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * POST /api/config/:clientId/responses
 * Add or update response template
 */
router.post('/:clientId/responses', (req, res) => {
    try {
        const { clientId } = req.params;
        const { pattern, response, category } = req.body;

        if (!pattern || !response) {
            return res.status(400).json({
                error: 'Pattern and response are required'
            });
        }

        const configPath = path.join(__dirname, '../../configs', `${clientId}.json`);

        if (!fs.existsSync(configPath)) {
            return res.status(404).json({
                error: 'Configuration not found',
                clientId
            });
        }

        // Load existing config
        const config = configLoader.loadConfig(configPath);

        // Initialize responses if not exists
        if (!config.responses) {
            config.responses = {};
        }

        // Add or update response
        config.responses[pattern] = {
            response,
            category: category || 'general',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save updated config
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        logger.info('Response template added/updated', {
            clientId,
            pattern,
            category
        });

        res.json({
            success: true,
            message: 'Response template saved successfully',
            pattern,
            response: config.responses[pattern]
        });

    } catch (error) {
        logger.error('Add response error:', error);

        res.status(500).json({
            error: 'Failed to save response template',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * DELETE /api/config/:clientId/responses/:pattern
 * Delete response template
 */
router.delete('/:clientId/responses/:pattern', (req, res) => {
    try {
        const { clientId, pattern } = req.params;
        const configPath = path.join(__dirname, '../../configs', `${clientId}.json`);

        if (!fs.existsSync(configPath)) {
            return res.status(404).json({
                error: 'Configuration not found',
                clientId
            });
        }

        // Load existing config
        const config = configLoader.loadConfig(configPath);

        if (!config.responses || !config.responses[pattern]) {
            return res.status(404).json({
                error: 'Response template not found',
                pattern
            });
        }

        // Delete response
        delete config.responses[pattern];

        // Save updated config
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        logger.info('Response template deleted', {
            clientId,
            pattern
        });

        res.json({
            success: true,
            message: 'Response template deleted successfully'
        });

    } catch (error) {
        logger.error('Delete response error:', error);

        res.status(500).json({
            error: 'Failed to delete response template',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * GET /api/config/templates
 * Get available configuration templates
 */
router.get('/templates', (req, res) => {
    try {
        const templatesDir = path.join(__dirname, '../../templates');
        const templates = [];

        if (fs.existsSync(templatesDir)) {
            const files = fs.readdirSync(templatesDir);

            files.forEach(file => {
                if (file.endsWith('.json')) {
                    const templatePath = path.join(templatesDir, file);
                    const template = configLoader.loadConfig(templatePath);

                    templates.push({
                        name: file.replace('.json', ''),
                        title: template.title || file.replace('.json', ''),
                        description: template.description || '',
                        industry: template.industry || 'general',
                        features: template.features || []
                    });
                }
            });
        }

        res.json({
            success: true,
            templates
        });

    } catch (error) {
        logger.error('Get templates error:', error);

        res.status(500).json({
            error: 'Failed to load templates',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * POST /api/config/:clientId/clone
 * Clone configuration from template
 */
router.post('/:clientId/clone', (req, res) => {
    try {
        const { clientId } = req.params;
        const { templateName } = req.body;

        if (!templateName) {
            return res.status(400).json({
                error: 'Template name is required'
            });
        }

        const templatePath = path.join(__dirname, '../../templates', `${templateName}.json`);

        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({
                error: 'Template not found',
                templateName
            });
        }

        const template = configLoader.loadConfig(templatePath);
        const configPath = path.join(__dirname, '../../configs', `${clientId}.json`);

        // Create new config from template
        const newConfig = {
            ...template,
            client_id: clientId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save new config
        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));

        logger.info('Configuration cloned from template', {
            clientId,
            templateName
        });

        res.json({
            success: true,
            message: 'Configuration cloned successfully',
            config: newConfig
        });

    } catch (error) {
        logger.error('Clone config error:', error);

        res.status(500).json({
            error: 'Failed to clone configuration',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

module.exports = router;
