const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const EnhancedResponseGenerator = require('./enhanced-response-generator');
const ChatbotResponseHandler = require('./chatbot-response-handler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-demo-key-for-testing') {
  try {
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI client initialized successfully');
  } catch (error) {
    console.log('⚠️ OpenAI client initialization failed, using fallback responses');
  }
} else {
  console.log('⚠️ No valid OpenAI API key found, using fallback responses');
}

// Simple CORS configuration for development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5175'],
  credentials: true
}));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.get('Origin') || 'no-origin'}`);
  next();
});

app.use(express.json());

// Enhanced sample document data with comprehensive content
const sampleDocuments = {
  'lease-agreement': {
    title: 'Commercial Lease Agreement',
    sections: [
      {
        id: 'lease-1-1',
        section: '1.1',
        page: 1,
        content: 'This Commercial Lease Agreement (the "Lease") is entered into on January 15, 2024, between ABC Properties LLC ("Landlord") and TechStart Inc. ("Tenant").'
      },
      {
        id: 'lease-2-1',
        section: '2.1',
        page: 2,
        content: 'Tenant shall pay to Landlord as monthly rent for the Premises the sum of Eight Thousand Five Hundred Dollars ($8,500.00) per month, due on the first day of each month during the term of this Lease.'
      },
      {
        id: 'lease-2-2',
        section: '2.2',
        page: 2,
        content: 'Rent shall be paid by check or electronic transfer to Landlord at the address specified in Section 1.1, or such other address as Landlord may designate in writing.'
      },
      {
        id: 'lease-3-1',
        section: '3.1',
        page: 3,
        content: 'The term of this Lease shall be 36 months, commencing on February 1, 2024, and ending on January 31, 2027, unless terminated earlier in accordance with the provisions of this Lease.'
      },
      {
        id: 'lease-4-1',
        section: '4.1',
        page: 4,
        content: 'Tenant shall use the Premises solely for office and administrative purposes and shall not use the Premises for any other purpose without Landlord\'s prior written consent.'
      },
      {
        id: 'lease-5-1',
        section: '5.1',
        page: 5,
        content: 'If Tenant desires to terminate this Lease prior to the Expiration Date, Tenant must provide Landlord with written notice at least ninety (90) days in advance. Tenant shall remain liable for rent payments until the termination date and shall pay a termination fee equal to two (2) months\' rent.'
      },
      {
        id: 'lease-6-1',
        section: '6.1',
        page: 6,
        content: 'Tenant shall be responsible for all utilities, including electricity, water, gas, and internet service. Landlord shall provide heating and air conditioning during normal business hours.'
      },
      {
        id: 'lease-7-1',
        section: '7.1',
        page: 7,
        content: 'Tenant shall maintain the Premises in good condition and repair, ordinary wear and tear excepted. Tenant shall not make any alterations or improvements without Landlord\'s prior written consent.'
      }
    ]
  },
  'employment-contract': {
    title: 'Employment Contract',
    sections: [
      {
        id: 'emp-1-1',
        section: '1.1',
        page: 1,
        content: 'This Employment Agreement (the "Agreement") is entered into on March 1, 2024, between Innovation Corp ("Employer") and Sarah Johnson ("Employee").'
      },
      {
        id: 'emp-2-1',
        section: '2.1',
        page: 2,
        content: 'Employee shall serve as Senior Software Engineer and shall perform such duties as are customarily associated with such position and as may be assigned by Employer from time to time.'
      },
      {
        id: 'emp-3-1',
        section: '3.1',
        page: 3,
        content: 'Employee shall receive an annual base salary of One Hundred Twenty-Five Thousand Dollars ($125,000.00), payable in accordance with the Company\'s normal payroll practices.'
      },
      {
        id: 'emp-3-2',
        section: '3.2',
        page: 3,
        content: 'Employee shall be eligible for an annual performance bonus of up to 20% of base salary, based on individual and company performance metrics.'
      },
      {
        id: 'emp-4-1',
        section: '4.1',
        page: 4,
        content: 'Employee shall be entitled to twenty (20) days of paid vacation per year, which shall accrue monthly and may be taken with reasonable notice to Employer.'
      },
      {
        id: 'emp-4-2',
        section: '4.2',
        page: 4,
        content: 'Employee shall be eligible for health insurance, dental insurance, vision insurance, and participation in the Company\'s 401(k) retirement plan with matching contributions up to 6% of salary.'
      },
      {
        id: 'emp-5-1',
        section: '5.1',
        page: 5,
        content: 'This Agreement shall commence on April 1, 2024, and shall continue until terminated by either party in accordance with the provisions of this Agreement.'
      },
      {
        id: 'emp-6-1',
        section: '6.1',
        page: 6,
        content: 'Either party may terminate this Agreement with thirty (30) days written notice. Employer may terminate immediately for cause, including but not limited to misconduct, poor performance, or violation of company policies.'
      }
    ]
  },
  'purchase-agreement': {
    title: 'Purchase Agreement',
    sections: [
      {
        id: 'purchase-1-1',
        section: '1.1',
        page: 1,
        content: 'This Purchase Agreement (the "Agreement") is entered into on February 15, 2024, between ABC Manufacturing Inc. ("Seller") and XYZ Distribution LLC ("Buyer").'
      },
      {
        id: 'purchase-2-1',
        section: '2.1',
        page: 2,
        content: 'Seller agrees to sell and Buyer agrees to purchase the following equipment (the "Equipment"): Industrial Manufacturing Line Model X-2000, Serial Number 2024-001.'
      },
      {
        id: 'purchase-2-2',
        section: '2.2',
        page: 2,
        content: 'The total purchase price for the Equipment shall be Two Hundred Fifty Thousand Dollars ($250,000.00), payable as follows: $50,000.00 upon execution of this Agreement (the "Deposit") and $200,000.00 upon delivery.'
      },
      {
        id: 'purchase-3-1',
        section: '3.1',
        page: 3,
        content: 'Delivery of the Equipment shall be made to Buyer\'s facility at 123 Industrial Blvd, Manufacturing City, NV 89101, on or before April 15, 2024.'
      },
      {
        id: 'purchase-4-1',
        section: '4.1',
        page: 4,
        content: 'Seller warrants that the Equipment shall be free from defects in materials and workmanship for a period of 12 months from the date of delivery.'
      },
      {
        id: 'purchase-5-1',
        section: '5.1',
        page: 5,
        content: 'Title to the Equipment shall pass to Buyer upon delivery. Risk of loss shall pass to Buyer upon delivery.'
      },
      {
        id: 'purchase-6-1',
        section: '6.1',
        page: 6,
        content: 'If Buyer fails to make any payment when due or fails to perform any other obligation under this Agreement, Seller may terminate this Agreement and retain the Deposit as liquidated damages.'
      }
    ]
  },
  'service-agreement': {
    title: 'Service Agreement',
    sections: [
      {
        id: 'service-1-1',
        section: '1.1',
        page: 1,
        content: 'This Service Agreement (the "Agreement") is entered into on May 1, 2024, between TechSolutions Inc. ("Service Provider") and Global Retail Corp ("Client").'
      },
      {
        id: 'service-2-1',
        section: '2.1',
        page: 2,
        content: 'Service Provider agrees to provide the following services to Client: Website development and maintenance, Mobile application development, IT consulting and support, Data analytics and reporting.'
      },
      {
        id: 'service-3-1',
        section: '3.1',
        page: 3,
        content: 'Client shall pay Service Provider a monthly fee of Fifteen Thousand Dollars ($15,000.00) for the Services. For any services not included in the monthly fee, Service Provider shall charge Client at the rate of One Hundred Fifty Dollars ($150.00) per hour.'
      },
      {
        id: 'service-3-2',
        section: '3.2',
        page: 3,
        content: 'Payment shall be due within 30 days of receipt of invoice. Late payments shall incur interest at the rate of 1.5% per month.'
      },
      {
        id: 'service-4-1',
        section: '4.1',
        page: 4,
        content: 'Service Provider shall maintain 99.9% uptime for all hosted services and shall respond to support requests within 4 hours during business hours.'
      },
      {
        id: 'service-5-1',
        section: '5.1',
        page: 5,
        content: 'This Agreement shall commence on May 15, 2024, and shall continue for a period of 24 months, unless terminated earlier in accordance with the provisions of this Agreement.'
      },
      {
        id: 'service-6-1',
        section: '6.1',
        page: 6,
        content: 'Either party may terminate this Agreement for material breach if such breach is not cured within 30 days of written notice. Client may terminate this Agreement for convenience upon 60 days written notice.'
      }
    ]
  },
  'partnership-agreement': {
    title: 'Partnership Agreement',
    sections: [
      {
        id: 'partnership-1-1',
        section: '1.1',
        page: 1,
        content: 'This Partnership Agreement (the "Agreement") is entered into on June 1, 2024, between John Smith ("Partner A") and Maria Garcia ("Partner B") for the formation of a general partnership.'
      },
      {
        id: 'partnership-2-1',
        section: '2.1',
        page: 2,
        content: 'The partnership shall be known as "Smith & Garcia Consulting" and shall engage in the business of management consulting services.'
      },
      {
        id: 'partnership-3-1',
        section: '3.1',
        page: 3,
        content: 'Each partner shall contribute Fifty Thousand Dollars ($50,000.00) as initial capital to the partnership. Additional capital contributions may be required by unanimous consent of the partners.'
      },
      {
        id: 'partnership-4-1',
        section: '4.1',
        page: 4,
        content: 'Profits and losses shall be shared equally between the partners (50% each), unless otherwise agreed in writing.'
      },
      {
        id: 'partnership-5-1',
        section: '5.1',
        page: 5,
        content: 'Each partner shall devote their full time and attention to the partnership business and shall not engage in any other business activities without the written consent of the other partner.'
      },
      {
        id: 'partnership-6-1',
        section: '6.1',
        page: 6,
        content: 'Major decisions affecting the partnership, including but not limited to hiring employees, entering into contracts over $25,000, and borrowing money, shall require unanimous consent of all partners.'
      },
      {
        id: 'partnership-7-1',
        section: '7.1',
        page: 7,
        content: 'This partnership shall continue until terminated by mutual agreement of the partners or by the death, disability, or withdrawal of any partner.'
      }
    ]
  }
};

// Enhanced fallback response generator with comprehensive keyword matching
function generateFallbackResponse(message, documentId) {
  const lowerMessage = message.toLowerCase();
  const document = sampleDocuments[documentId];

  if (!document) {
    return {
      response: "I couldn't find the specified document. Please try again.",
      citations: [],
      confidence: 0.1
    };
  }

  // Comprehensive keyword matching for each document type
  const keywordPatterns = {
    'lease-agreement': {
      'hi|hello|hey|greetings': {
        response: '👋 Hi! I\'m here to help you understand your lease agreement. I can answer questions about rent, payments, lease terms, utilities, and more. What would you like to know?',
        citations: [{
          documentId: 'lease-agreement',
          section: '1.1',
          page: 1,
          paragraph: 1,
          text: 'This Commercial Lease Agreement (the "Lease") is entered into on January 15, 2024, between ABC Properties LLC ("Landlord") and TechStart Inc. ("Tenant").'
        }]
      },
      'rent|monthly|payment|cost': {
        response: '💰 Your monthly rent is $8,500, due on the 1st of each month.',
        citations: [{
          documentId: 'lease-agreement',
          section: '2.1',
          page: 2,
          paragraph: 1,
          text: 'Tenant shall pay to Landlord as monthly rent for the Premises the sum of Eight Thousand Five Hundred Dollars ($8,500.00) per month'
        }]
      },
      'terminate|break|end|cancel': {
        response: '🚪 To end your lease early, you need to give 90 days written notice and pay a termination fee of 2 months rent ($17,000).',
        citations: [{
          documentId: 'lease-agreement',
          section: '5.1',
          page: 5,
          paragraph: 1,
          text: 'If Tenant desires to terminate this Lease prior to the Expiration Date, Tenant must provide Landlord with written notice at least ninety (90) days in advance'
        }]
      },
      'term|duration|length|period': {
        response: '⏰ Your lease runs for 36 months, from February 1, 2024 to January 31, 2027.',
        citations: [{
          documentId: 'lease-agreement',
          section: '3.1',
          page: 3,
          paragraph: 1,
          text: 'The term of this Lease shall be 36 months, commencing on February 1, 2024, and ending on January 31, 2027'
        }]
      },
      'utilities|electricity|water|gas|internet': {
        response: '🔌 You pay for electricity, water, gas, and internet. The landlord covers heating and AC during business hours.',
        citations: [{
          documentId: 'lease-agreement',
          section: '6.1',
          page: 6,
          paragraph: 1,
          text: 'Tenant shall be responsible for all utilities, including electricity, water, gas, and internet service'
        }]
      }
    },
    'employment-contract': {
      'salary|compensation|pay|wage': {
        response: '💰 Your base salary is $125,000/year with up to 20% performance bonus potential.',
        citations: [
          {
            documentId: 'employment-contract',
            section: '3.1',
            page: 3,
            paragraph: 1,
            text: 'Employee shall receive an annual base salary of One Hundred Twenty-Five Thousand Dollars ($125,000.00)'
          },
          {
            documentId: 'employment-contract',
            section: '3.2',
            page: 3,
            paragraph: 1,
            text: 'Employee shall be eligible for an annual performance bonus of up to 20% of base salary'
          }
        ]
      },
      'benefits|insurance|vacation|401k|retirement': {
        response: '🏥 You get 20 days vacation, health/dental/vision insurance, and 401(k) with 6% company match.',
        citations: [
          {
            documentId: 'employment-contract',
            section: '4.1',
            page: 4,
            paragraph: 1,
            text: 'Employee shall be entitled to twenty (20) days of paid vacation per year'
          },
          {
            documentId: 'employment-contract',
            section: '4.2',
            page: 4,
            paragraph: 1,
            text: 'Employee shall be eligible for health insurance, dental insurance, vision insurance, and participation in the Company\'s 401(k) retirement plan'
          }
        ]
      },
      'terminate|fire|dismiss|end': {
        response: 'According to Section 6.1 on page 6, either party may terminate the agreement with thirty (30) days written notice. The employer may terminate immediately for cause, including misconduct, poor performance, or violation of company policies.',
        citations: [{
          documentId: 'employment-contract',
          section: '6.1',
          page: 6,
          paragraph: 1,
          text: 'Either party may terminate this Agreement with thirty (30) days written notice'
        }]
      }
    },
    'purchase-agreement': {
      'price|cost|amount|total': {
        response: 'According to Section 2.2 on page 2, the total purchase price is Two Hundred Fifty Thousand Dollars ($250,000.00), payable as follows: $50,000.00 upon execution of the agreement and $200,000.00 upon delivery.',
        citations: [{
          documentId: 'purchase-agreement',
          section: '2.2',
          page: 2,
          paragraph: 1,
          text: 'The total purchase price for the Equipment shall be Two Hundred Fifty Thousand Dollars ($250,000.00)'
        }]
      },
      'delivery|when|date|timeline': {
        response: 'According to Section 3.1 on page 3, delivery of the Equipment shall be made to your facility on or before April 15, 2024.',
        citations: [{
          documentId: 'purchase-agreement',
          section: '3.1',
          page: 3,
          paragraph: 1,
          text: 'Delivery of the Equipment shall be made to Buyer\'s facility on or before April 15, 2024'
        }]
      },
      'warranty|guarantee|defect': {
        response: 'According to Section 4.1 on page 4, the seller warrants that the Equipment shall be free from defects in materials and workmanship for a period of 12 months from the date of delivery.',
        citations: [{
          documentId: 'purchase-agreement',
          section: '4.1',
          page: 4,
          paragraph: 1,
          text: 'Seller warrants that the Equipment shall be free from defects in materials and workmanship for a period of 12 months'
        }]
      }
    },
    'service-agreement': {
      'fee|cost|price|payment|monthly': {
        response: 'According to Section 3.1 on page 3, the monthly fee is Fifteen Thousand Dollars ($15,000.00) for the Services. Additional services are charged at One Hundred Fifty Dollars ($150.00) per hour.',
        citations: [{
          documentId: 'service-agreement',
          section: '3.1',
          page: 3,
          paragraph: 1,
          text: 'Client shall pay Service Provider a monthly fee of Fifteen Thousand Dollars ($15,000.00) for the Services'
        }]
      },
      'services|what|include': {
        response: 'According to Section 2.1 on page 2, the services include: Website development and maintenance, Mobile application development, IT consulting and support, and Data analytics and reporting.',
        citations: [{
          documentId: 'service-agreement',
          section: '2.1',
          page: 2,
          paragraph: 1,
          text: 'Service Provider agrees to provide the following services: Website development and maintenance, Mobile application development, IT consulting and support, Data analytics and reporting'
        }]
      },
      'uptime|availability|response|support': {
        response: 'According to Section 4.1 on page 4, the service provider shall maintain 99.9% uptime for all hosted services and shall respond to support requests within 4 hours during business hours.',
        citations: [{
          documentId: 'service-agreement',
          section: '4.1',
          page: 4,
          paragraph: 1,
          text: 'Service Provider shall maintain 99.9% uptime for all hosted services and shall respond to support requests within 4 hours'
        }]
      }
    },
    'partnership-agreement': {
      'capital|contribution|investment': {
        response: 'According to Section 3.1 on page 3, each partner shall contribute Fifty Thousand Dollars ($50,000.00) as initial capital to the partnership. Additional capital contributions may be required by unanimous consent.',
        citations: [{
          documentId: 'partnership-agreement',
          section: '3.1',
          page: 3,
          paragraph: 1,
          text: 'Each partner shall contribute Fifty Thousand Dollars ($50,000.00) as initial capital to the partnership'
        }]
      },
      'profit|loss|share|split': {
        response: 'According to Section 4.1 on page 4, profits and losses shall be shared equally between the partners (50% each), unless otherwise agreed in writing.',
        citations: [{
          documentId: 'partnership-agreement',
          section: '4.1',
          page: 4,
          paragraph: 1,
          text: 'Profits and losses shall be shared equally between the partners (50% each)'
        }]
      },
      'decision|vote|consent|unanimous': {
        response: 'According to Section 6.1 on page 6, major decisions affecting the partnership, including hiring employees, entering into contracts over $25,000, and borrowing money, shall require unanimous consent of all partners.',
        citations: [{
          documentId: 'partnership-agreement',
          section: '6.1',
          page: 6,
          paragraph: 1,
          text: 'Major decisions affecting the partnership shall require unanimous consent of all partners'
        }]
      }
    }
  };

  const patterns = keywordPatterns[documentId];
  if (patterns) {
    for (const [pattern, response] of Object.entries(patterns)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lowerMessage)) {
        return {
          ...response,
          confidence: 0.95
        };
      }
    }
  }

  // Enhanced generic response with document-specific suggestions
  const suggestions = {
    'lease-agreement': 'rent, lease term, termination, utilities, maintenance',
    'employment-contract': 'salary, benefits, vacation, termination, job duties',
    'purchase-agreement': 'price, delivery, warranty, payment terms, equipment',
    'service-agreement': 'monthly fee, services included, uptime, support, termination',
    'partnership-agreement': 'capital contribution, profit sharing, decision making, partnership terms'
  };

  return {
    response: `I understand you're asking about "${message}" regarding the ${document.title}. While I don't have specific information about this exact question, I can help you with topics like: ${suggestions[documentId]}. Please try asking about these specific areas or rephrase your question to be more specific about terms, clauses, or sections mentioned in the document.`,
    citations: [{
      documentId: documentId,
      section: '1.1',
      page: 1,
      paragraph: 1,
      text: document.sections[0]?.content || 'Document content not available'
    }],
    confidence: 0.3
  };
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, documentId, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get relevant document sections
    const document = sampleDocuments[documentId];
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Use the new chatbot response handler for all responses
    const responseHandler = new ChatbotResponseHandler();
    const response = responseHandler.generateResponse(message, documentId, document);

    // Return the response directly - no need for additional formatting
    res.json(response);

    } catch (error) {
    console.error('Error in chat endpoint:', error);

    // Use new response handler for error fallback
    const responseHandler = new ChatbotResponseHandler();
    const fallbackResponse = responseHandler.generateResponse(req.body.message, req.body.documentId, sampleDocuments[req.body.documentId] || { sections: [] });

    res.json(fallbackResponse);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Legal Document Analyzer API is running',
    timestamp: new Date().toISOString(),
    server_port: PORT,
    openai_available: !!openai
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Document Analyzer Backend running on port ${PORT}`);
  console.log(`📝 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 OpenAI Status: ${openai ? 'Available' : 'Using Fallback Responses'}`);
});
