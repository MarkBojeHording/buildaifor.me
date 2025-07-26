const express = require('express');
const { logger } = require('../utils/logger');
const { runQuery, getRow, getAll } = require('../config/database');
const { AIProcessor } = require('../services/ai-processor');
const { EmailService } = require('../services/email-service');

const router = express.Router();
const aiProcessor = new AIProcessor();
const emailService = new EmailService();

// Middleware to log API requests
router.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.logApiRequest(req.method, req.path, res.statusCode, duration);
  });
  next();
});

// Get dashboard overview
router.get('/overview', async (req, res) => {
  try {
    const [emailStats, aiStats, recentActivity] = await Promise.all([
      emailService.getEmailStats(),
      aiProcessor.getProcessingStats(),
      getRecentActivity()
    ]);

    res.json({
      success: true,
      data: {
        emailStats,
        aiStats,
        recentActivity
      }
    });

  } catch (error) {
    logger.error('Dashboard overview error:', error);
    res.status(500).json({
      error: 'Failed to get dashboard overview',
      message: error.message
    });
  }
});

// Get processing performance metrics
router.get('/performance', async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const performanceData = await getPerformanceMetrics(parseInt(days));

    res.json({
      success: true,
      data: performanceData
    });

  } catch (error) {
    logger.error('Performance metrics error:', error);
    res.status(500).json({
      error: 'Failed to get performance metrics',
      message: error.message
    });
  }
});

// Get classification analytics
router.get('/analytics/classification', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    const classificationData = await getClassificationAnalytics(period);

    res.json({
      success: true,
      data: classificationData
    });

  } catch (error) {
    logger.error('Classification analytics error:', error);
    res.status(500).json({
      error: 'Failed to get classification analytics',
      message: error.message
    });
  }
});

// Get sentiment analysis trends
router.get('/analytics/sentiment', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    const sentimentData = await getSentimentAnalytics(period);

    res.json({
      success: true,
      data: sentimentData
    });

  } catch (error) {
    logger.error('Sentiment analytics error:', error);
    res.status(500).json({
      error: 'Failed to get sentiment analytics',
      message: error.message
    });
  }
});

// Get priority distribution
router.get('/analytics/priority', async (req, res) => {
  try {
    const priorityData = await getPriorityDistribution();

    res.json({
      success: true,
      data: priorityData
    });

  } catch (error) {
    logger.error('Priority analytics error:', error);
    res.status(500).json({
      error: 'Failed to get priority analytics',
      message: error.message
    });
  }
});

// Get response generation statistics
router.get('/analytics/responses', async (req, res) => {
  try {
    const responseData = await getResponseAnalytics();

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    logger.error('Response analytics error:', error);
    res.status(500).json({
      error: 'Failed to get response analytics',
      message: error.message
    });
  }
});

// Get time savings calculations
router.get('/analytics/time-savings', async (req, res) => {
  try {
    const timeSavings = await calculateTimeSavings();

    res.json({
      success: true,
      data: timeSavings
    });

  } catch (error) {
    logger.error('Time savings calculation error:', error);
    res.status(500).json({
      error: 'Failed to calculate time savings',
      message: error.message
    });
  }
});

// Get error logs and success rates
router.get('/analytics/errors', async (req, res) => {
  try {
    const errorData = await getErrorAnalytics();

    res.json({
      success: true,
      data: errorData
    });

  } catch (error) {
    logger.error('Error analytics error:', error);
    res.status(500).json({
      error: 'Failed to get error analytics',
      message: error.message
    });
  }
});

// Get processing speed metrics
router.get('/analytics/speed', async (req, res) => {
  try {
    const speedData = await getProcessingSpeedMetrics();

    res.json({
      success: true,
      data: speedData
    });

  } catch (error) {
    logger.error('Speed analytics error:', error);
    res.status(500).json({
      error: 'Failed to get processing speed metrics',
      message: error.message
    });
  }
});

// Get entity extraction statistics
router.get('/analytics/entities', async (req, res) => {
  try {
    const entityData = await getEntityExtractionStats();

    res.json({
      success: true,
      data: entityData
    });

  } catch (error) {
    logger.error('Entity analytics error:', error);
    res.status(500).json({
      error: 'Failed to get entity extraction statistics',
      message: error.message
    });
  }
});

// Get workflow automation metrics
router.get('/analytics/workflows', async (req, res) => {
  try {
    const workflowData = await getWorkflowMetrics();

    res.json({
      success: true,
      data: workflowData
    });

  } catch (error) {
    logger.error('Workflow analytics error:', error);
    res.status(500).json({
      error: 'Failed to get workflow metrics',
      message: error.message
    });
  }
});

// Helper functions for analytics

async function getRecentActivity() {
  try {
    const recentEmails = await getAll(`
      SELECT id, subject, sender, classification, priority, received_date, processing_status
      FROM emails
      ORDER BY received_date DESC
      LIMIT 10
    `);

    const recentLogs = await getAll(`
      SELECT action, details, success, created_at
      FROM processing_logs
      ORDER BY created_at DESC
      LIMIT 20
    `);

    return {
      recentEmails,
      recentLogs
    };
  } catch (error) {
    logger.error('Get recent activity error:', error);
    return { recentEmails: [], recentLogs: [] };
  }
}

async function getPerformanceMetrics(days) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await getRow(`
      SELECT
        COUNT(*) as total_emails,
        AVG(CAST((julianday('now') - julianday(received_date)) * 24 * 60 AS INTEGER)) as avg_processing_time_minutes,
        COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) as successful_processing,
        COUNT(CASE WHEN processing_status = 'failed' THEN 1 END) as failed_processing,
        AVG(confidence_score) as avg_confidence,
        AVG(priority) as avg_priority
      FROM emails
      WHERE received_date >= ?
    `, [startDate.toISOString()]);

    return {
      period: `${days} days`,
      metrics
    };
  } catch (error) {
    logger.error('Get performance metrics error:', error);
    return { period: `${days} days`, metrics: {} };
  }
}

async function getClassificationAnalytics(period) {
  try {
    let dateFilter = '';
    if (period === '7d') {
      dateFilter = "WHERE received_date >= datetime('now', '-7 days')";
    } else if (period === '30d') {
      dateFilter = "WHERE received_date >= datetime('now', '-30 days')";
    }

    const breakdown = await getAll(`
      SELECT
        classification,
        COUNT(*) as count,
        AVG(confidence_score) as avg_confidence,
        AVG(priority) as avg_priority
      FROM emails
      ${dateFilter}
      GROUP BY classification
      ORDER BY count DESC
    `);

    const total = breakdown.reduce((sum, item) => sum + item.count, 0);
    const percentages = breakdown.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : 0
    }));

    return {
      period,
      total,
      breakdown: percentages
    };
  } catch (error) {
    logger.error('Get classification analytics error:', error);
    return { period, total: 0, breakdown: [] };
  }
}

async function getSentimentAnalytics(period) {
  try {
    let dateFilter = '';
    if (period === '7d') {
      dateFilter = "WHERE received_date >= datetime('now', '-7 days')";
    } else if (period === '30d') {
      dateFilter = "WHERE received_date >= datetime('now', '-30 days')";
    }

    const sentimentData = await getAll(`
      SELECT
        CASE
          WHEN sentiment_score < -0.5 THEN 'very_negative'
          WHEN sentiment_score < 0 THEN 'negative'
          WHEN sentiment_score = 0 THEN 'neutral'
          WHEN sentiment_score < 0.5 THEN 'positive'
          ELSE 'very_positive'
        END as sentiment_level,
        COUNT(*) as count,
        AVG(sentiment_score) as avg_score
      FROM emails
      ${dateFilter}
      GROUP BY sentiment_level
      ORDER BY avg_score
    `);

    return {
      period,
      sentimentData
    };
  } catch (error) {
    logger.error('Get sentiment analytics error:', error);
    return { period, sentimentData: [] };
  }
}

async function getPriorityDistribution() {
  try {
    const priorityData = await getAll(`
      SELECT
        CASE
          WHEN priority >= 8 THEN 'high'
          WHEN priority >= 5 THEN 'medium'
          ELSE 'low'
        END as priority_level,
        COUNT(*) as count,
        AVG(priority) as avg_priority
      FROM emails
      GROUP BY priority_level
      ORDER BY avg_priority DESC
    `);

    return { priorityData };
  } catch (error) {
    logger.error('Get priority distribution error:', error);
    return { priorityData: [] };
  }
}

async function getResponseAnalytics() {
  try {
    const responseStats = await getRow(`
      SELECT
        COUNT(*) as total_emails,
        COUNT(CASE WHEN response_sent = TRUE THEN 1 END) as responses_sent,
        COUNT(CASE WHEN ai_response IS NOT NULL THEN 1 END) as responses_generated,
        AVG(CASE WHEN response_sent = TRUE THEN 1 ELSE 0 END) * 100 as response_rate
      FROM emails
    `);

    const responseTypes = await getAll(`
      SELECT
        classification,
        COUNT(CASE WHEN response_sent = TRUE THEN 1 END) as responses_sent,
        COUNT(*) as total_emails
      FROM emails
      WHERE classification IS NOT NULL
      GROUP BY classification
      ORDER BY responses_sent DESC
    `);

    return {
      responseStats,
      responseTypes
    };
  } catch (error) {
    logger.error('Get response analytics error:', error);
    return { responseStats: {}, responseTypes: [] };
  }
}

async function calculateTimeSavings() {
  try {
    // Estimate time savings based on automated processing
    const stats = await getRow(`
      SELECT
        COUNT(*) as total_emails,
        COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) as processed_emails,
        COUNT(CASE WHEN response_sent = TRUE THEN 1 END) as auto_responses
      FROM emails
    `);

    // Estimated time per email (in minutes)
    const timePerEmail = 5; // 5 minutes per email
    const timePerResponse = 3; // 3 minutes per response

    const totalTimeSaved = (stats.processed_emails * timePerEmail) + (stats.auto_responses * timePerResponse);
    const hoursSaved = totalTimeSaved / 60;
    const daysSaved = hoursSaved / 8; // Assuming 8-hour workday

    return {
      totalEmails: stats.total_emails,
      processedEmails: stats.processed_emails,
      autoResponses: stats.auto_responses,
      timeSavedMinutes: totalTimeSaved,
      timeSavedHours: hoursSaved.toFixed(1),
      timeSavedDays: daysSaved.toFixed(1),
      efficiencyGain: stats.total_emails > 0 ? ((totalTimeSaved / (stats.total_emails * timePerEmail)) * 100).toFixed(1) : 0
    };
  } catch (error) {
    logger.error('Calculate time savings error:', error);
    return {};
  }
}

async function getErrorAnalytics() {
  try {
    const errorStats = await getAll(`
      SELECT
        action,
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN success = TRUE THEN 1 END) as successful,
        COUNT(CASE WHEN success = FALSE THEN 1 END) as failed,
        AVG(CASE WHEN success = TRUE THEN 1 ELSE 0 END) * 100 as success_rate
      FROM processing_logs
      GROUP BY action
      ORDER BY failed DESC
    `);

    const recentErrors = await getAll(`
      SELECT action, error_message, created_at
      FROM processing_logs
      WHERE success = FALSE
      ORDER BY created_at DESC
      LIMIT 10
    `);

    return {
      errorStats,
      recentErrors
    };
  } catch (error) {
    logger.error('Get error analytics error:', error);
    return { errorStats: [], recentErrors: [] };
  }
}

async function getProcessingSpeedMetrics() {
  try {
    const speedData = await getAll(`
      SELECT
        action,
        AVG(processing_time_ms) as avg_processing_time,
        MIN(processing_time_ms) as min_processing_time,
        MAX(processing_time_ms) as max_processing_time,
        COUNT(*) as total_operations
      FROM processing_logs
      WHERE processing_time_ms IS NOT NULL
      GROUP BY action
      ORDER BY avg_processing_time DESC
    `);

    return { speedData };
  } catch (error) {
    logger.error('Get processing speed metrics error:', error);
    return { speedData: [] };
  }
}

async function getEntityExtractionStats() {
  try {
    const entityStats = await getAll(`
      SELECT
        data_type,
        COUNT(*) as total_extracted,
        AVG(confidence_score) as avg_confidence,
        COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified,
        COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending
      FROM extracted_data
      GROUP BY data_type
      ORDER BY total_extracted DESC
    `);

    return { entityStats };
  } catch (error) {
    logger.error('Get entity extraction stats error:', error);
    return { entityStats: [] };
  }
}

async function getWorkflowMetrics() {
  try {
    const workflowStats = await getAll(`
      SELECT
        name,
        is_active,
        created_at,
        updated_at
      FROM workflows
      ORDER BY created_at DESC
    `);

    return { workflowStats };
  } catch (error) {
    logger.error('Get workflow metrics error:', error);
    return { workflowStats: [] };
  }
}

module.exports = router;
