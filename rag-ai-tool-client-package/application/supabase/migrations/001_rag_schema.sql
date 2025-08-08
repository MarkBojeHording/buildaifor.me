-- RAG AI Tool Database Schema
-- Complete database setup for the AI-powered document search system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Documents table - stores uploaded document metadata
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('uploading', 'processing', 'ready', 'error')) DEFAULT 'uploading',
    chunks_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document chunks table - stores chunked document content with embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search events table - tracks all search queries for analytics
CREATE TABLE IF NOT EXISTS search_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    query TEXT NOT NULL,
    results_count INTEGER NOT NULL DEFAULT 0,
    processing_time_ms INTEGER NOT NULL DEFAULT 0,
    user_satisfied BOOLEAN,
    clicked_result_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document events table - tracks document lifecycle events
CREATE TABLE IF NOT EXISTS document_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('upload', 'process', 'delete', 'access')),
    success BOOLEAN NOT NULL DEFAULT true,
    processing_time_ms INTEGER,
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table - stores user customization settings
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    language TEXT DEFAULT 'en',
    results_per_page INTEGER DEFAULT 10 CHECK (results_per_page > 0 AND results_per_page <= 100),
    default_search_mode TEXT DEFAULT 'semantic' CHECK (default_search_mode IN ('semantic', 'keyword', 'hybrid')),
    show_confidence_scores BOOLEAN DEFAULT true,
    enable_auto_suggestions BOOLEAN DEFAULT true,
    custom_branding JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email_updates": true, "processing_complete": true, "weekly_reports": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage statistics table - aggregated analytics data
CREATE TABLE IF NOT EXISTS usage_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    total_searches INTEGER NOT NULL DEFAULT 0,
    unique_queries INTEGER NOT NULL DEFAULT 0,
    documents_processed INTEGER NOT NULL DEFAULT 0,
    avg_response_time INTEGER NOT NULL DEFAULT 0,
    user_satisfaction_score DECIMAL(3,2),
    popular_queries JSONB DEFAULT '[]',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings table - system-wide configuration
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branding configuration table - white-label customization
CREATE TABLE IF NOT EXISTS branding_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL DEFAULT 'RAG AI Tool',
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#3B82F6',
    secondary_color TEXT NOT NULL DEFAULT '#10B981',
    accent_color TEXT NOT NULL DEFAULT '#F59E0B',
    font_family TEXT,
    custom_css TEXT,
    footer_text TEXT,
    support_email TEXT,
    support_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration configurations table - external system integrations
CREATE TABLE IF NOT EXISTS integration_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('slack', 'teams', 'discord', 'webhook', 'api')),
    enabled BOOLEAN DEFAULT true,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON documents(file_type);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_search_events_user_id ON search_events(user_id);
CREATE INDEX IF NOT EXISTS idx_search_events_timestamp ON search_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_search_events_query ON search_events USING gin (query gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_document_events_document_id ON document_events(document_id);
CREATE INDEX IF NOT EXISTS idx_document_events_timestamp ON document_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_document_events_event_type ON document_events(event_type);

CREATE INDEX IF NOT EXISTS idx_usage_statistics_user_id ON usage_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_statistics_period ON usage_statistics(period_start, period_end);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_documents_content_fts ON documents USING gin (to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_document_chunks_content_fts ON document_chunks USING gin (to_tsvector('english', content));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branding_config_updated_at
    BEFORE UPDATE ON branding_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_configs_updated_at
    BEFORE UPDATE ON integration_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for document_chunks
CREATE POLICY "Users can view chunks of their documents" ON document_chunks
    FOR SELECT USING (
        document_id IN (
            SELECT id FROM documents WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert chunks for their documents" ON document_chunks
    FOR INSERT WITH CHECK (
        document_id IN (
            SELECT id FROM documents WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete chunks of their documents" ON document_chunks
    FOR DELETE USING (
        document_id IN (
            SELECT id FROM documents WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for search_events
CREATE POLICY "Users can view their own search events" ON search_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search events" ON search_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for document_events
CREATE POLICY "Users can view events for their documents" ON document_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert events for their documents" ON document_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for usage_statistics
CREATE POLICY "Users can view their own usage statistics" ON usage_statistics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage statistics" ON usage_statistics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for integration_configs
CREATE POLICY "Users can manage their own integration configs" ON integration_configs
    FOR ALL USING (auth.uid() = user_id);

-- Create views for common queries
CREATE OR REPLACE VIEW user_document_summary AS
SELECT
    u.id as user_id,
    COUNT(d.id) as total_documents,
    SUM(d.file_size) as total_file_size,
    SUM(d.chunks_count) as total_chunks,
    COUNT(CASE WHEN d.status = 'ready' THEN 1 END) as ready_documents,
    COUNT(CASE WHEN d.status = 'processing' THEN 1 END) as processing_documents,
    COUNT(CASE WHEN d.status = 'error' THEN 1 END) as error_documents,
    MAX(d.upload_date) as last_upload_date
FROM auth.users u
LEFT JOIN documents d ON u.id = d.user_id
GROUP BY u.id;

CREATE OR REPLACE VIEW user_search_analytics AS
SELECT
    user_id,
    COUNT(*) as total_searches,
    AVG(processing_time_ms) as avg_processing_time,
    AVG(results_count) as avg_results_count,
    COUNT(CASE WHEN user_satisfied = true THEN 1 END) as satisfied_searches,
    COUNT(CASE WHEN clicked_result_id IS NOT NULL THEN 1 END) as clicked_searches,
    DATE_TRUNC('day', timestamp) as search_date,
    COUNT(*) as daily_searches
FROM search_events
WHERE user_id IS NOT NULL
GROUP BY user_id, DATE_TRUNC('day', timestamp);

-- Create function for semantic search similarity
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    document_chunks.metadata,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Create function for user analytics aggregation
CREATE OR REPLACE FUNCTION get_user_analytics(
    user_uuid uuid,
    days_back integer DEFAULT 30
)
RETURNS TABLE (
    total_documents bigint,
    total_searches bigint,
    avg_processing_time numeric,
    user_satisfaction_rate numeric,
    popular_queries jsonb,
    daily_activity jsonb
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT d.id)::bigint as total_documents,
        COUNT(se.id)::bigint as total_searches,
        ROUND(AVG(se.processing_time_ms)::numeric, 2) as avg_processing_time,
        ROUND(
            (COUNT(CASE WHEN se.user_satisfied = true THEN 1 END)::numeric /
             NULLIF(COUNT(se.id), 0) * 100)::numeric, 2
        ) as user_satisfaction_rate,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'query', query,
                    'count', count
                )
            )
            FROM (
                SELECT query, COUNT(*) as count
                FROM search_events
                WHERE user_id = user_uuid
                AND timestamp >= NOW() - INTERVAL '1 day' * days_back
                GROUP BY query
                ORDER BY count DESC
                LIMIT 10
            ) popular
        ) as popular_queries,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'date', search_date,
                    'count', daily_count
                )
            )
            FROM (
                SELECT
                    DATE_TRUNC('day', timestamp)::date as search_date,
                    COUNT(*) as daily_count
                FROM search_events
                WHERE user_id = user_uuid
                AND timestamp >= NOW() - INTERVAL '1 day' * days_back
                GROUP BY DATE_TRUNC('day', timestamp)
                ORDER BY search_date DESC
            ) daily
        ) as daily_activity
    FROM documents d
    LEFT JOIN search_events se ON se.user_id = user_uuid
    WHERE d.user_id = user_uuid
    AND d.created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql;

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
    ('max_file_size_mb', '50', 'Maximum file size in MB for document uploads'),
    ('allowed_file_types', '["application/pdf", "text/plain", "text/markdown", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]', 'Allowed file types for document uploads'),
    ('max_documents_per_user', '1000', 'Maximum number of documents per user'),
    ('search_rate_limit', '100', 'Maximum searches per minute per user'),
    ('enable_public_search', 'false', 'Allow public search without authentication'),
    ('require_approval', 'false', 'Require admin approval for new documents')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default branding configuration
INSERT INTO branding_config (
    company_name,
    primary_color,
    secondary_color,
    accent_color,
    footer_text
) VALUES (
    'RAG AI Tool',
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    'Powered by RAG AI Tool - Intelligent Document Search'
) ON CONFLICT DO NOTHING;

-- Create comments for documentation
COMMENT ON TABLE documents IS 'Stores uploaded document metadata and content';
COMMENT ON TABLE document_chunks IS 'Stores chunked document content with vector embeddings for semantic search';
COMMENT ON TABLE search_events IS 'Tracks all search queries for analytics and improvements';
COMMENT ON TABLE document_events IS 'Logs document lifecycle events for audit and analytics';
COMMENT ON TABLE user_preferences IS 'Stores user customization and preference settings';
COMMENT ON TABLE usage_statistics IS 'Aggregated analytics data for reporting and insights';
COMMENT ON TABLE admin_settings IS 'System-wide configuration settings';
COMMENT ON TABLE branding_config IS 'White-label branding and customization configuration';
COMMENT ON TABLE integration_configs IS 'External system integration configurations';

COMMENT ON COLUMN document_chunks.embedding IS 'Vector embedding for semantic search (OpenAI ada-002, 1536 dimensions)';
COMMENT ON COLUMN search_events.processing_time_ms IS 'Time taken to process the search request in milliseconds';
COMMENT ON COLUMN documents.chunks_count IS 'Number of chunks this document was split into for processing';
COMMENT ON COLUMN user_preferences.default_search_mode IS 'Preferred search mode: semantic (vector), keyword (full-text), or hybrid';

-- Create sample data for demo purposes (optional)
-- This will be populated by the application during first use
