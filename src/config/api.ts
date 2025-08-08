// API Configuration for different environments
const isDevelopment = import.meta.env.DEV;

// Production URLs (you'll need to replace these with your actual Railway URLs)
const PRODUCTION_URLS = {
  tier1: 'https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/tier1-chatbots',
  tier2: 'https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/tier2-chatbots',
  tier3: 'https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/tier3-chatbot',
  rag: 'https://rag-system-production.up.railway.app',
  documentAnalyzer: 'https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/legal-document-analyzer'
};

// Development URLs (using production Supabase for tier1, tier2, and tier3, localhost for others)
const DEVELOPMENT_URLS = {
  tier1: 'https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/tier1-chatbots',
  tier2: 'https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/tier2-chatbots',
  tier3: 'https://uqkzthavpupgpbusqhwy.supabase.co/functions/v1/tier3-chatbot',
  rag: 'http://localhost:3001',
  documentAnalyzer: 'http://localhost:3002/api/chat' // Fallback to local development server
};

// Export the appropriate URLs based on environment
export const API_URLS = isDevelopment ? DEVELOPMENT_URLS : PRODUCTION_URLS;

// Helper function to get API URL for a specific tier
export const getApiUrl = (tier: 'tier1' | 'tier2' | 'tier3' | 'rag' | 'documentAnalyzer') => {
  return API_URLS[tier];
};
