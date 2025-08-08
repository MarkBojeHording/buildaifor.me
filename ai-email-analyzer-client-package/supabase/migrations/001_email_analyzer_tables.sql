-- Email Analyzer Database Schema
-- This migration creates all necessary tables for the AI Email Analyzer system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Email Analyses Table
CREATE TABLE IF NOT EXISTS email_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_subject TEXT NOT NULL,
    email_body TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Analysis Results
    priority_level VARCHAR(20) NOT NULL CHECK (priority_level IN ('high', 'medium', 'low')),
    sentiment_score DECIMAL(3,2) NOT NULL CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),
    sentiment_label VARCHAR(20) NOT NULL CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
    urgency_score INTEGER NOT NULL CHECK (urgency_score >= 1 AND urgency_score <= 10),
    primary_category VARCHAR(100) NOT NULL,
    secondary_categories TEXT[] DEFAULT '{}',
    recommended_department VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    key_issues TEXT[] DEFAULT '{}',
    suggested_response TEXT NOT NULL,
    escalation_required BOOLEAN DEFAULT FALSE,
    estimated_resolution_time INTEGER NOT NULL, -- in minutes
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),

    -- Processing Metadata
    processing_time_ms INTEGER NOT NULL,
    analysis_method VARCHAR(50) DEFAULT 'openai', -- 'openai' or 'fallback'
    ai_model_version VARCHAR(50),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

    -- Display Preferences
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',

    -- Notification Preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    slack_notifications BOOLEAN DEFAULT FALSE,
    high_priority_alerts BOOLEAN DEFAULT TRUE,
    churn_risk_alerts BOOLEAN DEFAULT TRUE,

    -- Display Settings
    compact_mode BOOLEAN DEFAULT FALSE,
    show_analytics BOOLEAN DEFAULT TRUE,
    auto_refresh BOOLEAN DEFAULT TRUE,
    refresh_interval INTEGER DEFAULT 300, -- seconds

    -- Custom Rules
    custom_priority_keywords TEXT[] DEFAULT '{}',
    custom_sentiment_keywords JSONB DEFAULT '{}',
    custom_department_rules JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Logs Table
CREATE TABLE IF NOT EXISTS analytics_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Analytics Data
    period VARCHAR(10) NOT NULL, -- '7d', '30d', '90d'
    total_emails INTEGER NOT NULL,
    avg_sentiment DECIMAL(3,2) NOT NULL,
    high_priority_count INTEGER NOT NULL,
    avg_processing_time INTEGER NOT NULL,

    -- Category Breakdown
    category_breakdown JSONB NOT NULL,
    sentiment_trend JSONB NOT NULL,
    priority_distribution JSONB NOT NULL,

    -- Performance Metrics
    accuracy_rate DECIMAL(5,2),
    error_rate DECIMAL(5,2),
    uptime_percentage DECIMAL(5,2),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Reports Table
CREATE TABLE IF NOT EXISTS saved_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Report Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL, -- 'email_analysis', 'analytics', 'performance'

    -- Report Configuration
    filters JSONB DEFAULT '{}',
    date_range JSONB DEFAULT '{}',
    columns TEXT[] DEFAULT '{}',
    sort_order JSONB DEFAULT '{}',

    -- Report Data
    data JSONB,
    export_format VARCHAR(10) DEFAULT 'json', -- 'json', 'csv', 'pdf'

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration Configurations Table
CREATE TABLE IF NOT EXISTS integration_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Integration Details
    type VARCHAR(50) NOT NULL, -- 'crm', 'helpdesk', 'email', 'slack', 'webhook'
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Configuration
    config JSONB NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,

    -- Webhook Configuration
    webhook_url TEXT,
    webhook_secret TEXT,
    webhook_events TEXT[] DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Metrics
    average_processing_time INTEGER NOT NULL, -- milliseconds
    accuracy_percentage DECIMAL(5,2) NOT NULL,
    uptime_percentage DECIMAL(5,2) NOT NULL,
    total_emails_processed INTEGER NOT NULL,
    error_rate DECIMAL(5,2) NOT NULL,

    -- Time Period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_analyses_user_id ON email_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_email_analyses_created_at ON email_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_email_analyses_priority_level ON email_analyses(priority_level);
CREATE INDEX IF NOT EXISTS idx_email_analyses_sentiment_label ON email_analyses(sentiment_label);
CREATE INDEX IF NOT EXISTS idx_email_analyses_primary_category ON email_analyses(primary_category);

CREATE INDEX IF NOT EXISTS idx_analytics_logs_user_id ON analytics_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_logs_created_at ON analytics_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_logs_period ON analytics_logs(period);

CREATE INDEX IF NOT EXISTS idx_saved_reports_user_id ON saved_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_type ON saved_reports(report_type);

CREATE INDEX IF NOT EXISTS idx_integration_configs_user_id ON integration_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_configs_type ON integration_configs(type);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_period ON performance_metrics(period_start, period_end);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_email_analyses_updated_at
    BEFORE UPDATE ON email_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_reports_updated_at
    BEFORE UPDATE ON saved_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_configs_updated_at
    BEFORE UPDATE ON integration_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE email_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Email Analyses policies
CREATE POLICY "Users can view their own email analyses" ON email_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email analyses" ON email_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email analyses" ON email_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email analyses" ON email_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- User Preferences policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Analytics Logs policies
CREATE POLICY "Users can view their own analytics logs" ON analytics_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics logs" ON analytics_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Saved Reports policies
CREATE POLICY "Users can view their own saved reports" ON saved_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved reports" ON saved_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved reports" ON saved_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved reports" ON saved_reports
    FOR DELETE USING (auth.uid() = user_id);

-- Integration Configs policies
CREATE POLICY "Users can view their own integration configs" ON integration_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration configs" ON integration_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration configs" ON integration_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integration configs" ON integration_configs
    FOR DELETE USING (auth.uid() = user_id);

-- Performance Metrics policies
CREATE POLICY "Users can view their own performance metrics" ON performance_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance metrics" ON performance_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create views for common queries
CREATE OR REPLACE VIEW user_analytics_summary AS
SELECT
    user_id,
    COUNT(*) as total_emails,
    AVG(sentiment_score) as avg_sentiment,
    COUNT(CASE WHEN priority_level = 'high' THEN 1 END) as high_priority_count,
    AVG(processing_time_ms) as avg_processing_time,
    COUNT(CASE WHEN sentiment_label = 'negative' THEN 1 END) as negative_sentiment_count,
    COUNT(CASE WHEN sentiment_label = 'positive' THEN 1 END) as positive_sentiment_count,
    COUNT(CASE WHEN escalation_required THEN 1 END) as escalation_count
FROM email_analyses
GROUP BY user_id;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    total_emails BIGINT,
    avg_sentiment DECIMAL(3,2),
    high_priority_count BIGINT,
    avg_processing_time INTEGER,
    negative_sentiment_count BIGINT,
    positive_sentiment_count BIGINT,
    escalation_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_emails,
        AVG(sentiment_score) as avg_sentiment,
        COUNT(CASE WHEN priority_level = 'high' THEN 1 END)::BIGINT as high_priority_count,
        AVG(processing_time_ms)::INTEGER as avg_processing_time,
        COUNT(CASE WHEN sentiment_label = 'negative' THEN 1 END)::BIGINT as negative_sentiment_count,
        COUNT(CASE WHEN sentiment_label = 'positive' THEN 1 END)::BIGINT as positive_sentiment_count,
        COUNT(CASE WHEN escalation_required THEN 1 END)::BIGINT as escalation_count
    FROM email_analyses
    WHERE user_id = user_uuid
    AND created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for demo purposes (optional)
INSERT INTO user_preferences (user_id, theme, language, timezone, email_notifications, high_priority_alerts)
VALUES
    (uuid_generate_v4(), 'light', 'en', 'UTC', true, true),
    (uuid_generate_v4(), 'dark', 'en', 'America/New_York', true, true),
    (uuid_generate_v4(), 'auto', 'en', 'Europe/London', false, true)
ON CONFLICT DO NOTHING;

-- Create comments for documentation
COMMENT ON TABLE email_analyses IS 'Stores email analysis results from AI processing';
COMMENT ON TABLE user_preferences IS 'Stores user preferences and settings for the email analyzer';
COMMENT ON TABLE analytics_logs IS 'Stores analytics data for reporting and insights';
COMMENT ON TABLE saved_reports IS 'Stores user-created reports and exports';
COMMENT ON TABLE integration_configs IS 'Stores integration configurations for external systems';
COMMENT ON TABLE performance_metrics IS 'Stores system performance metrics and KPIs';

COMMENT ON COLUMN email_analyses.sentiment_score IS 'Sentiment score from -1.0 (very negative) to 1.0 (very positive)';
COMMENT ON COLUMN email_analyses.urgency_score IS 'Urgency score from 1 (low) to 10 (critical)';
COMMENT ON COLUMN email_analyses.confidence IS 'AI confidence in the analysis from 0.0 to 1.0';
COMMENT ON COLUMN email_analyses.processing_time_ms IS 'Time taken to process the email in milliseconds';
