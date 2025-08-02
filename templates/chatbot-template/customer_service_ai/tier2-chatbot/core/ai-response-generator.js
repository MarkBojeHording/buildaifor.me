const OpenAI = require('openai');

class AIResponseGenerator {
  constructor(config) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.config = config;
    this.model = config.openai_config?.model || 'gpt-4o-mini';
    this.temperature = config.openai_config?.temperature || 0.7;
    this.maxTokens = config.openai_config?.max_tokens || 300;
    this.conversationContext = new Map();
    this.legalDisclaimerShown = new Set(); // Track if disclaimer shown per conversation
  }

  async generateResponse(message, sessionData, clientConfig) {
    try {
      console.log('🤖 AI Response Generator - Processing message');

      const conversationHistory = sessionData.messages || [];
      const isFirstMessage = conversationHistory.length === 0;
      const sessionId = sessionData.session_id || 'default';

      // Track if disclaimer has been shown for this session
      if (isFirstMessage) {
        this.legalDisclaimerShown.add(sessionId);
      }

      const aiAnalysis = {
        leadScore: sessionData.lead_score || 0,
        intent: sessionData.detected_intent || 'GENERAL_INFO',
        caseStrength: sessionData.case_assessment || 'Not assessed',
        attorneyMatch: sessionData.attorney_match || 'Not determined',
        isFirstMessage: isFirstMessage
      };

      // Use AI generation with improved prompts
      const prompt = this.buildImprovedPrompt(message, conversationHistory, aiAnalysis, clientConfig);

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: this.getImprovedSystemPrompt(clientConfig, isFirstMessage)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });

      const aiResponse = completion.choices[0].message.content;

      console.log('✅ AI Response generated successfully');
      return this.formatImprovedResponse(aiResponse, aiAnalysis, isFirstMessage);

    } catch (error) {
      console.error('❌ AI Response generation failed:', error.message);
      return this.getImprovedFallbackResponse(message, clientConfig, sessionData);
    }
  }

  getImprovedSystemPrompt(clientConfig, isFirstMessage) {
    const disclaimer = isFirstMessage ?
      "IMPORTANT: Include this legal disclaimer ONCE at the start of your first response, then never repeat it: 'This is general information, not legal advice - you'll get specific guidance from our attorneys.'" :
      "IMPORTANT: Do NOT include legal disclaimers in your response - they were already provided.";

    return `You are a helpful AI legal assistant for ${clientConfig.business_name}.

CONVERSATION STYLE:
- Be conversational and natural (like texting, not formal emails)
- Be empathetic but efficient
- NO email formatting (no "Dear", "Subject:", signatures)
- One focused question per response to move conversation forward
- Reference what the user already told you
- Keep responses under 100 words
- Be confident about the firm's capabilities

${disclaimer}

Practice Areas: ${clientConfig.practice_areas ? Object.keys(clientConfig.practice_areas).join(', ') : 'General legal matters'}`;
  }

  buildImprovedPrompt(message, conversationHistory, aiAnalysis, clientConfig) {
    const context = this.buildImprovedContext(conversationHistory, aiAnalysis);

    return `You are a helpful AI legal assistant for ${clientConfig.business_name}.

CONVERSATION STYLE:
- Be conversational and natural (like texting, not formal emails)
- Be empathetic but efficient
- No email formatting (no "Dear", "Subject:", signatures)
- One focused question per response to move conversation forward
- Reference what the user already told you

CONTEXT:
${context.previousMessages ? `Previous conversation: ${context.previousMessages}` : 'This is the start of conversation'}

CURRENT ANALYSIS:
- Lead Score: ${aiAnalysis.leadScore}/100
- Intent: ${aiAnalysis.intent}
- Case Strength: ${aiAnalysis.caseStrength}

USER MESSAGE: "${message}"

RESPONSE RULES:
1. If first message: Include brief legal disclaimer once, then never repeat it
2. If user mentioned accident + lawsuit: Don't ask about accident type again, focus on lawsuit details
3. If asking for consultation: Give clear next steps, don't ask unnecessary questions
4. If high lead score (70+): Show more urgency and route to senior attorney
5. Keep responses under 100 words
6. End with ONE specific question to progress the case

Generate a natural, helpful response:`;
  }

  buildImprovedContext(conversationHistory, aiAnalysis) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return { previousMessages: null };
    }

    // Extract key information from recent messages
    const recentMessages = conversationHistory.slice(-3); // Last 3 messages
    const context = recentMessages.map(msg => msg.text).join(' | ');

    return {
      previousMessages: context,
      messageCount: conversationHistory.length,
      leadScore: aiAnalysis.leadScore,
      intent: aiAnalysis.intent
    };
  }

  formatImprovedResponse(aiResponse, aiAnalysis, isFirstMessage) {
    // Remove any email formatting that AI might add
    let cleaned = aiResponse
      .replace(/^Subject:.*\n/m, '')
      .replace(/^Dear.*,?\n/m, '')
      .replace(/Warm regards,[\s\S]*$/m, '')
      .replace(/\[.*?\]/g, '')
      .replace(/Sincerely,[\s\S]*$/m, '')
      .replace(/Best regards,[\s\S]*$/m, '')
      .trim();

    // Add urgency indicators for high-value leads
    if (aiAnalysis.leadScore >= 80) {
      cleaned = "🚨 " + cleaned;
    } else if (aiAnalysis.leadScore >= 70) {
      cleaned = "⚡ " + cleaned;
    }

    return {
      response: cleaned,
      ai_generated: true,
      timestamp: new Date().toISOString()
    };
  }

  getImprovedFallbackResponse(message, clientConfig, sessionData) {
    console.log('🔄 Using improved fallback response');

    const lowerMessage = message.toLowerCase();
    const isFirstMessage = !sessionData.messages || sessionData.messages.length === 0;
    const leadScore = sessionData.lead_score || 0;

    console.log('📊 Current lead score:', leadScore);
    console.log('📝 Message:', lowerMessage);
    console.log('🆕 Is first message:', isFirstMessage);
    console.log('💬 Messages in session:', sessionData.messages ? sessionData.messages.length : 0);

    // First message fallback - check this first
    if (isFirstMessage) {
      return {
        response: `Hi! I'm here to help with your legal questions and connect you with the right attorney. *Quick note: This is general information, not legal advice - you'll get specific guidance from our attorneys.*

What's going on? What legal issue can I help you figure out?`,
        ai_generated: false,
        fallback: true
      };
    }

    // High-value lead responses
    if (leadScore >= 80) {
      return {
        response: `🚨 This sounds like a serious situation that needs immediate attention. Let me get you connected with our senior litigation partner right away.

Can you be available for a call within the next 2 hours? This is the kind of case where timing really matters.`,
        ai_generated: false,
        fallback: true
      };
    }

    if (leadScore >= 70) {
      return {
        response: `⚡ This is definitely something our attorneys should review. I can get you scheduled for a consultation tomorrow.

What time works better for you - morning or afternoon?`,
        ai_generated: false,
        fallback: true
      };
    }

    // Context-aware responses
    if (lowerMessage.includes('lawsuit') || lowerMessage.includes('sued')) {
      return {
        response: `That sounds really stressful - dealing with a lawsuit can be overwhelming.

The most important thing right now is making sure you respond to any court documents properly. Have you received official lawsuit papers yet?`,
        ai_generated: false,
        fallback: true
      };
    }

    if ((lowerMessage.includes('accident') || lowerMessage.includes('crash')) &&
        (lowerMessage.includes('injury') || lowerMessage.includes('hurt') || lowerMessage.includes('medical'))) {
      return {
        response: `I'm sorry to hear about your accident and injuries. This can be really overwhelming to deal with.

Have you received medical treatment for your injuries? And do you have any medical bills or missed work because of this?`,
        ai_generated: false,
        fallback: true
      };
    }

    if (lowerMessage.includes('divorce') || lowerMessage.includes('custody')) {
      return {
        response: `Family law matters can be really difficult emotionally. I want to help you understand your options.

Are there children involved in your situation? That often affects how we approach these cases.`,
        ai_generated: false,
        fallback: true
      };
    }

    // Default fallback
    return {
      response: `I want to make sure I understand your situation correctly so I can help you best.

Can you tell me a bit more about what's happening?`,
      ai_generated: false,
      fallback: true
    };
  }
}

module.exports = AIResponseGenerator;
