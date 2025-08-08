-- AI Email Analyzer Database Schema
-- Migration: 20241201000000_create_email_analyzer_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (if not using auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  company_name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email analysis table
CREATE TABLE IF NOT EXISTS public.email_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email_subject VARCHAR(500) NOT NULL,
  email_body TEXT NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- AI Analysis Results
  priority_level VARCHAR(20) NOT NULL CHECK (priority_level IN ('high', 'medium', 'low')),
  sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
  sentiment_label VARCHAR(20), -- positive, negative, neutral
  urgency_score INTEGER CHECK (urgency_score >= 1 AND urgency_score <= 10),

  -- Categories and routing
  primary_category VARCHAR(100),
  secondary_categories TEXT[], -- Array of additional categories
  recommended_department VARCHAR(100),
  recommended_agent VARCHAR(255),

  -- AI-generated insights
  summary TEXT,
  key_issues TEXT[],
  suggested_response TEXT,
  escalation_required BOOLEAN DEFAULT FALSE,
  estimated_resolution_time INTEGER, -- in minutes

  -- Metadata
  analysis_confidence DECIMAL(3,2), -- 0.00 to 1.00
  processing_time_ms INTEGER,
  model_version VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email attachments
CREATE TABLE IF NOT EXISTS public.email_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_analysis_id UUID REFERENCES public.email_analyses(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis templates and rules
CREATE TABLE IF NOT EXISTS public.analysis_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rule_name VARCHAR(255) NOT NULL,
  trigger_keywords TEXT[],
  assigned_priority VARCHAR(20),
  assigned_department VARCHAR(100),
  auto_response_template TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS public.analysis_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  total_emails_analyzed INTEGER DEFAULT 0,
  high_priority_count INTEGER DEFAULT 0,
  medium_priority_count INTEGER DEFAULT 0,
  low_priority_count INTEGER DEFAULT 0,
  avg_sentiment_score DECIMAL(3,2),
  avg_processing_time_ms INTEGER,
  accuracy_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_analyses_user_id ON public.email_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_email_analyses_priority ON public.email_analyses(priority_level);
CREATE INDEX IF NOT EXISTS idx_email_analyses_created_at ON public.email_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_analyses_sentiment ON public.email_analyses(sentiment_label);
CREATE INDEX IF NOT EXISTS idx_email_analyses_category ON public.email_analyses(primary_category);
CREATE INDEX IF NOT EXISTS idx_email_analyses_search ON public.email_analyses USING GIN(to_tsvector('english', email_subject || ' ' || email_body));

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only see their own data" ON public.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only see their own analyses" ON public.email_analyses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own attachments" ON public.email_attachments
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM public.email_analyses WHERE id = email_analysis_id
  ));

CREATE POLICY "Users can only see their own rules" ON public.analysis_rules
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own metrics" ON public.analysis_metrics
  FOR ALL USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_analyses_updated_at BEFORE UPDATE ON public.email_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update daily metrics
CREATE OR REPLACE FUNCTION update_daily_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.analysis_metrics (
        user_id,
        date,
        total_emails_analyzed,
        high_priority_count,
        medium_priority_count,
        low_priority_count,
        avg_sentiment_score
    )
    VALUES (
        NEW.user_id,
        CURRENT_DATE,
        1,
        CASE WHEN NEW.priority_level = 'high' THEN 1 ELSE 0 END,
        CASE WHEN NEW.priority_level = 'medium' THEN 1 ELSE 0 END,
        CASE WHEN NEW.priority_level = 'low' THEN 1 ELSE 0 END,
        NEW.sentiment_score
    )
    ON CONFLICT (user_id, date)
    DO UPDATE SET
        total_emails_analyzed = analysis_metrics.total_emails_analyzed + 1,
        high_priority_count = analysis_metrics.high_priority_count + CASE WHEN NEW.priority_level = 'high' THEN 1 ELSE 0 END,
        medium_priority_count = analysis_metrics.medium_priority_count + CASE WHEN NEW.priority_level = 'medium' THEN 1 ELSE 0 END,
        low_priority_count = analysis_metrics.low_priority_count + CASE WHEN NEW.priority_level = 'low' THEN 1 ELSE 0 END,
        avg_sentiment_score = (analysis_metrics.avg_sentiment_score * analysis_metrics.total_emails_analyzed + NEW.sentiment_score) / (analysis_metrics.total_emails_analyzed + 1);

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_daily_metrics
    AFTER INSERT ON public.email_analyses
    FOR EACH ROW EXECUTE FUNCTION update_daily_metrics();

-- Sample data for demonstration
INSERT INTO public.users (id, email, company_name, subscription_tier) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'demo@example.com', 'Demo Company', 'premium')
ON CONFLICT (email) DO NOTHING;
