/**
 * Authentication Middleware
 * Protects API routes that require authentication
 */

const logger = require('../../utils/logger');

/**
 * Simple API key authentication middleware
 * In production, this should be replaced with proper JWT or session-based auth
 */
function authMiddleware(req, res, next) {
    try {
        // Get API key from headers or query params
        const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '') || req.query.api_key;

        if (!apiKey) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'API key is required'
            });
        }

        // Validate API key (in production, check against database)
        const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : ['demo-key-123'];

        if (!validApiKeys.includes(apiKey)) {
            logger.warn('Invalid API key attempt', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path
            });

            return res.status(403).json({
                error: 'Invalid API key',
                message: 'The provided API key is not valid'
            });
        }

        // Add user info to request (in production, decode JWT or get user from database)
        req.user = {
            id: 'demo-user',
            apiKey: apiKey,
            permissions: ['read', 'write']
        };

        logger.info('API request authenticated', {
            userId: req.user.id,
            path: req.path,
            method: req.method
        });

        next();

    } catch (error) {
        logger.error('Authentication error:', error);

        res.status(500).json({
            error: 'Authentication failed',
            message: 'An error occurred during authentication'
        });
    }
}

/**
 * Role-based access control middleware
 * @param {Array} requiredRoles - Array of required roles
 */
function requireRole(requiredRoles) {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Authentication required',
                    message: 'User must be authenticated'
                });
            }

            // Check if user has required role (in production, check against user roles)
            const userRoles = req.user.roles || ['user'];
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

            if (!hasRequiredRole) {
                logger.warn('Insufficient permissions', {
                    userId: req.user.id,
                    requiredRoles,
                    userRoles,
                    path: req.path
                });

                return res.status(403).json({
                    error: 'Insufficient permissions',
                    message: 'You do not have permission to access this resource'
                });
            }

            next();

        } catch (error) {
            logger.error('Role check error:', error);

            res.status(500).json({
                error: 'Authorization failed',
                message: 'An error occurred during authorization'
            });
        }
    };
}

/**
 * Rate limiting middleware for authenticated users
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
function rateLimitAuth(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    const requests = new Map();

    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Authentication required',
                    message: 'User must be authenticated'
                });
            }

            const userId = req.user.id;
            const now = Date.now();
            const windowStart = now - windowMs;

            // Get user's request history
            let userRequests = requests.get(userId) || [];

            // Remove old requests outside the window
            userRequests = userRequests.filter(timestamp => timestamp > windowStart);

            // Check if user has exceeded limit
            if (userRequests.length >= maxRequests) {
                logger.warn('Rate limit exceeded', {
                    userId,
                    requests: userRequests.length,
                    limit: maxRequests,
                    windowMs
                });

                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: `Too many requests. Limit: ${maxRequests} requests per ${windowMs / 1000 / 60} minutes`,
                    retryAfter: Math.ceil(windowMs / 1000)
                });
            }

            // Add current request
            userRequests.push(now);
            requests.set(userId, userRequests);

            // Add rate limit headers
            res.set({
                'X-RateLimit-Limit': maxRequests,
                'X-RateLimit-Remaining': maxRequests - userRequests.length,
                'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
            });

            next();

        } catch (error) {
            logger.error('Rate limit error:', error);
            next();
        }
    };
}

/**
 * Optional authentication middleware
 * Adds user info if API key is provided, but doesn't require it
 */
function optionalAuth(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '') || req.query.api_key;

        if (apiKey) {
            const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : ['demo-key-123'];

            if (validApiKeys.includes(apiKey)) {
                req.user = {
                    id: 'demo-user',
                    apiKey: apiKey,
                    permissions: ['read', 'write']
                };
            }
        }

        next();

    } catch (error) {
        logger.error('Optional auth error:', error);
        next();
    }
}

/**
 * Client-specific authentication middleware
 * Validates that the request is for a valid client
 */
function clientAuth(req, res, next) {
    try {
        const clientId = req.params.clientId || req.body.clientId || req.query.clientId;

        if (!clientId) {
            return res.status(400).json({
                error: 'Client ID required',
                message: 'Client ID must be provided'
            });
        }

        // In production, validate client ID against database
        const validClientIds = ['law-firm-demo', 'real-estate-demo', 'ecommerce-demo'];

        if (!validClientIds.includes(clientId)) {
            return res.status(404).json({
                error: 'Client not found',
                message: 'The specified client does not exist'
            });
        }

        req.clientId = clientId;
        next();

    } catch (error) {
        logger.error('Client auth error:', error);

        res.status(500).json({
            error: 'Client validation failed',
            message: 'An error occurred during client validation'
        });
    }
}

module.exports = {
    authMiddleware,
    requireRole,
    rateLimitAuth,
    optionalAuth,
    clientAuth
};
