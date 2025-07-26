const OpenAI = require('openai');
const { logger } = require('../utils/logger');
const { runQuery, getRow, getAll } = require('../config/database');

class AIProcessor {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.classificationCategories = [
      'urgent',
      'customer_support',
      'sales_inquiry',
      'meeting_request',
      'invoice',
      'newsletter',
      'spam',
      'general'
    ];

    this.sentimentLevels = ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'];

    logger.info('AI Processor initialized');
  }

  // Main processing function
  async processEmail(emailData) {
    const startTime = Date.now();

    try {
      logger.logEmailProcessing(emailData.id, 'Starting AI processing');

      // Parallel processing for better performance
      const [classification, sentiment, entities, priority] = await Promise.all([
        this.classifyEmail(emailData),
        this.analyzeSentiment(emailData),
        this.extractEntities(emailData),
        this.calculatePriority(emailData)
      ]);

      const processingTime = Date.now() - startTime;
      logger.logPerformance('email_processing', processingTime, {
        emailId: emailData.id,
        classification: classification.type,
        confidence: classification.confidence
      });

      return {
        classification,
        sentiment,
        entities,
        priority,
        processingTime,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.logError(error, { emailId: emailData.id, operation: 'ai_processing' });
      throw error;
    }
  }

  // Email classification using OpenAI
  async classifyEmail(emailData) {
    try {
      const prompt = `Analyze this email and classify it into one of these categories:
${this.classificationCategories.join(', ')}

Email Subject: ${emailData.subject}
Email Content: ${emailData.content}

Provide your response in JSON format:
{
  "type": "category_name",
  "confidence": 0.95,
  "reasoning": "brief explanation"
}

Consider these guidelines:
- urgent: requires immediate attention, time-sensitive matters
- customer_support: help requests, complaints, technical issues
- sales_inquiry: product questions, pricing, purchase intent
- meeting_request: scheduling, appointments, calls
- invoice: billing, payments, financial documents
- newsletter: marketing, promotional content
- spam: unwanted, suspicious, or irrelevant content
- general: other business communications`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      });

      const result = JSON.parse(response.choices[0].message.content);

      logger.logEmailClassification(emailData.id, result.type, result.confidence);

      return {
        type: result.type,
        confidence: result.confidence,
        reasoning: result.reasoning
      };

    } catch (error) {
      logger.error('Classification failed, using fallback', error);
      return this.fallbackClassification(emailData);
    }
  }

  // Fallback classification using keyword matching
  fallbackClassification(emailData) {
    const content = `${emailData.subject} ${emailData.content}`.toLowerCase();

    const keywordRules = {
      urgent: ['urgent', 'emergency', 'critical', 'asap', 'immediately', 'broken', 'down'],
      customer_support: ['help', 'support', 'problem', 'issue', 'broken', 'error', 'bug', 'fix'],
      sales_inquiry: ['quote', 'pricing', 'cost', 'price', 'purchase', 'buy', 'demo', 'trial'],
      meeting_request: ['meeting', 'appointment', 'schedule', 'call', 'discuss', 'conference'],
      invoice: ['invoice', 'bill', 'payment', 'receipt', 'amount', 'due', 'balance'],
      newsletter: ['newsletter', 'promotion', 'offer', 'discount', 'sale', 'marketing'],
      spam: ['viagra', 'casino', 'lottery', 'inheritance', 'click here', 'limited time']
    };

    let bestMatch = 'general';
    let highestScore = 0;

    for (const [category, keywords] of Object.entries(keywordRules)) {
      const score = keywords.filter(keyword => content.includes(keyword)).length;
      if (score > highestScore) {
        highestScore = score;
        bestMatch = category;
      }
    }

    const confidence = Math.min(0.6 + (highestScore * 0.1), 0.9);

    return {
      type: bestMatch,
      confidence: confidence,
      reasoning: `Fallback classification based on keyword matching (${highestScore} matches)`
    };
  }

  // Sentiment analysis
  async analyzeSentiment(emailData) {
    try {
      const prompt = `Analyze the sentiment of this email and provide a score:

Email: ${emailData.content}

Respond with JSON:
{
  "level": "very_negative|negative|neutral|positive|very_positive",
  "score": -1.0 to 1.0,
  "confidence": 0.0 to 1.0,
  "key_indicators": ["word1", "word2"]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 150
      });

      const result = JSON.parse(response.choices[0].message.content);

      return {
        level: result.level,
        score: result.score,
        confidence: result.confidence,
        keyIndicators: result.key_indicators || []
      };

    } catch (error) {
      logger.error('Sentiment analysis failed', error);
      return {
        level: 'neutral',
        score: 0,
        confidence: 0.5,
        keyIndicators: []
      };
    }
  }

  // Entity extraction
  async extractEntities(emailData) {
    try {
      const prompt = `Extract key entities from this email:

Email: ${emailData.content}

Extract and return as JSON:
{
  "contacts": [
    {"name": "full name", "email": "email@domain.com", "phone": "phone number", "company": "company name"}
  ],
  "dates": ["date1", "date2"],
  "amounts": ["$100", "$500"],
  "action_items": ["action1", "action2"],
  "topics": ["topic1", "topic2"]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content);

      // Log extracted entities
      Object.entries(result).forEach(([type, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          logger.logDataExtraction(emailData.id, type, values.join(', '), 0.8);
        }
      });

      return result;

    } catch (error) {
      logger.error('Entity extraction failed', error);
      return {
        contacts: [],
        dates: [],
        amounts: [],
        action_items: [],
        topics: []
      };
    }
  }

  // Priority calculation
  async calculatePriority(emailData) {
    try {
      const prompt = `Calculate priority score (1-10) for this email:

Subject: ${emailData.subject}
Content: ${emailData.content}

Consider:
- Urgency indicators
- Sender importance
- Business impact
- Time sensitivity

Respond with JSON:
{
  "score": 1-10,
  "factors": ["factor1", "factor2"],
  "recommendation": "immediate|high|medium|low"
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 150
      });

      const result = JSON.parse(response.choices[0].message.content);

      return {
        score: Math.min(Math.max(result.score, 1), 10),
        factors: result.factors || [],
        recommendation: result.recommendation || 'medium'
      };

    } catch (error) {
      logger.error('Priority calculation failed', error);
      return {
        score: 5,
        factors: ['fallback calculation'],
        recommendation: 'medium'
      };
    }
  }

  // Generate AI response
  async generateResponse(emailData, classification, context = {}) {
    try {
      const prompt = `Generate a professional email response for this ${classification.type} email:

Original Email:
Subject: ${emailData.subject}
From: ${emailData.sender}
Content: ${emailData.content}

Context: ${JSON.stringify(context)}

Generate a response that is:
- Professional and appropriate for the email type
- Addresses the main points
- Includes relevant company information
- Suggests next steps if applicable

Respond with JSON:
{
  "subject": "Re: original subject",
  "body": "response body",
  "tone": "professional|friendly|formal",
  "confidence": 0.0 to 1.0,
  "suggested_actions": ["action1", "action2"]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content);

      return {
        subject: result.subject,
        body: result.body,
        tone: result.tone,
        confidence: result.confidence,
        suggestedActions: result.suggested_actions || []
      };

    } catch (error) {
      logger.error('Response generation failed', error);
      return {
        subject: `Re: ${emailData.subject}`,
        body: 'Thank you for your email. We have received your message and will respond shortly.',
        tone: 'professional',
        confidence: 0.5,
        suggestedActions: []
      };
    }
  }

  // Batch processing for multiple emails
  async processBatch(emails) {
    const results = [];
    const batchSize = 5; // Process in smaller batches to avoid rate limits

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(email => this.processEmail(email))
      );
      results.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  // Save processing results to database
  async saveProcessingResults(emailId, results) {
    try {
      const { classification, sentiment, entities, priority } = results;

      // Update email record
      await runQuery(`
        UPDATE emails
        SET classification = ?, confidence_score = ?, priority = ?, sentiment_score = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [classification.type, classification.confidence, priority.score, sentiment.score, emailId]);

      // Save extracted entities
      for (const [type, values] of Object.entries(entities)) {
        if (Array.isArray(values) && values.length > 0) {
          for (const value of values) {
            await runQuery(`
              INSERT INTO extracted_data (id, email_id, data_type, extracted_value, confidence_score)
              VALUES (?, ?, ?, ?, ?)
            `, [
              require('uuid').v4(),
              emailId,
              type,
              value,
              0.8
            ]);
          }
        }
      }

      logger.info(`Processing results saved for email ${emailId}`);

    } catch (error) {
      logger.error('Failed to save processing results', error);
      throw error;
    }
  }

  // Get processing statistics
  async getProcessingStats() {
    try {
      const stats = await getRow(`
        SELECT
          COUNT(*) as total_processed,
          AVG(confidence_score) as avg_confidence,
          AVG(priority) as avg_priority,
          AVG(sentiment_score) as avg_sentiment
        FROM emails
        WHERE classification IS NOT NULL
      `);

      const classificationBreakdown = await getAll(`
        SELECT classification, COUNT(*) as count
        FROM emails
        WHERE classification IS NOT NULL
        GROUP BY classification
        ORDER BY count DESC
      `);

      return {
        totalProcessed: stats.total_processed,
        averageConfidence: stats.avg_confidence,
        averagePriority: stats.avg_priority,
        averageSentiment: stats.avg_sentiment,
        classificationBreakdown
      };

    } catch (error) {
      logger.error('Failed to get processing stats', error);
      return null;
    }
  }
}

module.exports = { AIProcessor };
