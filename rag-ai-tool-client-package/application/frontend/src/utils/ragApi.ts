import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Document,
  SearchQuery,
  SearchResponse,
  AnalyticsData,
  UserPreferences,
  AdminSettings,
  BrandingConfig,
  RAGApiClient,
  ApiResponse,
  SearchSuggestion,
  UsageStatistics
} from '../types/rag';

export class SupabaseRAGApiClient implements RAGApiClient {
  private supabase: SupabaseClient;
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  // Document Management
  async uploadDocument(file: File): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.supabaseUrl}/functions/v1/document-processor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.document,
        processing_time_ms: data.processing_time_ms
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upload document'
      };
    }
  }

  async getDocuments(limit: number = 50): Promise<ApiResponse<Document[]>> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .order('upload_date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch documents'
      };
    }
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/document-processor`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({ document_id: id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete document'
      };
    }
  }

  async getDocument(id: string): Promise<ApiResponse<Document>> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch document'
      };
    }
  }

  // Search Operations
  async search(query: SearchQuery): Promise<SearchResponse> {
    try {
      const startTime = Date.now();

      const response = await fetch(`${this.supabaseUrl}/functions/v1/semantic-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify(query)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        results: data.results || [],
        total_results: data.total_results || 0,
        processing_time_ms: data.processing_time_ms || processingTime,
        query: query.query,
        generated_answer: data.generated_answer
      };
    } catch (error: any) {
      return {
        success: false,
        results: [],
        total_results: 0,
        processing_time_ms: 0,
        query: query.query,
        error: error.message || 'Search failed'
      };
    }
  }

  async getSuggestions(partial: string): Promise<ApiResponse<SearchSuggestion[]>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/semantic-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'get_suggestions',
          partial_query: partial
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.suggestions || []
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to get suggestions'
      };
    }
  }

  // Analytics
  async getAnalytics(period: string): Promise<ApiResponse<AnalyticsData>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/analytics-tracker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'get_analytics',
          period
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.analytics
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch analytics'
      };
    }
  }

  async getUsageStats(period: string): Promise<ApiResponse<UsageStatistics>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/analytics-tracker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'get_usage_stats',
          period
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.usage_stats
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch usage statistics'
      };
    }
  }

  // User Management
  async getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Return default preferences if none exist
      if (!data) {
        const defaultPreferences: UserPreferences = {
          id: '',
          user_id: user.id,
          theme: 'light',
          language: 'en',
          results_per_page: 10,
          default_search_mode: 'semantic',
          show_confidence_scores: true,
          enable_auto_suggestions: true,
          notification_settings: {
            email_updates: true,
            processing_complete: true,
            weekly_reports: false
          }
        };

        return {
          success: true,
          data: defaultPreferences
        };
      }

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user preferences'
      };
    }
  }

  async updateUserPreferences(prefs: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...prefs,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update user preferences'
      };
    }
  }

  // Admin Operations
  async getAdminSettings(): Promise<ApiResponse<AdminSettings>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/admin-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({ action: 'get_settings' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.settings
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch admin settings'
      };
    }
  }

  async updateAdminSettings(settings: Partial<AdminSettings>): Promise<ApiResponse<AdminSettings>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/admin-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'update_settings',
          settings
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.settings
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update admin settings'
      };
    }
  }

  async getBrandingConfig(): Promise<ApiResponse<BrandingConfig>> {
    try {
      const { data, error } = await this.supabase
        .from('branding_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Return default branding if none exists
      if (!data) {
        const defaultBranding: BrandingConfig = {
          company_name: 'RAG AI Tool',
          primary_color: '#3B82F6',
          secondary_color: '#10B981',
          accent_color: '#F59E0B'
        };

        return {
          success: true,
          data: defaultBranding
        };
      }

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch branding config'
      };
    }
  }

  async updateBrandingConfig(config: Partial<BrandingConfig>): Promise<ApiResponse<BrandingConfig>> {
    try {
      const { data, error } = await this.supabase
        .from('branding_config')
        .upsert(config)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update branding config'
      };
    }
  }

  // Health & Status
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/semantic-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({ action: 'health_check' })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          status: data.status || 'healthy',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Health check failed'
      };
    }
  }

  // Utility Methods
  async trackSearchEvent(query: string, results_count: number, response_time_ms: number): Promise<void> {
    try {
      await fetch(`${this.supabaseUrl}/functions/v1/analytics-tracker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'track_search',
          event: {
            query,
            results_count,
            response_time_ms,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to track search event:', error);
    }
  }

  async trackDocumentEvent(document_id: string, event_type: string, success: boolean): Promise<void> {
    try {
      await fetch(`${this.supabaseUrl}/functions/v1/analytics-tracker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'track_document',
          event: {
            document_id,
            event_type,
            success,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to track document event:', error);
    }
  }

  // File Processing
  async processDocumentFile(file: File, options?: {
    extract_images?: boolean;
    chunk_size?: number;
    overlap_size?: number;
  }): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options || {}));

      const response = await fetch(`${this.supabaseUrl}/functions/v1/document-processor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.document,
        processing_time_ms: data.processing_time_ms
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to process document'
      };
    }
  }

  // Batch Operations
  async batchUploadDocuments(files: File[]): Promise<ApiResponse<Document[]>> {
    const results: Document[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const result = await this.uploadDocument(file);
        if (result.success && result.data) {
          results.push(result.data);
        } else {
          errors.push(`${file.name}: ${result.error}`);
        }
      } catch (error: any) {
        errors.push(`${file.name}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      data: results,
      error: errors.length > 0 ? errors.join('; ') : undefined
    };
  }

  async batchDeleteDocuments(ids: string[]): Promise<ApiResponse<void>> {
    const errors: string[] = [];

    for (const id of ids) {
      try {
        const result = await this.deleteDocument(id);
        if (!result.success) {
          errors.push(`${id}: ${result.error}`);
        }
      } catch (error: any) {
        errors.push(`${id}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      error: errors.length > 0 ? errors.join('; ') : undefined
    };
  }
}

// Factory function to create API client
export function createRAGApiClient(supabaseUrl: string, supabaseAnonKey: string): RAGApiClient {
  return new SupabaseRAGApiClient(supabaseUrl, supabaseAnonKey);
}

// Export utility functions
export const ragApiUtils = {
  formatFileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  validateFile: (file: File, maxSize: number = 50 * 1024 * 1024, allowedTypes: string[] = ['application/pdf', 'text/plain', 'text/markdown']): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${ragApiUtils.formatFileSize(maxSize)} limit`;
    }
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    return null;
  },

  extractFileExtension: (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  },

  generateSearchSummary: (results: SearchResult[]): string => {
    if (results.length === 0) return 'No results found';
    const avgScore = results.reduce((sum, r) => sum + r.similarity_score, 0) / results.length;
    return `Found ${results.length} relevant ${results.length === 1 ? 'result' : 'results'} with ${Math.round(avgScore * 100)}% average relevance`;
  }
};
