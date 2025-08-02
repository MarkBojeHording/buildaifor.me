const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3003;

// Initialize OpenAI with fallback for missing API key
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.log('⚠️  OpenAI API key not found. Running in demo mode with fallback analysis.');
  openai = null;
}

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public', 'dist')));

// Sample emails for demonstration
const sampleEmails = {
  critical: {
    subject: "URGENT: System Completely Down - Enterprise Customer",
    content: "This is Sarah Johnson, CTO at TechCorp. Our entire platform has been down for 3 hours now. 200+ users cannot access the system. This is costing us thousands of dollars per hour. We have a $50K annual contract and this is completely unacceptable. I need immediate assistance or we will be forced to cancel our subscription and seek legal action. This is the third time this month we've had issues. Please respond immediately."
  },
  high: {
    subject: "Payment Processing Failed - Need Immediate Resolution",
    content: "Hi, I'm Mike Chen from DataFlow Solutions. Our payment processing has been failing for the past 2 hours. We're losing customers because they can't complete transactions. This is affecting our $15K monthly revenue. We're on the Professional plan and this is critical for our business operations. Please fix this ASAP or we'll need to consider alternatives."
  },
  medium: {
    subject: "Feature Request: API Rate Limiting Issues",
    content: "Hello, I'm Alex Rodriguez from CloudTech. We've been using your API for 6 months and generally love the service. However, we're hitting rate limits frequently during peak hours. Could you please increase our limits or provide a solution? We're on the Pro plan and this is affecting our user experience. Not urgent but would appreciate a response within 24 hours."
  },
  low: {
    subject: "Question about Documentation",
    content: "Hi there, I'm Lisa Thompson from StartupXYZ. I'm new to your platform and was wondering if you have any tutorials for setting up webhooks? I couldn't find this in the documentation. Also, what's the best way to handle authentication for our mobile app? Thanks for your help!"
  }
};

// AI Analysis Function
async function analyzeEmail(emailContent) {
  // Check if OpenAI is available
  if (!openai) {
    console.log('Running in demo mode - using fallback analysis');
    return getFallbackAnalysis(emailContent);
  }

  try {
    const analysisPrompt = `
Analyze this customer support email and provide comprehensive insights. Consider all aspects of customer support relevance, urgency, importance, and business impact.

Email Content: "${emailContent}"

Provide analysis in this exact JSON format (no additional text, only valid JSON):
{
  "relevance": {
    "score": 0-100,
    "reasoning": "explanation of relevance score"
  },
  "urgency": {
    "level": "Critical/High/Medium/Low",
    "reasoning": "explanation of urgency level",
    "triggers": ["list", "of", "urgency", "triggers"]
  },
  "importance": {
    "level": "High/Medium/Low",
    "reasoning": "explanation of importance level"
  },
  "category": {
    "primary": "main category",
    "secondary": "subcategory",
    "confidence": 0-100
  },
  "sentiment": {
    "emotion": "primary emotion",
    "satisfaction": "positive/negative/neutral",
    "churnRisk": "high/medium/low",
    "intensity": 0-100
  },
  "extractedData": {
    "customerName": "extracted name",
    "company": "extracted company",
    "accountNumber": "extracted account info",
    "orderNumber": "extracted order info",
    "phoneNumber": "extracted phone",
    "email": "extracted email"
  },
  "recommendations": {
    "responseTime": "immediate/1hour/4hours/24hours/3days",
    "routeTo": "L1/L2/Billing/Account/Engineering/Leadership",
    "expertiseLevel": "basic/intermediate/advanced/specialist",
    "escalation": "none/low/medium/high/critical"
  },
  "businessMetrics": {
    "revenueImpact": "high/medium/low",
    "customerTier": "trial/new/established/at-risk/vip",
    "complexityScore": 1-10,
    "estimatedValue": "dollar amount or range"
  },
  "confidence": {
    "overall": 0-100,
    "urgency": 0-100,
    "sentiment": 0-100,
    "category": 0-100
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert customer support analyst. Analyze emails with high accuracy and provide detailed, actionable insights. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    // Add processing metadata
    analysis.processingTime = Date.now();
    analysis.processingMethod = "OpenAI GPT-4";

    return analysis;
  } catch (error) {
    console.error('Analysis error:', error);
    return getFallbackAnalysis(emailContent);
  }
}

// Fallback analysis function for demo mode
function getFallbackAnalysis(emailContent) {
  const content = emailContent.toLowerCase();

  // Simple keyword-based analysis
  let urgency = "Low";
  let importance = "Low";
  let category = "General Inquiries";
  let sentiment = "neutral";
  let churnRisk = "low";

  // Urgency detection
  if (content.includes('urgent') || content.includes('asap') || content.includes('emergency') || content.includes('critical')) {
    urgency = "Critical";
  } else if (content.includes('immediately') || content.includes('broken') || content.includes('down') || content.includes('not working')) {
    urgency = "High";
  } else if (content.includes('issue') || content.includes('problem') || content.includes('help')) {
    urgency = "Medium";
  }

  // Importance detection
  if (content.includes('enterprise') || content.includes('$') || content.includes('contract') || content.includes('legal')) {
    importance = "High";
  } else if (content.includes('business') || content.includes('revenue') || content.includes('customers')) {
    importance = "Medium";
  }

  // Category detection
  if (content.includes('payment') || content.includes('billing') || content.includes('invoice')) {
    category = "Billing & Payments";
  } else if (content.includes('bug') || content.includes('error') || content.includes('technical')) {
    category = "Technical Support";
  } else if (content.includes('feature') || content.includes('request') || content.includes('enhancement')) {
    category = "Feature Requests";
  }

  // Sentiment detection
  if (content.includes('angry') || content.includes('frustrated') || content.includes('unacceptable') || content.includes('cancel')) {
    sentiment = "negative";
    churnRisk = "high";
  } else if (content.includes('love') || content.includes('great') || content.includes('excellent')) {
    sentiment = "positive";
  }

  return {
    relevance: { score: 85, reasoning: "Standard customer support inquiry" },
    urgency: { level: urgency, reasoning: `Detected ${urgency.toLowerCase()} priority keywords`, triggers: [] },
    importance: { level: importance, reasoning: `Business impact assessment: ${importance.toLowerCase()}` },
    category: { primary: category, secondary: "AI Analysis", confidence: 75 },
    sentiment: { emotion: sentiment === "negative" ? "Frustrated" : sentiment === "positive" ? "Happy" : "Neutral", satisfaction: sentiment, churnRisk: churnRisk, intensity: 50 },
    extractedData: { customerName: "", company: "", accountNumber: "", orderNumber: "", phoneNumber: "", email: "" },
    recommendations: {
      responseTime: urgency === "Critical" ? "immediate" : urgency === "High" ? "1hour" : urgency === "Medium" ? "4hours" : "24hours",
      routeTo: importance === "High" ? "L2" : "L1",
      expertiseLevel: "basic",
      escalation: urgency === "Critical" ? "high" : "none"
    },
    businessMetrics: {
      revenueImpact: importance === "High" ? "high" : importance === "Medium" ? "medium" : "low",
      customerTier: "new",
      complexityScore: urgency === "Critical" ? 8 : urgency === "High" ? 6 : 3,
      estimatedValue: importance === "High" ? "$1000-5000" : "$100-500"
    },
    confidence: { overall: 75, urgency: 80, sentiment: 70, category: 75 },
    processingTime: Date.now(),
    processingMethod: "Demo Fallback Analysis"
  };
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/sample-emails', (req, res) => {
  res.json(sampleEmails);
});

app.post('/api/analyze-email', async (req, res) => {
  try {
    const { emailContent } = req.body;

    if (!emailContent || emailContent.trim().length === 0) {
      return res.status(400).json({ error: 'Email content is required' });
    }

    const analysis = await analyzeEmail(emailContent);
    res.json(analysis);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// Serve the main application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Email Analysis Server running on port ${PORT}`);
  console.log(`📧 Sample emails available at: http://localhost:${PORT}/api/sample-emails`);
  console.log(`🔍 Analysis endpoint: http://localhost:${PORT}/api/analyze-email`);
});
