const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level (can be set via environment variable)
const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] || LOG_LEVELS.INFO;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Format timestamp
function formatTimestamp() {
  return new Date().toISOString();
}

// Format log message
function formatMessage(level, message, data = null) {
  const timestamp = formatTimestamp();
  const levelUpper = level.toUpperCase();

  let formattedMessage = `[${timestamp}] [${levelUpper}] ${message}`;

  if (data) {
    if (typeof data === 'object') {
      formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
    } else {
      formattedMessage += ` ${data}`;
    }
  }

  return formattedMessage;
}

// Write to log file
function writeToFile(level, message, data = null) {
  const timestamp = new Date();
  const dateStr = timestamp.toISOString().split('T')[0];
  const logFile = path.join(logsDir, `email-workflow-${dateStr}.log`);

  const logEntry = formatMessage(level, message, data) + '\n';

  fs.appendFileSync(logFile, logEntry, 'utf8');
}

// Console output with colors
function consoleOutput(level, message, data = null) {
  const formattedMessage = formatMessage(level, message, data);

  let color = colors.white;
  switch (level.toLowerCase()) {
    case 'error':
      color = colors.red;
      break;
    case 'warn':
      color = colors.yellow;
      break;
    case 'info':
      color = colors.green;
      break;
    case 'debug':
      color = colors.cyan;
      break;
  }

  console.log(`${color}${formattedMessage}${colors.reset}`);
}

// Main logging functions
function log(level, message, data = null) {
  const levelNum = LOG_LEVELS[level.toUpperCase()];

  if (levelNum <= currentLogLevel) {
    consoleOutput(level, message, data);
    writeToFile(level, message, data);
  }
}

// Specific log level functions
function error(message, data = null) {
  log('error', message, data);
}

function warn(message, data = null) {
  log('warn', message, data);
}

function info(message, data = null) {
  log('info', message, data);
}

function debug(message, data = null) {
  log('debug', message, data);
}

// Specialized logging functions for email workflow
function logEmailProcessing(emailId, action, details = null) {
  info(`Email Processing [${emailId}]: ${action}`, details);
}

function logEmailClassification(emailId, classification, confidence) {
  info(`Email Classification [${emailId}]: ${classification} (${(confidence * 100).toFixed(1)}%)`);
}

function logEmailResponse(emailId, responseType, success) {
  const status = success ? 'SUCCESS' : 'FAILED';
  info(`Email Response [${emailId}]: ${responseType} - ${status}`);
}

function logDataExtraction(emailId, dataType, extractedValue, confidence) {
  debug(`Data Extraction [${emailId}]: ${dataType} = "${extractedValue}" (${(confidence * 100).toFixed(1)}%)`);
}

function logWorkflowTrigger(workflowId, emailId, triggerType) {
  info(`Workflow Trigger [${workflowId}]: ${triggerType} for email ${emailId}`);
}

function logPerformance(operation, duration, details = null) {
  info(`Performance [${operation}]: ${duration}ms`, details);
}

function logError(error, context = null) {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    context: context
  };

  error(`Application Error: ${error.message}`, errorDetails);
}

// Analytics logging
function logAnalytics(metricName, metricValue, additionalData = null) {
  const analyticsData = {
    metric: metricName,
    value: metricValue,
    timestamp: new Date().toISOString(),
    ...additionalData
  };

  info(`Analytics: ${metricName} = ${metricValue}`, analyticsData);
}

// Security logging
function logSecurity(event, details = null) {
  warn(`Security Event: ${event}`, details);
}

// API request logging
function logApiRequest(method, endpoint, statusCode, duration, userId = null) {
  const logData = {
    method,
    endpoint,
    statusCode,
    duration: `${duration}ms`,
    userId
  };

  info(`API Request: ${method} ${endpoint} - ${statusCode} (${duration}ms)`, logData);
}

// Database logging
function logDatabase(operation, table, duration, success, error = null) {
  const logData = {
    operation,
    table,
    duration: `${duration}ms`,
    success,
    error: error?.message
  };

  if (success) {
    debug(`Database [${table}]: ${operation} (${duration}ms)`);
  } else {
    error(`Database Error [${table}]: ${operation} failed`, logData);
  }
}

// Export logger object
const logger = {
  error,
  warn,
  info,
  debug,
  logEmailProcessing,
  logEmailClassification,
  logEmailResponse,
  logDataExtraction,
  logWorkflowTrigger,
  logPerformance,
  logError,
  logAnalytics,
  logSecurity,
  logApiRequest,
  logDatabase,

  // Utility functions
  setLogLevel(level) {
    if (LOG_LEVELS[level.toUpperCase()] !== undefined) {
      process.env.LOG_LEVEL = level.toUpperCase();
      info(`Log level set to: ${level.toUpperCase()}`);
    } else {
      warn(`Invalid log level: ${level}. Valid levels: ${Object.keys(LOG_LEVELS).join(', ')}`);
    }
  },

  getLogFiles() {
    try {
      return fs.readdirSync(logsDir)
        .filter(file => file.startsWith('email-workflow-') && file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(logsDir, file),
          size: fs.statSync(path.join(logsDir, file)).size
        }));
    } catch (err) {
      error('Failed to get log files', err);
      return [];
    }
  },

  clearOldLogs(daysToKeep = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const logFiles = this.getLogFiles();
      let deletedCount = 0;

      logFiles.forEach(logFile => {
        const fileDate = new Date(logFile.name.replace('email-workflow-', '').replace('.log', ''));
        if (fileDate < cutoffDate) {
          fs.unlinkSync(logFile.path);
          deletedCount++;
        }
      });

      info(`Cleared ${deletedCount} old log files (older than ${daysToKeep} days)`);
    } catch (err) {
      error('Failed to clear old logs', err);
    }
  }
};

module.exports = { logger };
