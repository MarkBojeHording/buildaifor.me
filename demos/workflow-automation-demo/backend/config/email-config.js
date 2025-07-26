const { logger } = require('../utils/logger');

// Email configuration settings
const emailConfig = {
  // IMAP Configuration
  imap: {
    host: process.env.IMAP_HOST || 'imap.gmail.com',
    port: process.env.IMAP_PORT || 993,
    secure: process.env.IMAP_SECURE !== 'false', // true for 993, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  },

  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  },

  // Gmail API Configuration
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    redirectUri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/auth/gmail/callback',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.modify'
    ]
  },

  // Outlook/Exchange Configuration
  outlook: {
    clientId: process.env.OUTLOOK_CLIENT_ID,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    tenantId: process.env.OUTLOOK_TENANT_ID,
    redirectUri: process.env.OUTLOOK_REDIRECT_URI || 'http://localhost:3000/auth/outlook/callback'
  },

  // Email Processing Settings
  processing: {
    batchSize: parseInt(process.env.EMAIL_BATCH_SIZE) || 10,
    pollingInterval: parseInt(process.env.EMAIL_POLLING_INTERVAL) || 30000, // 30 seconds
    maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY) || 5000, // 5 seconds
    autoResponseDelay: parseInt(process.env.AUTO_RESPONSE_DELAY) || 5000 // 5 seconds
  },

  // Email Classification Settings
  classification: {
    confidenceThreshold: parseFloat(process.env.CLASSIFICATION_CONFIDENCE_THRESHOLD) || 0.7,
    enableAutoResponse: process.env.ENABLE_AUTO_RESPONSE !== 'false',
    enablePriorityScoring: process.env.ENABLE_PRIORITY_SCORING !== 'false',
    enableSentimentAnalysis: process.env.ENABLE_SENTIMENT_ANALYSIS !== 'false'
  },

  // Response Templates
  responseTemplates: {
    customer_support: {
      subject: 'Re: {original_subject}',
      body: `Dear {sender_name},

Thank you for contacting us regarding {issue_type}. We have received your inquiry and our support team will review it shortly.

{ai_generated_response}

If you have any additional information to provide, please reply to this email.

Best regards,
{company_name} Support Team

---
This is an automated response. A human agent will follow up within 24 hours.`
    },

    sales_inquiry: {
      subject: 'Re: {original_subject}',
      body: `Dear {sender_name},

Thank you for your interest in our products/services. We're excited to help you find the perfect solution for your needs.

{ai_generated_response}

Our sales team will contact you within the next business day to discuss your requirements in detail.

Best regards,
{company_name} Sales Team

---
This is an automated response. A sales representative will contact you soon.`
    },

    meeting_request: {
      subject: 'Re: {original_subject}',
      body: `Dear {sender_name},

Thank you for your meeting request. We'd be happy to schedule a time to discuss {meeting_topic}.

{ai_generated_response}

Please let us know your preferred dates and times, and we'll confirm the meeting details.

Best regards,
{company_name} Team

---
This is an automated response. We'll confirm your meeting details shortly.`
    },

    urgent: {
      subject: 'URGENT: {original_subject}',
      body: `Dear {sender_name},

We have received your urgent inquiry regarding {issue_type}. This has been flagged as high priority and will be addressed immediately.

{ai_generated_response}

Our team is working on this right away and will provide an update within the next 2 hours.

Best regards,
{company_name} Team

---
This is an automated response for urgent matters.`
    }
  },

  // Email Filtering Rules
  filters: {
    spamKeywords: [
      'viagra', 'casino', 'lottery', 'inheritance', 'million dollars',
      'click here', 'limited time', 'act now', 'free money', 'weight loss'
    ],
    priorityKeywords: [
      'urgent', 'emergency', 'critical', 'asap', 'immediately',
      'broken', 'down', 'error', 'failed', 'issue'
    ],
    supportKeywords: [
      'help', 'support', 'problem', 'issue', 'broken', 'not working',
      'error', 'bug', 'fix', 'troubleshoot'
    ],
    salesKeywords: [
      'quote', 'pricing', 'cost', 'price', 'purchase', 'buy',
      'demo', 'trial', 'proposal', 'contract'
    ]
  },

  // Notification Settings
  notifications: {
    email: {
      enabled: process.env.EMAIL_NOTIFICATIONS !== 'false',
      recipients: process.env.NOTIFICATION_EMAILS ? process.env.NOTIFICATION_EMAILS.split(',') : [],
      frequency: process.env.NOTIFICATION_FREQUENCY || 'daily'
    },
    slack: {
      enabled: process.env.SLACK_NOTIFICATIONS === 'true',
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: process.env.SLACK_CHANNEL || '#email-workflow'
    }
  }
};

// Validation function
function validateConfig() {
  const requiredFields = [
    'EMAIL_USER',
    'EMAIL_PASSWORD'
  ];

  const missingFields = requiredFields.filter(field => !process.env[field]);

  if (missingFields.length > 0) {
    logger.warn(`Missing environment variables: ${missingFields.join(', ')}`);
    logger.warn('Some features may not work without proper email configuration');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

// Get configuration for specific email provider
function getProviderConfig(provider = 'gmail') {
  switch (provider.toLowerCase()) {
    case 'gmail':
      return {
        imap: emailConfig.imap,
        smtp: emailConfig.smtp,
        api: emailConfig.gmail
      };
    case 'outlook':
      return {
        imap: {
          ...emailConfig.imap,
          host: 'outlook.office365.com',
          port: 993
        },
        smtp: {
          ...emailConfig.smtp,
          host: 'smtp.office365.com',
          port: 587
        },
        api: emailConfig.outlook
      };
    case 'yahoo':
      return {
        imap: {
          ...emailConfig.imap,
          host: 'imap.mail.yahoo.com',
          port: 993
        },
        smtp: {
          ...emailConfig.smtp,
          host: 'smtp.mail.yahoo.com',
          port: 587
        }
      };
    default:
      return emailConfig;
  }
}

module.exports = {
  emailConfig,
  validateConfig,
  getProviderConfig
};
