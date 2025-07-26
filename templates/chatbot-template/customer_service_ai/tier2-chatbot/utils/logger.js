/**
 * Logger Utility
 * Provides consistent logging across the Tier 2 chatbot system
 */

const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logLevels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };

        this.logLevelNames = {
            0: 'ERROR',
            1: 'WARN',
            2: 'INFO',
            3: 'DEBUG'
        };

        // Get log level from environment or default to INFO
        this.currentLevel = this.logLevels[process.env.LOG_LEVEL?.toUpperCase()] ?? this.logLevels.INFO;

        // Ensure logs directory exists
        this.logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }

        // Log file paths
        this.logFiles = {
            error: path.join(this.logsDir, 'error.log'),
            combined: path.join(this.logsDir, 'combined.log'),
            access: path.join(this.logsDir, 'access.log')
        };

        // Initialize log files if they don't exist
        Object.values(this.logFiles).forEach(logFile => {
            if (!fs.existsSync(logFile)) {
                fs.writeFileSync(logFile, '');
            }
        });
    }

    /**
     * Format log message
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} meta - Additional metadata
     * @returns {string} - Formatted log message
     */
    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const levelName = this.logLevelNames[level];

        let formattedMessage = `[${timestamp}] ${levelName}: ${message}`;

        if (Object.keys(meta).length > 0) {
            formattedMessage += ` | ${JSON.stringify(meta)}`;
        }

        return formattedMessage;
    }

    /**
     * Write log to file
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} meta - Additional metadata
     */
    writeToFile(level, message, meta = {}) {
        try {
            const formattedMessage = this.formatMessage(level, message, meta);

            // Write to combined log
            fs.appendFileSync(this.logFiles.combined, formattedMessage + '\n');

            // Write errors to error log
            if (level === this.logLevels.ERROR) {
                fs.appendFileSync(this.logFiles.error, formattedMessage + '\n');
            }

        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    /**
     * Log error message
     * @param {string} message - Error message
     * @param {Object} meta - Additional metadata
     */
    error(message, meta = {}) {
        if (this.currentLevel >= this.logLevels.ERROR) {
            const formattedMessage = this.formatMessage(this.logLevels.ERROR, message, meta);
            console.error(formattedMessage);
            this.writeToFile(this.logLevels.ERROR, message, meta);
        }
    }

    /**
     * Log warning message
     * @param {string} message - Warning message
     * @param {Object} meta - Additional metadata
     */
    warn(message, meta = {}) {
        if (this.currentLevel >= this.logLevels.WARN) {
            const formattedMessage = this.formatMessage(this.logLevels.WARN, message, meta);
            console.warn(formattedMessage);
            this.writeToFile(this.logLevels.WARN, message, meta);
        }
    }

    /**
     * Log info message
     * @param {string} message - Info message
     * @param {Object} meta - Additional metadata
     */
    info(message, meta = {}) {
        if (this.currentLevel >= this.logLevels.INFO) {
            const formattedMessage = this.formatMessage(this.logLevels.INFO, message, meta);
            console.info(formattedMessage);
            this.writeToFile(this.logLevels.INFO, message, meta);
        }
    }

    /**
     * Log debug message
     * @param {string} message - Debug message
     * @param {Object} meta - Additional metadata
     */
    debug(message, meta = {}) {
        if (this.currentLevel >= this.logLevels.DEBUG) {
            const formattedMessage = this.formatMessage(this.logLevels.DEBUG, message, meta);
            console.debug(formattedMessage);
            this.writeToFile(this.logLevels.DEBUG, message, meta);
        }
    }

    /**
     * Log HTTP request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {number} responseTime - Response time in milliseconds
     */
    logRequest(req, res, responseTime) {
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            responseTime: `${responseTime}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        };

        const message = `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;

        if (res.statusCode >= 400) {
            this.warn(message, logData);
        } else {
            this.info(message, logData);
        }

        // Write to access log
        try {
            const accessLogEntry = `${logData.timestamp} ${req.method} ${req.url} ${res.statusCode} ${responseTime}ms ${req.ip}\n`;
            fs.appendFileSync(this.logFiles.access, accessLogEntry);
        } catch (error) {
            console.error('Failed to write to access log:', error);
        }
    }

    /**
     * Log chatbot interaction
     * @param {string} clientId - Client identifier
     * @param {string} conversationId - Conversation identifier
     * @param {string} message - User message
     * @param {string} response - Bot response
     * @param {Object} metadata - Additional metadata
     */
    logChatbotInteraction(clientId, conversationId, message, response, metadata = {}) {
        const logData = {
            clientId,
            conversationId,
            messageLength: message.length,
            responseLength: response.length,
            timestamp: new Date().toISOString(),
            ...metadata
        };

        this.info('Chatbot interaction', logData);
    }

    /**
     * Log lead capture
     * @param {string} clientId - Client identifier
     * @param {string} leadId - Lead identifier
     * @param {Object} leadData - Lead data
     * @param {number} score - Lead score
     */
    logLeadCapture(clientId, leadId, leadData, score) {
        const logData = {
            clientId,
            leadId,
            score,
            hasEmail: !!leadData.email,
            hasPhone: !!leadData.phone,
            timestamp: new Date().toISOString()
        };

        this.info('Lead captured', logData);
    }

    /**
     * Log error with stack trace
     * @param {Error} error - Error object
     * @param {Object} meta - Additional metadata
     */
    logError(error, meta = {}) {
        const errorData = {
            message: error.message,
            stack: error.stack,
            name: error.name,
            ...meta
        };

        this.error('Application error', errorData);
    }

    /**
     * Get log statistics
     * @returns {Object} - Log statistics
     */
    getLogStats() {
        try {
            const stats = {
                errorCount: 0,
                warnCount: 0,
                infoCount: 0,
                debugCount: 0,
                totalLines: 0
            };

            if (fs.existsSync(this.logFiles.combined)) {
                const logContent = fs.readFileSync(this.logFiles.combined, 'utf8');
                const lines = logContent.split('\n').filter(line => line.trim());

                stats.totalLines = lines.length;

                lines.forEach(line => {
                    if (line.includes('ERROR:')) stats.errorCount++;
                    else if (line.includes('WARN:')) stats.warnCount++;
                    else if (line.includes('INFO:')) stats.infoCount++;
                    else if (line.includes('DEBUG:')) stats.debugCount++;
                });
            }

            return stats;

        } catch (error) {
            console.error('Failed to get log stats:', error);
            return {
                errorCount: 0,
                warnCount: 0,
                infoCount: 0,
                debugCount: 0,
                totalLines: 0
            };
        }
    }

    /**
     * Rotate log files
     * @param {number} maxSize - Maximum file size in bytes
     */
    rotateLogs(maxSize = 10 * 1024 * 1024) { // 10MB default
        try {
            Object.entries(this.logFiles).forEach(([type, logFile]) => {
                if (fs.existsSync(logFile)) {
                    const stats = fs.statSync(logFile);

                    if (stats.size > maxSize) {
                        const backupFile = `${logFile}.${new Date().toISOString().split('T')[0]}`;
                        fs.renameSync(logFile, backupFile);
                        fs.writeFileSync(logFile, '');

                        this.info(`Log file rotated: ${type}`, {
                            originalFile: logFile,
                            backupFile,
                            size: stats.size
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Failed to rotate logs:', error);
        }
    }

    /**
     * Set log level
     * @param {string} level - Log level (ERROR, WARN, INFO, DEBUG)
     */
    setLogLevel(level) {
        const newLevel = this.logLevels[level.toUpperCase()];
        if (newLevel !== undefined) {
            this.currentLevel = newLevel;
            this.info(`Log level changed to: ${level.toUpperCase()}`);
        } else {
            this.warn(`Invalid log level: ${level}`);
        }
    }

    /**
     * Get current log level
     * @returns {string} - Current log level name
     */
    getLogLevel() {
        return this.logLevelNames[this.currentLevel];
    }
}

// Create singleton instance
const logger = new Logger();

// Export logger instance
module.exports = logger;
