/**
 * Tier 2 Chatbot Server
 * Main entry point for the chatbot system
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Import the enhanced message processor
const EnhancedMessageProcessor = require('./core/enhanced-message-processor');

console.log('🚀 SERVER STARTING...');
console.log('📦 EnhancedMessageProcessor loaded');

// Load client configurations
function loadClientConfig(clientId) {
  try {
    const configPath = path.join(__dirname, 'configs', `${clientId}.json`);
    console.log('📁 Loading config from:', configPath);
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('✅ Config loaded successfully');
      console.log('🏢 Business:', config.business_name);
      console.log('🏷️ Industry:', config.industry);
      console.log('🏷️ Business Type:', config.business_type);
      return config;
    } else {
      console.log('❌ Config file not found:', configPath);
      return null;
    }
  } catch (error) {
    console.error('❌ Error loading config:', error);
    return null;
  }
}

// Session storage
const sessions = {};

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    processor: 'EnhancedMessageProcessor',
    sessions: Object.keys(sessions).length,
    ai_features: ['Lead Scoring', 'Case Assessment', 'Intent Detection', 'AI Response Generation']
  });
});

// Main chat endpoint with EXTENSIVE debugging
app.post('/chat', async (req, res) => {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('🔥 NEW CHAT REQUEST');
    console.log('='.repeat(80));
    console.log('📨 Raw request body:', JSON.stringify(req.body, null, 2));
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
    const configPath = path.join(__dirname, 'configs', `${clientIdFinal}.json`);
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({ error: `Configuration not found for client: ${clientIdFinal}` });
    }
    const clientConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    // Initialize enhanced message processor
    const enhancedProcessor = new EnhancedMessageProcessor(clientConfig);

    // Get or create session data
    if (!sessions[sessionIdFinal]) {
      sessions[sessionIdFinal] = {
        start_time: new Date().toISOString(),
        conversation_stage: 'initial',
        lead_data: {},
        lead_score: 0,
        message_count: 0,
        messages: [], // Track conversation history
        session_id: sessionIdFinal
      };
    }

    // Add current message to conversation history
    sessions[sessionIdFinal].messages.push({
      text: message,
      timestamp: new Date().toISOString(),
      sender: 'user'
    });

    // Call enhanced processMessage
    const result = await enhancedProcessor.processMessage(
      message,
      sessions[sessionIdFinal],
      clientConfig
    );

    // Add bot response to conversation history
    sessions[sessionIdFinal].messages.push({
      text: result.response,
      timestamp: new Date().toISOString(),
      sender: 'bot'
    });

    res.json(result);
  } catch (error) {
    console.error('💥 CRITICAL ERROR in chat endpoint:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🚀 Tier 2 Chatbot Server running on port ${PORT}`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});
