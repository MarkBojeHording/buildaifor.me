// CORS Headers - Legal Document Analyzer Client Package
// Cross-origin resource sharing configuration for legal professionals
// Target: Law firms, corporate legal departments, legal professionals

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

// Legal-specific CORS configuration for professional environments
export const legalCorsHeaders = {
  ...corsHeaders,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
};

// Development CORS configuration
export const developmentCorsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000, http://localhost:5173, http://localhost:5174, http://localhost:5175',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

// Production CORS configuration with restricted origins
export const productionCorsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-legal-domain.com, https://app.your-legal-domain.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Get appropriate CORS headers based on environment
export function getCorsHeaders(environment: 'development' | 'production' = 'development') {
  switch (environment) {
    case 'production':
      return productionCorsHeaders;
    case 'development':
    default:
      return developmentCorsHeaders;
  }
}

// Validate origin for legal professional environments
export function validateOrigin(origin: string | null): boolean {
  if (!origin) return true; // Allow requests without origin (same-origin)

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://your-legal-domain.com',
    'https://app.your-legal-domain.com'
  ];

  return allowedOrigins.includes(origin);
}

// Get CORS headers with origin validation
export function getValidatedCorsHeaders(origin: string | null): Record<string, string> {
  if (validateOrigin(origin)) {
    return {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin || '*'
    };
  }

  return corsHeaders;
}
