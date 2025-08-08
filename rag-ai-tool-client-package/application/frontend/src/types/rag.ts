// RAG AI Tool - Type Definitions
export interface Document {
  id: string;
  title: string;
  content: string;
  file_name: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  chunks_count: number;
  user_id?: string;
  metadata?: {
    language?: string;
    page_count?: number;
    word_count?: number;
    tags?: string[];
  };
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  embedding: number[];
  metadata?: {
    page_number?: number;
    section_title?: string;
    chunk_type?: 'header' | 'paragraph' | 'list' | 'code' | 'table';
  };
}

export interface SearchQuery {
  query: string;
  filters?: {
    document_ids?: string[];
    file_types?: string[];
    date_range?: {
      start: string;
      end: string;
    };
    tags?: string[];
  };
  limit?: number;
  similarity_threshold?: number;
}

export interface SearchResult {
  id: string;
  document_id: string;
  document_title: string;
  content: string;
  similarity_score: number;
  metadata?: {
    page_number?: number;
    section_title?: string;
    file_name?: string;
    file_type?: string;
  };
  highlights?: string[];
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  total_results: number;
  processing_time_ms: number;
  query: string;
  generated_answer?: {
    content: string;
    confidence: number;
    sources: string[];
    model_used: string;
  };
  error?: string;
}

export interface AnalyticsData {
  total_documents: number;
  total_searches: number;
  avg_response_time: number;
  user_activity: {
    daily_searches: Array<{
      date: string;
      count: number;
    }>;
    popular_queries: Array<{
      query: string;
      count: number;
      avg_satisfaction: number;
    }>;
    document_usage: Array<{
      document_id: string;
      document_title: string;
      search_count: number;
      last_accessed: string;
    }>;
  };
  performance_metrics: {
    search_accuracy: number;
    user_satisfaction: number;
    system_uptime: number;
    avg_processing_time: number;
  };
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  results_per_page: number;
  default_search_mode: 'semantic' | 'keyword' | 'hybrid';
  show_confidence_scores: boolean;
  enable_auto_suggestions: boolean;
  custom_branding?: {
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
    company_name?: string;
  };
  notification_settings: {
    email_updates: boolean;
    processing_complete: boolean;
    weekly_reports: boolean;
  };
}

export interface UploadProgress {
  file_name: string;
  file_size: number;
  uploaded_bytes: number;
  progress_percentage: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error_message?: string;
  estimated_completion?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  processing_time_ms?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'document' | 'topic';
  score: number;
  category?: string;
}

export interface AdminSettings {
  max_file_size_mb: number;
  allowed_file_types: string[];
  max_documents_per_user: number;
  search_rate_limit: number;
  enable_public_search: boolean;
  require_approval: boolean;
  custom_prompts: {
    system_prompt: string;
    search_prompt_template: string;
    answer_prompt_template: string;
  };
  ai_settings: {
    model_name: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
  };
}

export interface BrandingConfig {
  company_name: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family?: string;
  custom_css?: string;
  footer_text?: string;
  support_email?: string;
  support_url?: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'slack' | 'teams' | 'discord' | 'webhook' | 'api';
  enabled: boolean;
  settings: {
    webhook_url?: string;
    api_key?: string;
    channel_id?: string;
    events?: string[];
    custom_headers?: Record<string, string>;
  };
  created_at: string;
  last_used?: string;
}

export interface UsageStatistics {
  period: string;
  metrics: {
    total_searches: number;
    unique_users: number;
    documents_processed: number;
    avg_response_time: number;
    top_queries: Array<{
      query: string;
      count: number;
    }>;
    user_engagement: {
      daily_active_users: number;
      session_duration: number;
      searches_per_session: number;
    };
    system_performance: {
      uptime_percentage: number;
      error_rate: number;
      cache_hit_rate: number;
    };
  };
}

// Component Props Types
export interface SearchFormProps {
  onSearch: (query: SearchQuery) => void;
  isLoading: boolean;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
}

export interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  onResultClick?: (result: SearchResult) => void;
  showConfidence?: boolean;
}

export interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  isUploading?: boolean;
  uploadProgress?: UploadProgress[];
}

export interface AnalyticsDashboardProps {
  data: AnalyticsData;
  dateRange: {
    start: string;
    end: string;
  };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

// API Endpoints Types
export interface RAGApiClient {
  // Document Management
  uploadDocument: (file: File) => Promise<ApiResponse<Document>>;
  getDocuments: (limit?: number) => Promise<ApiResponse<Document[]>>;
  deleteDocument: (id: string) => Promise<ApiResponse<void>>;
  getDocument: (id: string) => Promise<ApiResponse<Document>>;

  // Search Operations
  search: (query: SearchQuery) => Promise<SearchResponse>;
  getSuggestions: (partial: string) => Promise<ApiResponse<SearchSuggestion[]>>;

  // Analytics
  getAnalytics: (period: string) => Promise<ApiResponse<AnalyticsData>>;
  getUsageStats: (period: string) => Promise<ApiResponse<UsageStatistics>>;

  // User Management
  getUserPreferences: () => Promise<ApiResponse<UserPreferences>>;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => Promise<ApiResponse<UserPreferences>>;

  // Admin Operations
  getAdminSettings: () => Promise<ApiResponse<AdminSettings>>;
  updateAdminSettings: (settings: Partial<AdminSettings>) => Promise<ApiResponse<AdminSettings>>;
  getBrandingConfig: () => Promise<ApiResponse<BrandingConfig>>;
  updateBrandingConfig: (config: Partial<BrandingConfig>) => Promise<ApiResponse<BrandingConfig>>;

  // Health & Status
  healthCheck: () => Promise<ApiResponse<{ status: string; timestamp: string }>>;
}

// Error Types
export interface RAGError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Event Types for Analytics
export interface SearchEvent {
  query: string;
  results_count: number;
  response_time_ms: number;
  user_satisfied?: boolean;
  clicked_result_id?: string;
  timestamp: string;
}

export interface DocumentEvent {
  document_id: string;
  event_type: 'upload' | 'process' | 'delete' | 'access';
  success: boolean;
  processing_time_ms?: number;
  error_message?: string;
  timestamp: string;
}

// Configuration Types
export interface RAGConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  openai: {
    apiKey: string;
    model: string;
    embeddingModel: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    baseUrl: string;
  };
  features: {
    enableAnalytics: boolean;
    enableBranding: boolean;
    enableIntegrations: boolean;
    enableAdvancedSearch: boolean;
  };
}
