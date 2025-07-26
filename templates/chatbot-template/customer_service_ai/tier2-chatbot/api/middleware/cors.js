/**
 * CORS Middleware Configuration
 * Handles cross-origin requests for the Tier 2 chatbot API
 */

const cors = require('cors');

/**
 * CORS configuration options
 */
const corsOptions = {
    // Allow specific origins
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Get allowed origins from environment or use defaults
        const allowedOrigins = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://127.0.0.1:3000',
                'http://127.0.0.1:3001',
                'https://buildaiforme.com',
                'https://www.buildaiforme.com'
            ];

        // Check if origin is allowed
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log unauthorized origin attempts
            console.warn(`CORS: Unauthorized origin attempt: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },

    // Allow credentials (cookies, authorization headers)
    credentials: true,

    // Allowed HTTP methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],

    // Allowed headers
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key',
        'Cache-Control',
        'Pragma'
    ],

    // Expose headers to client
    exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
        'X-Total-Count',
        'X-Page-Count'
    ],

    // Preflight response cache time (in seconds)
    maxAge: 86400, // 24 hours

    // Handle preflight requests
    preflightContinue: false,

    // Set success status for OPTIONS requests
    optionsSuccessStatus: 200
};

/**
 * Development CORS configuration (more permissive)
 */
const devCorsOptions = {
    ...corsOptions,
    origin: true, // Allow all origins in development
    credentials: true
};

/**
 * Production CORS configuration (strict)
 */
const prodCorsOptions = {
    ...corsOptions,
    origin: function (origin, callback) {
        // In production, only allow specific domains
        const productionOrigins = process.env.PRODUCTION_ORIGINS
            ? process.env.PRODUCTION_ORIGINS.split(',')
            : [
                'https://buildaiforme.com',
                'https://www.buildaiforme.com'
            ];

        if (!origin || productionOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS: Production unauthorized origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    }
};

/**
 * Get appropriate CORS configuration based on environment
 */
function getCorsConfig() {
    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction ? prodCorsOptions : devCorsOptions;
}

/**
 * CORS middleware instance
 */
const corsMiddleware = cors(getCorsConfig());

/**
 * Custom CORS error handler
 */
function corsErrorHandler(err, req, res, next) {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'CORS Error',
            message: 'Cross-origin request not allowed',
            origin: req.headers.origin,
            allowedOrigins: process.env.NODE_ENV === 'production'
                ? process.env.PRODUCTION_ORIGINS?.split(',') || []
                : 'All origins (development mode)'
        });
    }
    next(err);
}

/**
 * Preflight handler for specific routes
 */
function preflightHandler(req, res) {
    res.status(200).json({
        message: 'Preflight request successful',
        allowedMethods: corsOptions.methods,
        allowedHeaders: corsOptions.allowedHeaders
    });
}

/**
 * Dynamic CORS for specific routes
 */
function dynamicCors(allowedOrigins) {
    return cors({
        ...corsOptions,
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    });
}

module.exports = {
    corsMiddleware,
    corsErrorHandler,
    preflightHandler,
    dynamicCors,
    getCorsConfig,
    corsOptions,
    devCorsOptions,
    prodCorsOptions
};
