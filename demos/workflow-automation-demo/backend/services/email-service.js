const Imap = require('imap');
const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');
const { logger } = require('../utils/logger');
const { runQuery, getRow, getAll } = require('../config/database');
const { emailConfig } = require('../config/email-config');
const { AIProcessor } = require('./ai-processor');

class EmailService {
  constructor() {
    this.imap = null;
    this.transporter = null;
    this.aiProcessor = new AIProcessor();
    this.isConnected = false;
    this.processingInterval = null;

    logger.info('Email Service initialized');
  }

  // Initialize IMAP connection
  async connectIMAP() {
    return new Promise((resolve, reject) => {
      this.imap = new Imap(emailConfig.imap);

      this.imap.once('ready', () => {
        this.isConnected = true;
        logger.info('IMAP connection established');
        resolve();
      });

      this.imap.once('error', (err) => {
        this.isConnected = false;
        logger.error('IMAP connection error:', err);
        reject(err);
      });

      this.imap.once('end', () => {
        this.isConnected = false;
        logger.info('IMAP connection ended');
      });

      this.imap.connect();
    });
  }

  // Initialize SMTP transporter
  async connectSMTP() {
    try {
      this.transporter = nodemailer.createTransporter(emailConfig.smtp);

      // Verify connection
      await this.transporter.verify();
      logger.info('SMTP connection established');

    } catch (error) {
      logger.error('SMTP connection failed:', error);
      throw error;
    }
  }

  // Fetch emails from IMAP
  async fetchEmails(limit = 10) {
    if (!this.isConnected) {
      throw new Error('IMAP not connected');
    }

    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        const emails = [];
        const fetch = this.imap.seq.fetch(`1:${Math.min(limit, box.messages.total)}`, {
          bodies: '',
          struct: true
        });

        fetch.on('message', (msg, seqno) => {
          const email = {};

          msg.on('body', (stream, info) => {
            simpleParser(stream, (err, parsed) => {
              if (err) {
                logger.error('Email parsing error:', err);
                return;
              }

              email.id = require('uuid').v4();
              email.subject = parsed.subject || 'No Subject';
              email.sender = parsed.from?.text || 'Unknown Sender';
              email.sender_email = parsed.from?.value?.[0]?.address || 'unknown@example.com';
              email.content = parsed.text || parsed.html || '';
              email.html_content = parsed.html || '';
              email.received_date = parsed.date || new Date();
              email.attachments = parsed.attachments || [];

              emails.push(email);
            });
          });
        });

        fetch.once('error', (err) => {
          reject(err);
        });

        fetch.once('end', () => {
          logger.info(`Fetched ${emails.length} emails from IMAP`);
          resolve(emails);
        });
      });
    });
  }

  // Save email to database
  async saveEmail(emailData) {
    try {
      await runQuery(`
        INSERT INTO emails (
          id, subject, sender, sender_email, content, html_content,
          received_date, processing_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        emailData.id,
        emailData.subject,
        emailData.sender,
        emailData.sender_email,
        emailData.content,
        emailData.html_content,
        emailData.received_date,
        'pending'
      ]);

      logger.info(`Email saved to database: ${emailData.id}`);
      return emailData.id;

    } catch (error) {
      logger.error('Failed to save email:', error);
      throw error;
    }
  }

  // Process single email with AI
  async processEmail(emailData) {
    try {
      logger.logEmailProcessing(emailData.id, 'Starting processing');

      // Process with AI
      const aiResults = await this.aiProcessor.processEmail(emailData);

      // Save results to database
      await this.aiProcessor.saveProcessingResults(emailData.id, aiResults);

      // Update processing status
      await runQuery(`
        UPDATE emails
        SET processing_status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [emailData.id]);

      logger.logEmailProcessing(emailData.id, 'Processing completed');

      return {
        emailId: emailData.id,
        ...aiResults
      };

    } catch (error) {
      logger.logError(error, { emailId: emailData.id, operation: 'email_processing' });

      // Update status to failed
      await runQuery(`
        UPDATE emails
        SET processing_status = 'failed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [emailData.id]);

      throw error;
    }
  }

  // Process multiple emails
  async processBatch(emails) {
    const results = [];

    for (const email of emails) {
      try {
        const result = await this.processEmail(email);
        results.push(result);
      } catch (error) {
        logger.error(`Failed to process email ${email.id}:`, error);
        results.push({
          emailId: email.id,
          error: error.message
        });
      }
    }

    return results;
  }

  // Send email response
  async sendResponse(emailData, responseData) {
    try {
      if (!this.transporter) {
        throw new Error('SMTP not connected');
      }

      const mailOptions = {
        from: emailConfig.smtp.auth.user,
        to: emailData.sender_email,
        subject: responseData.subject,
        text: responseData.body,
        html: responseData.body
      };

      const info = await this.transporter.sendMail(mailOptions);

      // Update email record
      await runQuery(`
        UPDATE emails
        SET ai_response = ?, response_sent = TRUE, response_sent_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [JSON.stringify(responseData), emailData.id]);

      logger.logEmailResponse(emailData.id, 'auto_response', true);

      return {
        messageId: info.messageId,
        response: responseData
      };

    } catch (error) {
      logger.logEmailResponse(emailData.id, 'auto_response', false);
      logger.error('Failed to send response:', error);
      throw error;
    }
  }

  // Start automatic email processing
  async startAutoProcessing() {
    if (this.processingInterval) {
      logger.warn('Auto processing already running');
      return;
    }

    logger.info('Starting automatic email processing');

    this.processingInterval = setInterval(async () => {
      try {
        // Fetch new emails
        const emails = await this.fetchEmails(emailConfig.processing.batchSize);

        if (emails.length === 0) {
          return;
        }

        // Save emails to database
        for (const email of emails) {
          await this.saveEmail(email);
        }

        // Process emails with AI
        const results = await this.processBatch(emails);

        // Send auto-responses if enabled
        if (emailConfig.classification.enableAutoResponse) {
          for (const result of results) {
            if (result.error) continue;

            const email = emails.find(e => e.id === result.emailId);
            if (!email) continue;

            // Generate and send response for certain classifications
            const autoResponseTypes = ['customer_support', 'sales_inquiry', 'meeting_request'];
            if (autoResponseTypes.includes(result.classification.type)) {
              try {
                const response = await this.aiProcessor.generateResponse(email, result.classification);
                await this.sendResponse(email, response);
              } catch (error) {
                logger.error(`Failed to send auto-response for ${result.emailId}:`, error);
              }
            }
          }
        }

        logger.info(`Processed ${results.length} emails automatically`);

      } catch (error) {
        logger.error('Auto processing error:', error);
      }
    }, emailConfig.processing.pollingInterval);
  }

  // Stop automatic email processing
  stopAutoProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      logger.info('Automatic email processing stopped');
    }
  }

  // Get email statistics
  async getEmailStats() {
    try {
      const stats = await getRow(`
        SELECT
          COUNT(*) as total_emails,
          COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) as processed,
          COUNT(CASE WHEN processing_status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN processing_status = 'failed' THEN 1 END) as failed,
          COUNT(CASE WHEN response_sent = TRUE THEN 1 END) as responses_sent,
          AVG(priority) as avg_priority,
          AVG(confidence_score) as avg_confidence
        FROM emails
      `);

      const recentEmails = await getAll(`
        SELECT id, subject, sender, classification, priority, received_date, processing_status
        FROM emails
        ORDER BY received_date DESC
        LIMIT 10
      `);

      return {
        ...stats,
        recentEmails
      };

    } catch (error) {
      logger.error('Failed to get email stats:', error);
      return null;
    }
  }

  // Get emails by classification
  async getEmailsByClassification(classification, limit = 50) {
    try {
      return await getAll(`
        SELECT id, subject, sender, sender_email, content, classification,
               priority, confidence_score, sentiment_score, received_date, processing_status
        FROM emails
        WHERE classification = ?
        ORDER BY received_date DESC
        LIMIT ?
      `, [classification, limit]);

    } catch (error) {
      logger.error('Failed to get emails by classification:', error);
      return [];
    }
  }

  // Get email details with extracted data
  async getEmailDetails(emailId) {
    try {
      const email = await getRow(`
        SELECT * FROM emails WHERE id = ?
      `, [emailId]);

      if (!email) {
        return null;
      }

      const extractedData = await getAll(`
        SELECT data_type, extracted_value, confidence_score, verification_status
        FROM extracted_data
        WHERE email_id = ?
        ORDER BY confidence_score DESC
      `, [emailId]);

      return {
        ...email,
        extractedData
      };

    } catch (error) {
      logger.error('Failed to get email details:', error);
      return null;
    }
  }

  // Disconnect from email services
  async disconnect() {
    this.stopAutoProcessing();

    if (this.imap) {
      this.imap.end();
    }

    if (this.transporter) {
      this.transporter.close();
    }

    this.isConnected = false;
    logger.info('Email service disconnected');
  }
}

module.exports = { EmailService };
