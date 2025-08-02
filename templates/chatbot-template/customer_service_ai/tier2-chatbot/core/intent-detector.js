const OpenAI = require('openai');

class IntentDetector {
  constructor(config) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.config = config;
    this.intents = [
      'CASE_INQUIRY',
      'INJURY_DETAILS',
      'FEE_QUESTIONS',
      'CONSULTATION_REQUEST',
      'URGENT_MATTER',
      'GENERAL_INFO',
      'APPOINTMENT_SCHEDULING',
      'CASE_STATUS',
      'DOCUMENT_HELP',
      'REFERRAL_REQUEST',
      'CRIMINAL_DEFENSE' // Added criminal defense intent
    ];
  }

  async detectIntent(message, sessionData, clientConfig) {
    try {
      console.log('🎯 Intent Detector - Analyzing message intent');

      const conversationHistory = sessionData.messages || [];
      const fullContext = conversationHistory.map(m => m.text).join(' ') + ' ' + message;
      const lowerContext = fullContext.toLowerCase();

      // Criminal Defense Detection (Priority)
      const criminalKeywords = [
        'arrested', 'dui', 'dwi', 'criminal', 'charges', 'court date',
        'police', 'jail', 'bail', 'felony', 'misdemeanor', 'drug charge',
        'assault', 'theft', 'domestic violence', 'warrant', 'probation',
        'first offense', 'first time', 'driving under influence'
      ];

      if (criminalKeywords.some(keyword => lowerContext.includes(keyword))) {
        const criminalIntent = {
          primary: {
            intent: 'CRIMINAL_DEFENSE',
            confidence: 0.95
          },
          secondary: null,
          reasoning: 'Criminal defense case detected based on keywords',
          practiceArea: 'criminal_defense',
          urgency: 'high',
          specialization: this.determineCriminalSpecialization(lowerContext),
          timestamp: new Date().toISOString()
        };

        console.log('✅ Criminal defense intent detected:', criminalIntent);
        return criminalIntent;
      }

      // Personal Injury Detection
      const piKeywords = ['accident', 'injury', 'hurt', 'pain', 'crash', 'hit', 'collision'];
      if (piKeywords.some(keyword => lowerContext.includes(keyword))) {
        const piIntent = {
          primary: {
            intent: 'INJURY_DETAILS',
            confidence: 0.90
          },
          secondary: {
            intent: 'CASE_INQUIRY',
            confidence: 0.70
          },
          reasoning: 'Personal injury case detected based on keywords',
          practiceArea: 'personal_injury',
          urgency: this.determineUrgency(lowerContext),
          caseType: this.determineInjuryType(lowerContext),
          timestamp: new Date().toISOString()
        };

        console.log('✅ Personal injury intent detected:', piIntent);
        return piIntent;
      }

      // Use AI for other cases
      const prompt = this.buildIntentPrompt(message, sessionData, clientConfig);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: this.getIntentSystemPrompt()
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 150
      });

      const intentResult = completion.choices[0].message.content;
      const parsedIntent = this.parseIntentResult(intentResult);

      console.log('✅ Intent detection completed:', parsedIntent);
      return parsedIntent;

    } catch (error) {
      console.error('❌ Intent detection failed:', error.message);
      return this.getFallbackIntent(message);
    }
  }

  determineCriminalSpecialization(context) {
    if (context.includes('dui') || context.includes('dwi') || context.includes('driving under influence')) {
      return 'dui_defense';
    }
    if (context.includes('drug') || context.includes('possession')) {
      return 'drug_crimes';
    }
    if (context.includes('assault') || context.includes('domestic') || context.includes('battery')) {
      return 'violent_crimes';
    }
    if (context.includes('theft') || context.includes('burglary') || context.includes('robbery')) {
      return 'property_crimes';
    }
    return 'general_criminal';
  }

  determineInjuryType(context) {
    if (context.includes('car') || context.includes('auto') || context.includes('vehicle')) {
      return 'auto_accident';
    }
    if (context.includes('slip') || context.includes('fall')) {
      return 'slip_fall';
    }
    if (context.includes('medical') || context.includes('malpractice')) {
      return 'medical_malpractice';
    }
    return 'general_injury';
  }

  determineUrgency(context) {
    if (context.includes('urgent') || context.includes('emergency') || context.includes('asap')) {
      return 'high';
    }
    if (context.includes('soon') || context.includes('quick')) {
      return 'medium';
    }
    return 'standard';
  }

  classifyPracticeArea(context) {
    if (context.includes('criminal') || context.includes('arrested') || context.includes('charges')) {
      return 'criminal_defense';
    }
    if (context.includes('accident') || context.includes('injury') || context.includes('pain')) {
      return 'personal_injury';
    }
    if (context.includes('divorce') || context.includes('custody') || context.includes('family')) {
      return 'family_law';
    }
    if (context.includes('business') || context.includes('contract') || context.includes('corporate')) {
      return 'business_law';
    }
    return 'general';
  }

  getIntentSystemPrompt() {
    return `You are a legal intent detection AI. Analyze client messages and identify the primary legal intent.

AVAILABLE INTENTS:
- CASE_INQUIRY: General questions about legal cases or services
- INJURY_DETAILS: Specific details about injuries or accidents
- FEE_QUESTIONS: Questions about legal fees, costs, or payment
- CONSULTATION_REQUEST: Request for legal consultation or meeting
- URGENT_MATTER: Time-sensitive legal issues requiring immediate attention
- GENERAL_INFO: General information requests or greetings
- APPOINTMENT_SCHEDULING: Scheduling appointments or meetings
- CASE_STATUS: Questions about existing case status
- DOCUMENT_HELP: Help with legal documents or paperwork
- REFERRAL_REQUEST: Request for attorney referral
- CRIMINAL_DEFENSE: Criminal defense related inquiries

RESPONSE FORMAT:
Primary Intent: [INTENT_NAME]
Confidence: [0.0-1.0]
Reasoning: [Brief explanation]
Practice Area: [criminal_defense/personal_injury/family_law/business_law/general]
Urgency: [high/medium/low]`;
  }

  buildIntentPrompt(message, sessionData, clientConfig) {
    const context = this.buildIntentContext(sessionData);

    return `Client Message: "${message}"

Conversation Context:
${context}

Practice Areas: ${clientConfig.lead_capture?.case_types?.join(', ') || 'General legal services'}

Please analyze this message and identify the primary legal intent.`;
  }

  buildIntentContext(sessionData) {
    if (!sessionData || Object.keys(sessionData).length === 0) {
      return "First message in conversation.";
    }

    let context = "Previous conversation data:\n";

    if (sessionData.intent_history) {
      context += `- Previous intents: ${JSON.stringify(sessionData.intent_history)}\n`;
    }

    if (sessionData.conversation_stage) {
      context += `- Conversation stage: ${sessionData.conversation_stage}\n`;
    }

    if (sessionData.messages && sessionData.messages.length > 0) {
      const recentMessages = sessionData.messages.slice(-3);
      context += `- Recent messages: ${recentMessages.map(m => m.text).join(' | ')}\n`;
    }

    return context;
  }

  parseIntentResult(result) {
    try {
      const lines = result.split('\n');
      let primaryIntent = 'GENERAL_INFO';
      let confidence = 0.7;
      let reasoning = 'AI analysis completed';
      let practiceArea = 'general';
      let urgency = 'standard';

      for (const line of lines) {
        if (line.startsWith('Primary Intent:')) {
          const intent = line.replace('Primary Intent:', '').trim();
          if (this.intents.includes(intent)) {
            primaryIntent = intent;
          }
        } else if (line.startsWith('Confidence:')) {
          const conf = parseFloat(line.replace('Confidence:', '').trim());
          if (!isNaN(conf) && conf >= 0 && conf <= 1) {
            confidence = conf;
          }
        } else if (line.startsWith('Reasoning:')) {
          reasoning = line.replace('Reasoning:', '').trim();
        } else if (line.startsWith('Practice Area:')) {
          practiceArea = line.replace('Practice Area:', '').trim();
        } else if (line.startsWith('Urgency:')) {
          urgency = line.replace('Urgency:', '').trim();
        }
      }

      return {
        primary: {
          intent: primaryIntent,
          confidence: confidence
        },
        secondary: null,
        reasoning: reasoning,
        practiceArea: practiceArea,
        urgency: urgency,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error parsing intent result:', error);
      return this.getFallbackIntent('');
    }
  }

  getFallbackIntent(message) {
    console.log('🔄 Using fallback intent detection');

    const lowerMessage = message.toLowerCase();
    let primaryIntent = 'GENERAL_INFO';
    let confidence = 0.7;
    let reasoning = 'Fallback analysis';
    let practiceArea = 'general';
    let urgency = 'standard';

    // Simple keyword-based detection
    if (lowerMessage.includes('injury') || lowerMessage.includes('accident') || lowerMessage.includes('hurt')) {
      primaryIntent = 'INJURY_DETAILS';
      confidence = 0.85;
      reasoning = 'Injury-related keywords detected';
      practiceArea = 'personal_injury';
      urgency = 'medium';
    } else if (lowerMessage.includes('arrest') || lowerMessage.includes('charges') || lowerMessage.includes('criminal')) {
      primaryIntent = 'CRIMINAL_DEFENSE';
      confidence = 0.90;
      reasoning = 'Criminal defense keywords detected';
      practiceArea = 'criminal_defense';
      urgency = 'high';
    } else if (lowerMessage.includes('divorce') || lowerMessage.includes('custody') || lowerMessage.includes('family')) {
      primaryIntent = 'CASE_INQUIRY';
      confidence = 0.80;
      reasoning = 'Family law keywords detected';
      practiceArea = 'family_law';
      urgency = 'medium';
    } else if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      primaryIntent = 'FEE_QUESTIONS';
      confidence = 0.85;
      reasoning = 'Fee-related keywords detected';
      practiceArea = 'general';
      urgency = 'low';
    } else if (lowerMessage.includes('consult') || lowerMessage.includes('meet') || lowerMessage.includes('appointment')) {
      primaryIntent = 'CONSULTATION_REQUEST';
      confidence = 0.80;
      reasoning = 'Consultation request keywords detected';
      practiceArea = 'general';
      urgency = 'medium';
    } else if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || lowerMessage.includes('asap')) {
      primaryIntent = 'URGENT_MATTER';
      confidence = 0.85;
      reasoning = 'Urgency keywords detected';
      practiceArea = 'general';
      urgency = 'high';
    }

    return {
      primary: {
        intent: primaryIntent,
        confidence: confidence
      },
      secondary: null,
      reasoning: reasoning,
      practiceArea: practiceArea,
      urgency: urgency,
      fallback: true,
      timestamp: new Date().toISOString()
    };
  }

  updateSessionIntents(sessionData, intentResult) {
    sessionData.intent_history = sessionData.intent_history || [];
    sessionData.intent_history.push({
      intent: intentResult.primary.intent,
      confidence: intentResult.primary.confidence,
      timestamp: new Date().toISOString()
    });

    // Keep only last 5 intents
    if (sessionData.intent_history.length > 5) {
      sessionData.intent_history = sessionData.intent_history.slice(-5);
    }
  }

  getIntentPriority(intent) {
    const priorities = {
      'CRIMINAL_DEFENSE': 1,
      'URGENT_MATTER': 2,
      'INJURY_DETAILS': 3,
      'CONSULTATION_REQUEST': 4,
      'CASE_INQUIRY': 5,
      'FEE_QUESTIONS': 6,
      'APPOINTMENT_SCHEDULING': 7,
      'CASE_STATUS': 8,
      'DOCUMENT_HELP': 9,
      'REFERRAL_REQUEST': 10,
      'GENERAL_INFO': 11
    };

    return priorities[intent] || 12;
  }

  shouldEscalate(intentResult) {
    const highPriorityIntents = ['CRIMINAL_DEFENSE', 'URGENT_MATTER'];
    const highUrgency = ['high'];

    return highPriorityIntents.includes(intentResult.primary.intent) ||
           highUrgency.includes(intentResult.urgency);
  }
}

module.exports = IntentDetector;
