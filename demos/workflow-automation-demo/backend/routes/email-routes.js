const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');
const { runQuery, getRow, getAll } = require('../config/database');
const { AIProcessor } = require('../services/ai-processor');
const { EmailService } = require('../services/email-service');

const router = express.Router();
const aiProcessor = new AIProcessor();
const emailService = new EmailService();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware to log API requests
router.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.logApiRequest(req.method, req.path, res.statusCode, duration);
  });
  next();
});

// Process single email
router.post('/process', async (req, res) => {
  try {
    const { subject, sender, sender_email, content, html_content } = req.body;

    if (!subject || !sender || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['subject', 'sender', 'content']
      });
    }

    const emailData = {
      id: uuidv4(),
      subject,
      sender,
      sender_email: sender_email || 'unknown@example.com',
      content,
      html_content: html_content || content,
      received_date: new Date()
    };

    // Save email to database
    await emailService.saveEmail(emailData);

    // Process with AI
    const results = await emailService.processEmail(emailData);

    res.json({
      success: true,
      emailId: emailData.id,
      results
    });

  } catch (error) {
    logger.error('Email processing error:', error);
    res.status(500).json({
      error: 'Failed to process email',
      message: error.message
    });
  }
});

// Process batch of emails
router.post('/process-batch', async (req, res) => {
  try {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        error: 'Emails array is required and must not be empty'
      });
    }

    const emailDataArray = emails.map(email => ({
      id: uuidv4(),
      subject: email.subject || 'No Subject',
      sender: email.sender || 'Unknown Sender',
      sender_email: email.sender_email || 'unknown@example.com',
      content: email.content || '',
      html_content: email.html_content || email.content || '',
      received_date: new Date()
    }));

    // Save emails to database
    for (const email of emailDataArray) {
      await emailService.saveEmail(email);
    }

    // Process batch with AI
    const results = await emailService.processBatch(emailDataArray);

    res.json({
      success: true,
      processed: results.length,
      results
    });

  } catch (error) {
    logger.error('Batch processing error:', error);
    res.status(500).json({
      error: 'Failed to process batch',
      message: error.message
    });
  }
});

// Upload and process email file
router.post('/upload', upload.single('email'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    const fileContent = req.file.buffer.toString('utf8');

    // Simple email parsing (in production, use proper email parser)
    const lines = fileContent.split('\n');
    const emailData = {
      id: uuidv4(),
      subject: '',
      sender: '',
      sender_email: '',
      content: '',
      received_date: new Date()
    };

    let inBody = false;
    for (const line of lines) {
      if (line.startsWith('Subject:')) {
        emailData.subject = line.replace('Subject:', '').trim();
      } else if (line.startsWith('From:')) {
        emailData.sender = line.replace('From:', '').trim();
      } else if (line.startsWith('To:')) {
        // Skip
      } else if (line.trim() === '') {
        inBody = true;
      } else if (inBody) {
        emailData.content += line + '\n';
      }
    }

    if (!emailData.subject || !emailData.sender) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Save and process
    await emailService.saveEmail(emailData);
    const results = await emailService.processEmail(emailData);

    res.json({
      success: true,
      emailId: emailData.id,
      results
    });

  } catch (error) {
    logger.error('File upload processing error:', error);
    res.status(500).json({
      error: 'Failed to process uploaded file',
      message: error.message
    });
  }
});

// Generate AI response for email
router.post('/generate-response', async (req, res) => {
  try {
    const { emailId, context } = req.body;

    if (!emailId) {
      return res.status(400).json({
        error: 'Email ID is required'
      });
    }

    // Get email data
    const email = await emailService.getEmailDetails(emailId);
    if (!email) {
      return res.status(404).json({
        error: 'Email not found'
      });
    }

    // Generate response
    const response = await aiProcessor.generateResponse(email, {
      type: email.classification || 'general',
      confidence: email.confidence_score || 0.5
    }, context || {});

    res.json({
      success: true,
      emailId,
      response
    });

  } catch (error) {
    logger.error('Response generation error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

// Send response for email
router.post('/send-response', async (req, res) => {
  try {
    const { emailId, responseData } = req.body;

    if (!emailId || !responseData) {
      return res.status(400).json({
        error: 'Email ID and response data are required'
      });
    }

    // Get email data
    const email = await emailService.getEmailDetails(emailId);
    if (!email) {
      return res.status(404).json({
        error: 'Email not found'
      });
    }

    // Send response
    const result = await emailService.sendResponse(email, responseData);

    res.json({
      success: true,
      emailId,
      messageId: result.messageId,
      response: result.response
    });

  } catch (error) {
    logger.error('Send response error:', error);
    res.status(500).json({
      error: 'Failed to send response',
      message: error.message
    });
  }
});

// Get email details
router.get('/:emailId', async (req, res) => {
  try {
    const { emailId } = req.params;

    const email = await emailService.getEmailDetails(emailId);
    if (!email) {
      return res.status(404).json({
        error: 'Email not found'
      });
    }

    res.json({
      success: true,
      email
    });

  } catch (error) {
    logger.error('Get email details error:', error);
    res.status(500).json({
      error: 'Failed to get email details',
      message: error.message
    });
  }
});

// Get emails by classification
router.get('/classification/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 50 } = req.query;

    const emails = await emailService.getEmailsByClassification(type, parseInt(limit));

    res.json({
      success: true,
      classification: type,
      count: emails.length,
      emails
    });

  } catch (error) {
    logger.error('Get emails by classification error:', error);
    res.status(500).json({
      error: 'Failed to get emails by classification',
      message: error.message
    });
  }
});

// Get email statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await emailService.getEmailStats();

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Get email stats error:', error);
    res.status(500).json({
      error: 'Failed to get email statistics',
      message: error.message
    });
  }
});

// Get AI processing statistics
router.get('/stats/ai', async (req, res) => {
  try {
    const stats = await aiProcessor.getProcessingStats();

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Get AI stats error:', error);
    res.status(500).json({
      error: 'Failed to get AI processing statistics',
      message: error.message
    });
  }
});

// Connect to email service
router.post('/connect', async (req, res) => {
  try {
    const { provider = 'gmail' } = req.body;

    // Connect to IMAP and SMTP
    await emailService.connectIMAP();
    await emailService.connectSMTP();

    res.json({
      success: true,
      message: 'Email service connected successfully',
      provider
    });

  } catch (error) {
    logger.error('Email connection error:', error);
    res.status(500).json({
      error: 'Failed to connect to email service',
      message: error.message
    });
  }
});

// Start auto processing
router.post('/auto-processing/start', async (req, res) => {
  try {
    await emailService.startAutoProcessing();

    res.json({
      success: true,
      message: 'Automatic email processing started'
    });

  } catch (error) {
    logger.error('Start auto processing error:', error);
    res.status(500).json({
      error: 'Failed to start automatic processing',
      message: error.message
    });
  }
});

// Stop auto processing
router.post('/auto-processing/stop', async (req, res) => {
  try {
    emailService.stopAutoProcessing();

    res.json({
      success: true,
      message: 'Automatic email processing stopped'
    });

  } catch (error) {
    logger.error('Stop auto processing error:', error);
    res.status(500).json({
      error: 'Failed to stop automatic processing',
      message: error.message
    });
  }
});

// Get auto processing status
router.get('/auto-processing/status', async (req, res) => {
  try {
    const isRunning = emailService.processingInterval !== null;

    res.json({
      success: true,
      isRunning,
      interval: emailService.processingInterval ? emailService.emailConfig.processing.pollingInterval : null
    });

  } catch (error) {
    logger.error('Get auto processing status error:', error);
    res.status(500).json({
      error: 'Failed to get auto processing status',
      message: error.message
    });
  }
});

// Demo endpoint for testing
router.post('/demo', async (req, res) => {
  try {
    const demoEmails = [
      {
        subject: 'Urgent: Server Down',
        sender: 'John Smith',
        sender_email: 'john@company.com',
        content: 'Our production server is down and customers are complaining. This is urgent and needs immediate attention.'
      },
      {
        subject: 'Product Inquiry',
        sender: 'Sarah Johnson',
        sender_email: 'sarah@client.com',
        content: 'I\'m interested in your premium package. Can you send me pricing information and a demo?'
      },
      {
        subject: 'Meeting Request',
        sender: 'Mike Wilson',
        sender_email: 'mike@partner.com',
        content: 'Hi, I\'d like to schedule a meeting to discuss our partnership. Are you available next week?'
      },
      {
        subject: 'Invoice #12345',
        sender: 'Accounting Dept',
        sender_email: 'accounting@vendor.com',
        content: 'Please find attached invoice #12345 for services rendered. Amount due: $2,500. Due date: 30 days.'
      }
    ];

    const results = [];

    for (const demoEmail of demoEmails) {
      const emailData = {
        id: uuidv4(),
        ...demoEmail,
        html_content: demoEmail.content,
        received_date: new Date()
      };

      await emailService.saveEmail(emailData);
      const result = await emailService.processEmail(emailData);
      results.push(result);
    }

    res.json({
      success: true,
      message: 'Demo emails processed successfully',
      processed: results.length,
      results
    });

  } catch (error) {
    logger.error('Demo processing error:', error);
    res.status(500).json({
      error: 'Failed to process demo emails',
      message: error.message
    });
  }
});

module.exports = router;
