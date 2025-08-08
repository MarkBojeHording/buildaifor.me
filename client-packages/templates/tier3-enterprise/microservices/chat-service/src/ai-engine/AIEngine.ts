import OpenAI from 'openai';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Types from original Tier 3 implementation
export interface ChatRequest {
  message: string;
  userId?: string;
  sessionId?: string;
  context?: any;
  fileData?: any;
}

export interface ChatResponse {
  response: string;
  actions: AutomationAction[];
  analytics: ConversationAnalytics;
  nextSteps: string[];
  sessionId: string;
  timestamp: string;
}

export interface AutomationAction {
  type: 'crm' | 'schedule' | 'email' | 'ticket' | 'report' | 'workflow';
  label: string;
  icon: string;
  priority: 'low' | 'medium' | 'high';
  data?: any;
}

export interface ConversationAnalytics {
  messageCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  intent: string;
  confidence: number;
  processingTime: number;
}

export interface Session {
  sessionId: string;
  userId?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  messageCount: number;
  createdAt: Date;
  lastActivity: Date;
}

export class AIEngine {
  private openai: OpenAI;
  private logger: winston.Logger;
  private sessions: Map<string, Session>;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'ai-engine' },
      transports: [
        new winston.transports.File({ filename: 'logs/ai-engine-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/ai-engine-combined.log' })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }

    this.sessions = new Map<string, Session>();
  }

  /**
   * Main chat processing method - EXACT REPLICATION from Tier 3
   */
  async processChat(request: ChatRequest): Promise<ChatResponse> {
    const startTime = Date.now();

    try {
      const { message, userId, sessionId, context } = request;

      if (!message) {
        throw new Error('Message is required');
      }

      // Generate or get session
      const currentSessionId = sessionId || this.generateSessionId();
      const session = this.getOrCreateSession(currentSessionId, userId);

      // Update session with new message
      session.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });
      session.messageCount++;

      // Generate AI response
      const aiResponse = await this.generateAIResponse(message, context, session);

      // Generate automation actions
      const actions = await this.generateAutomationActions(message, aiResponse);

      // Update analytics
      const analytics = this.updateConversationAnalytics(message, session, Date.now() - startTime);

      // Suggest next steps
      const nextSteps = this.suggestNextSteps(message, aiResponse, session);

      // Update session with AI response
      session.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      });
      this.sessions.set(currentSessionId, session);

      const response: ChatResponse = {
        response: aiResponse,
        actions,
        analytics,
        nextSteps,
        sessionId: currentSessionId,
        timestamp: new Date().toISOString()
      };

      this.logger.info('Chat processed successfully', {
        sessionId: currentSessionId,
        processingTime: Date.now() - startTime,
        messageLength: message.length,
        responseLength: aiResponse.length
      });

      return response;

    } catch (error) {
      this.logger.error('Error processing chat:', error);

      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        actions: [],
        analytics: {
          messageCount: 0,
          sentiment: 'neutral',
          intent: 'unknown',
          confidence: 0,
          processingTime: 0
        },
        nextSteps: ['Try rephrasing your message', 'Check your connection'],
        sessionId: '',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate AI response - EXACT REPLICATION from Tier 3
   */
  private async generateAIResponse(message: string, context: any, session: Session): Promise<string> {
    try {
      // Build conversation history (last 10 messages for performance)
      const conversationHistory = session.messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      const systemPrompt = `You are an advanced Enterprise AI Assistant for a business automation platform. You help with:
      - Customer support and inquiries
      - Workflow automation and process optimization
      - CRM data analysis and insights
      - Email composition and scheduling
      - Report generation and analytics
      - Task management and project coordination

      Respond in a professional, helpful manner. Be concise but informative. Suggest automation opportunities when relevant.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...conversationHistory,
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return completion.choices[0].message.content || this.generateFallbackResponse(message);

    } catch (error) {
      this.logger.error('Error generating AI response:', error);
      return this.generateFallbackResponse(message);
    }
  }

  /**
   * Generate automation actions - EXACT REPLICATION from Tier 3
   */
  private async generateAutomationActions(message: string, aiResponse: string): Promise<AutomationAction[]> {
    try {
      const systemPrompt = `Analyze the user message and AI response to suggest relevant automation actions. Return a JSON array of 2-3 actions with these fields:
      - type: action category (crm, schedule, email, ticket, report, workflow)
      - label: human-readable action name
      - icon: icon name (User, Calendar, Mail, FileText, BarChart3, Workflow)
      - priority: priority level (low, medium, high)

      Focus on practical business automation tasks.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `User message: "${message}"\nAI response: "${aiResponse}"\n\nSuggest relevant automation actions.`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      const actionsText = completion.choices[0].message.content;
      if (actionsText) {
        try {
          return JSON.parse(actionsText);
        } catch (parseError) {
          this.logger.warn('Failed to parse automation actions:', parseError);
          return this.generateDefaultActions(message);
        }
      }

      return this.generateDefaultActions(message);

    } catch (error) {
      this.logger.error('Error generating actions:', error);
      return this.generateDefaultActions(message);
    }
  }

  /**
   * Generate fallback response - EXACT REPLICATION from Tier 3
   */
  private generateFallbackResponse(message: string): string {
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

  /**
   * Generate default actions - EXACT REPLICATION from Tier 3
   */
  private generateDefaultActions(message: string): AutomationAction[] {
    return [
      { type: 'crm', label: 'Check Customer Data', icon: 'User', priority: 'medium' as const },
      { type: 'schedule', label: 'Schedule Meeting', icon: 'Calendar', priority: 'medium' as const },
      { type: 'email', label: 'Send Email', icon: 'Mail', priority: 'medium' as const },
      { type: 'ticket', label: 'Create Support Ticket', icon: 'FileText', priority: 'high' as const },
      { type: 'report', label: 'Generate Report', icon: 'BarChart3', priority: 'low' as const },
      { type: 'workflow', label: 'Start Workflow', icon: 'Workflow', priority: 'medium' as const }
    ];
  }

  /**
   * Update conversation analytics - EXACT REPLICATION from Tier 3
   */
  private updateConversationAnalytics(message: string, session: Session, processingTime: number): ConversationAnalytics {
    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'perfect', 'love', 'like', 'happy', 'satisfied'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'upset', 'poor'];

    const lowerMessage = message.toLowerCase();
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';

    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;

    if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    }

    // Simple intent detection
    const intents = {
      'customer_support': ['help', 'support', 'issue', 'problem', 'ticket'],
      'workflow': ['workflow', 'automation', 'process', 'automate'],
      'analytics': ['report', 'analytics', 'data', 'metrics', 'insights'],
      'scheduling': ['schedule', 'meeting', 'calendar', 'appointment'],
      'email': ['email', 'send', 'message', 'communication']
    };

    let detectedIntent = 'general';
    let confidence = 0.5;

    for (const [intent, keywords] of Object.entries(intents)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > 0) {
        detectedIntent = intent;
        confidence = Math.min(0.9, 0.5 + (matches * 0.1));
        break;
      }
    }

    return {
      messageCount: session.messageCount,
      sentiment,
      intent: detectedIntent,
      confidence,
      processingTime
    };
  }

  /**
   * Suggest next steps - EXACT REPLICATION from Tier 3
   */
  private suggestNextSteps(message: string, aiResponse: string, session: Session): string[] {
    const lowerMessage = message.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();

    const nextSteps: string[] = [];

    if (lowerMessage.includes('customer') || lowerResponse.includes('customer')) {
      nextSteps.push('Review customer data in CRM');
      nextSteps.push('Schedule follow-up call');
    }

    if (lowerMessage.includes('workflow') || lowerResponse.includes('workflow')) {
      nextSteps.push('Create new workflow template');
      nextSteps.push('Review existing workflows');
    }

    if (lowerMessage.includes('report') || lowerResponse.includes('report')) {
      nextSteps.push('Generate detailed analytics report');
      nextSteps.push('Schedule automated reporting');
    }

    if (lowerMessage.includes('email') || lowerResponse.includes('email')) {
      nextSteps.push('Compose and send email');
      nextSteps.push('Set up email automation');
    }

    if (lowerMessage.includes('schedule') || lowerResponse.includes('schedule')) {
      nextSteps.push('Check calendar availability');
      nextSteps.push('Send meeting invitation');
    }

    // Default suggestions
    if (nextSteps.length === 0) {
      nextSteps.push('Continue conversation');
      nextSteps.push('Ask for more specific details');
    }

    return nextSteps.slice(0, 3); // Limit to 3 suggestions
  }

  /**
   * Generate session ID - EXACT REPLICATION from Tier 3
   */
  private generateSessionId(): string {
    return uuidv4();
  }

  /**
   * Get or create session - EXACT REPLICATION from Tier 3
   */
  private getOrCreateSession(sessionId: string, userId?: string): Session {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        userId,
        messages: [],
        messageCount: 0,
        createdAt: new Date(),
        lastActivity: new Date()
      });
    }

    const session = this.sessions.get(sessionId)!;
    session.lastActivity = new Date();
    return session;
  }

  /**
   * Clean up old sessions (memory management)
   */
  public cleanupOldSessions(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const sessionsToDelete: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < oneHourAgo) {
        sessionsToDelete.push(sessionId);
      }
    }

    sessionsToDelete.forEach(sessionId => {
      this.sessions.delete(sessionId);
    });

    if (sessionsToDelete.length > 0) {
      this.logger.info(`Cleaned up ${sessionsToDelete.length} old sessions`);
    }
  }

  /**
   * Get session statistics
   */
  public getSessionStats(): { totalSessions: number; activeSessions: number } {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    let activeSessions = 0;
    for (const session of this.sessions.values()) {
      if (session.lastActivity > fiveMinutesAgo) {
        activeSessions++;
      }
    }

    return {
      totalSessions: this.sessions.size,
      activeSessions
    };
  }
}
