const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/workflows', require('./routes/workflows'));
app.use('/api/analytics', require('./routes/analytics'));

// OpenAI API integration
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// WebSocket for real-time communication
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('chat_message', async (data) => {
    try {
      // Generate AI response using OpenAI
      const aiResponse = await generateAIResponse(data.message);

      // Generate automation actions based on AI analysis
      const actions = await generateAutomationActions(data.message, aiResponse);

      socket.emit('bot_response', {
        message: aiResponse,
        actions: actions,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      socket.emit('bot_response', {
        message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        actions: [],
        timestamp: new Date()
      });
    }
  });
});

// Generate AI response using OpenAI
async function generateAIResponse(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an advanced Enterprise AI Assistant for a business automation platform. You help with:
          - Customer support and inquiries
          - Workflow automation and process optimization
          - CRM data analysis and insights
          - Email composition and scheduling
          - Report generation and analytics
          - Task management and project coordination

          Respond in a professional, helpful manner. Be concise but informative. Suggest automation opportunities when relevant.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateFallbackResponse(message);
  }
}

// Generate automation actions based on AI analysis
async function generateAutomationActions(message, aiResponse) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze the user message and AI response to suggest relevant automation actions. Return a JSON array of 2-3 actions with these fields:
          - type: action category (crm, schedule, email, ticket, report, workflow)
          - label: human-readable action name
          - icon: icon name (User, Calendar, Mail, FileText, BarChart3, Workflow)

          Focus on practical business automation tasks.`
        },
        {
          role: "user",
          content: `User message: "${message}"\nAI response: "${aiResponse}"\n\nSuggest relevant automation actions.`
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    const actionsText = completion.choices[0].message.content;
    try {
      return JSON.parse(actionsText);
    } catch (parseError) {
      return generateDefaultActions(message);
    }
  } catch (error) {
    console.error('Error generating actions:', error);
    return generateDefaultActions(message);
  }
}

// Fallback response generation
function generateFallbackResponse(message) {
  const responses = {
    'hello': "Hello! I'm your Advanced AI Assistant. I can help with customer inquiries, automate workflows, integrate with your CRM, and much more. What can I help you with today?",
    'help': "I can assist with:\n• Customer support and inquiries\n• Workflow automation\n• CRM data analysis\n• Email composition and scheduling\n• Report generation\n• Task management\n\nWhat would you like to work on?",
    'customer': "I can help with customer-related tasks. I can check customer data, analyze sentiment, create support tickets, and automate follow-up sequences. What specific customer issue are you dealing with?",
    'workflow': "I can help you create and manage workflows. I can automate email sequences, task assignments, CRM updates, and more. Would you like to see available workflow templates or create a custom one?",
    'report': "I can generate various reports including customer analytics, conversation metrics, workflow performance, and ROI analysis. What type of report would you like me to create?",
    'default': "I understand you're asking about '" + message + "'. Let me analyze this and provide you with the most relevant information and automation options. I can also integrate with your existing systems to get more context."
  };

  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  return responses.default;
}

// Default automation actions
function generateDefaultActions(message) {
  const actions = [
    { type: 'crm', label: 'Check Customer Data', icon: 'User' },
    { type: 'schedule', label: 'Schedule Meeting', icon: 'Calendar' },
    { type: 'email', label: 'Send Email', icon: 'Mail' },
    { type: 'ticket', label: 'Create Support Ticket', icon: 'FileText' },
    { type: 'report', label: 'Generate Report', icon: 'BarChart3' },
    { type: 'workflow', label: 'Start Workflow', icon: 'Workflow' }
  ];

  // Return 2-3 relevant actions based on message content
  const relevantActions = actions.filter(action => {
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes(action.type) ||
           lowerMessage.includes(action.label.toLowerCase()) ||
           Math.random() > 0.5; // Random selection for demo
  });

  return relevantActions.slice(0, 3);
}

server.listen(8003, () => {
  console.log('Tier 3 Chatbot server running on port 8003');
  console.log('OpenAI API integration enabled');
});
