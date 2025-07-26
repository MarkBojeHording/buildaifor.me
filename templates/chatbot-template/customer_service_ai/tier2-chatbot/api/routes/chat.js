/**
 * Chat API Routes
 * Handles chat message processing, response generation, and conversation management
 */

const express = require('express');
const router = express.Router();

// Import core chatbot logic (adjust path as needed)
const path = require('path');
const fs = require('fs');
const MessageProcessor = require('../../core/message-processor');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { client_id, clientId, message, session_id, sessionId, conversationId } = req.body;
    const clientIdFinal = client_id || clientId;
    const sessionIdFinal = session_id || sessionId || conversationId || 'default';
    if (!clientIdFinal) {
      return res.status(400).json({ error: 'Missing clientId' });
    }
    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }
    // Load client config
    const configPath = path.join(__dirname, '../../configs', `${clientIdFinal}.json`);
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({ error: `Configuration not found for client: ${clientIdFinal}` });
    }
    const clientConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    // Call processMessage with correct arguments
    const result = await MessageProcessor.processMessage(
      message,
      {}, // sessionData (could be improved to use real session store)
      clientConfig
    );
    res.json(result);
  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

/**
 * GET /api/chat/conversation/:conversationId
 * Get conversation history
 */
router.get('/conversation/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { clientId } = req.query;

        if (!clientId) {
            return res.status(400).json({
                error: 'Client ID is required'
            });
        }

        const chatbot = getChatbot(clientId);
        const history = chatbot.getConversationHistory(conversationId);

        res.json({
            success: true,
            conversationId,
            messages: history,
            totalMessages: history.length
        });

    } catch (error) {
        logger.error('Get conversation error:', error);

        res.status(500).json({
            error: 'Failed to retrieve conversation',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * DELETE /api/chat/conversation/:conversationId
 * Clear conversation history
 */
router.delete('/conversation/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { clientId } = req.query;

        if (!clientId) {
            return res.status(400).json({
                error: 'Client ID is required'
            });
        }

        const chatbot = getChatbot(clientId);
        chatbot.resetConversation(conversationId);

        logger.info('Conversation cleared', {
            clientId,
            conversationId
        });

        res.json({
            success: true,
            message: 'Conversation cleared successfully'
        });

    } catch (error) {
        logger.error('Clear conversation error:', error);

        res.status(500).json({
            error: 'Failed to clear conversation',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * POST /api/chat/lead
 * Process lead capture form submission
 */
router.post('/lead', async (req, res) => {
    try {
        const { clientId, leadData, conversationId } = req.body;

        // Validate lead data
        const validation = validators.validateLeadData(leadData);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Invalid lead data',
                details: validation.errors
            });
        }

        const chatbot = getChatbot(clientId);
        const result = await chatbot.handleLeadCapture(leadData, conversationId);

        logger.info('Lead captured', {
            clientId,
            conversationId,
            leadScore: result.score,
            leadType: result.type
        });

        res.json({
            success: true,
            message: result.response,
            leadId: result.leadId,
            score: result.score,
            type: result.type
        });

    } catch (error) {
        logger.error('Lead capture error:', error);

        res.status(500).json({
            error: 'Failed to process lead',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * GET /api/chat/status
 * Get chatbot status and health
 */
router.get('/status', (req, res) => {
    try {
        const { clientId } = req.query;

        if (!clientId) {
            return res.status(400).json({
                error: 'Client ID is required'
            });
        }

        const chatbot = getChatbot(clientId);
        const status = {
            isReady: chatbot.isReady(),
            config: chatbot.getConfig(),
            activeConversations: chatbot.getConversationHistory().length,
            uptime: process.uptime()
        };

        res.json({
            success: true,
            status
        });

    } catch (error) {
        logger.error('Status check error:', error);

        res.status(500).json({
            error: 'Failed to get status',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

/**
 * POST /api/chat/feedback
 * Submit user feedback for conversation quality
 */
router.post('/feedback', async (req, res) => {
    try {
        const { clientId, conversationId, rating, feedback, messageId } = req.body;

        // Validate feedback
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                error: 'Rating must be between 1 and 5'
            });
        }

        // Store feedback (placeholder implementation)
        logger.info('Feedback received', {
            clientId,
            conversationId,
            messageId,
            rating,
            feedback: feedback || 'No feedback provided'
        });

        res.json({
            success: true,
            message: 'Thank you for your feedback!'
        });

    } catch (error) {
        logger.error('Feedback error:', error);

        res.status(500).json({
            error: 'Failed to submit feedback',
            message: process.env.NODE_ENV === 'production'
                ? 'Please try again later'
                : error.message
        });
    }
});

module.exports = router;
