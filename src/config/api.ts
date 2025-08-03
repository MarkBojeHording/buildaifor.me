// API Configuration for different environments
const isDevelopment = import.meta.env.DEV;

// Production URLs (you'll need to replace these with your actual Railway URLs)
const PRODUCTION_URLS = {
  tier1: 'https://tier1-chatbot-production.up.railway.app',
  tier2: 'https://tier2-chatbot-production.up.railway.app',
  tier3: 'https://tier3-chatbot-production.up.railway.app',
  rag: 'https://rag-system-production.up.railway.app'
};

// Development URLs (localhost)
const DEVELOPMENT_URLS = {
  tier1: 'http://localhost:8001',
  tier2: 'http://localhost:3001',
  tier3: 'http://localhost:8003',
  rag: 'http://localhost:3001'
};

// Export the appropriate URLs based on environment
export const API_URLS = isDevelopment ? DEVELOPMENT_URLS : PRODUCTION_URLS;

// Helper function to get API URL for a specific tier
export const getApiUrl = (tier: 'tier1' | 'tier2' | 'tier3' | 'rag') => {
  return API_URLS[tier];
};
