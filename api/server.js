const express = require('express');
const cors = require('cors');
const { MessageProcessor } = require('./processors/message-processor');
const { SessionManager } = require('./utils/session-manager');
const clientConfigs = require('./config/client-configs');

const app = express();
app.use(cors());
app.use(express.json());

const messageProcessor = new MessageProcessor();
const sessionManager = new SessionManager();

app.post('/chat', async (req, res) => {
  try {
    const { message, clientId, session_id } = req.body;
    const clientConfig = clientConfigs[clientId] || clientConfigs['default'];
    const sessionData = sessionManager.getSession(session_id) || {};
    const result = await messageProcessor.processMessage(
      message,
      sessionData,
      clientConfig
    );
    sessionManager.updateSession(session_id, {
      ...result.sessionData,
      conversationHistory: [
        ...(sessionData.conversationHistory || []),
        { role: 'user', content: message, timestamp: Date.now() },
        { role: 'assistant', content: result.response, timestamp: Date.now() }
      ]
    });
    res.json({
      response: result.response,
      session_id: session_id,
      leadScore: result.leadScore,
      caseAssessment: result.caseAssessment,
      nextQuestions: result.nextQuestions,
      metadata: {
        intent: result.intent,
        confidence: result.confidence,
        caseType: result.caseType
      }
    });
  } catch (error) {
    console.error('Chat processing error:', error);
    if (error && error.stack) console.error(error.stack);
    res.status(500).json({
      response: "I apologize, but I'm experiencing technical difficulties. Please contact our office directly for immediate assistance.",
      error: process.env.NODE_ENV === 'development' ? (error.stack || error.message) : undefined
    });
  }
});

app.listen(8001, () => {
  console.log('🏛️  Law Firm AI Chatbot Backend running on port 8001');
  console.log('🤖 Advanced case assessment and lead qualification active');
});
