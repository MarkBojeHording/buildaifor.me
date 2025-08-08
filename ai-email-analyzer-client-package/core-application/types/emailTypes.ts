// Email Data Types
export interface EmailData {
  id: string | number;
  subject: string;
  sender: string;
  content: string;
  timestamp: string;
  preview: string;
}

// Email Analysis Request
export interface EmailAnalysisRequest {
  subject: string;
  body: string;
  senderEmail: string;
  receivedAt?: string;
}

// Email Analysis Response
export interface EmailAnalysisResponse {
  success: boolean;
  analysis?: EmailAnalysisResult;
  processing_time_ms?: number;
  error?: string;
  message?: string;
}

// Email Analysis Result
export interface EmailAnalysisResult {
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  importance: 'High' | 'Medium' | 'Low';
  category: string;
  subcategory: string;
  sentiment: 'Angry' | 'Frustrated' | 'Neutral' | 'Happy' | 'Satisfied';
  churnRisk: 'High' | 'Medium' | 'Low';
  customerName: string;
  company: string;
  accountNumber: string;
  responseTime: string;
  routeTo: string;
  reasoning: string;
  confidence: number;
}

// Raw AI Analysis Result (from Supabase)
export interface RawAnalysisResult {
  priority_level: 'high' | 'medium' | 'low';
  sentiment_score: number;
  sentiment_label: 'positive' | 'negative' | 'neutral';
  urgency_score: number;
  primary_category: string;
  secondary_categories: string[];
  recommended_department: string;
  summary: string;
  key_issues: string[];
  suggested_response: string;
  escalation_required: boolean;
  estimated_resolution_time: number;
  confidence: number;
}

// Analytics Data
export interface AnalyticsData {
  summary: {
    totalEmails: number;
    avgSentiment: number;
    highPriorityCount: number;
    avgProcessingTime: number;
  };
  dailyMetrics: Array<{
    date: string;
    count: number;
    avgSentiment: number;
    highPriorityCount: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  sentimentTrend: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
  priorityDistribution: Array<{
    priority: string;
    count: number;
    percentage: number;
  }>;
}

// Analytics Response
export interface AnalyticsResponse {
  success: boolean;
  analytics?: AnalyticsData;
  period?: string;
  error?: string;
}

// Sample Email Categories
export interface SampleEmails {
  urgent: EmailData[];
  billing: EmailData[];
  technical: EmailData[];
  complaints: EmailData[];
  general: EmailData[];
}

// API Configuration
export interface APIConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  openaiApiKey?: string;
}

// Custom Branding
export interface CustomBranding {
  companyName?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

// Department Configuration
export interface DepartmentConfig {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  escalationRules: string[];
  responseTemplates: string[];
}

// Priority Configuration
export interface PriorityConfig {
  level: 'critical' | 'high' | 'medium' | 'low';
  color: string;
  icon: string;
  responseTime: number; // in minutes
  escalationRequired: boolean;
  keywords: string[];
}

// Sentiment Configuration
export interface SentimentConfig {
  label: 'positive' | 'negative' | 'neutral';
  score: number;
  color: string;
  churnRisk: 'high' | 'medium' | 'low';
  keywords: string[];
}

// Category Configuration
export interface CategoryConfig {
  name: string;
  description: string;
  keywords: string[];
  department: string;
  priority: 'high' | 'medium' | 'low';
  responseTemplate: string;
}

// System Configuration
export interface SystemConfig {
  api: APIConfig;
  branding: CustomBranding;
  departments: DepartmentConfig[];
  priorities: PriorityConfig[];
  sentiments: SentimentConfig[];
  categories: CategoryConfig[];
  features: {
    analytics: boolean;
    customRules: boolean;
    integrations: boolean;
    whiteLabel: boolean;
  };
}

// Error Types
export interface APIError {
  code: number;
  message: string;
  details?: any;
}

// Loading States
export interface LoadingState {
  analyzing: boolean;
  loadingAnalytics: boolean;
  saving: boolean;
  error: string | null;
}

// Filter Options
export interface FilterOptions {
  category?: string;
  priority?: string;
  sentiment?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Export Options
export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeAnalytics: boolean;
  includeRawData: boolean;
}

// Integration Types
export interface IntegrationConfig {
  type: 'crm' | 'helpdesk' | 'email' | 'slack' | 'webhook';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
}

// Webhook Payload
export interface WebhookPayload {
  event: 'email_analyzed' | 'high_priority_detected' | 'churn_risk_alert';
  timestamp: string;
  data: EmailAnalysisResult;
  metadata: {
    processingTime: number;
    confidence: number;
    source: string;
  };
}

// Performance Metrics
export interface PerformanceMetrics {
  averageProcessingTime: number;
  accuracy: number;
  uptime: number;
  totalEmailsProcessed: number;
  errorRate: number;
  lastUpdated: string;
}

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    slack: boolean;
    highPriority: boolean;
    churnRisk: boolean;
  };
  display: {
    compactMode: boolean;
    showAnalytics: boolean;
    autoRefresh: boolean;
  };
}
