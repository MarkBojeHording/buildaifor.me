-- Ecommerce analyses table for storing user data and analytics
CREATE TABLE ecommerce_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  data JSONB NOT NULL,
  metrics JSONB NOT NULL,
  analysis_type TEXT DEFAULT 'comprehensive',
  date_range JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE ecommerce_user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  dashboard_settings JSONB DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{}',
  custom_metrics JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics tracking for performance monitoring
CREATE TABLE ecommerce_analytics_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  processing_time_ms INTEGER,
  data_points INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved reports and insights
CREATE TABLE ecommerce_saved_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_name TEXT NOT NULL,
  report_data JSONB NOT NULL,
  insights JSONB,
  metrics JSONB,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE ecommerce_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_analytics_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_saved_reports ENABLE ROW LEVEL SECURITY;

-- Policies for ecommerce_analyses
CREATE POLICY "Users can view their own analyses" ON ecommerce_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON ecommerce_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" ON ecommerce_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" ON ecommerce_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for ecommerce_user_preferences
CREATE POLICY "Users can view their own preferences" ON ecommerce_user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON ecommerce_user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON ecommerce_user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for ecommerce_analytics_logs
CREATE POLICY "Users can view their own analytics logs" ON ecommerce_analytics_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics logs" ON ecommerce_analytics_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for ecommerce_saved_reports
CREATE POLICY "Users can view their own saved reports" ON ecommerce_saved_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved reports" ON ecommerce_saved_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved reports" ON ecommerce_saved_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved reports" ON ecommerce_saved_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_ecommerce_analyses_user_id ON ecommerce_analyses(user_id);
CREATE INDEX idx_ecommerce_analyses_created_at ON ecommerce_analyses(created_at DESC);
CREATE INDEX idx_ecommerce_analyses_analysis_type ON ecommerce_analyses(analysis_type);

CREATE INDEX idx_ecommerce_user_preferences_user_id ON ecommerce_user_preferences(user_id);

CREATE INDEX idx_ecommerce_analytics_logs_user_id ON ecommerce_analytics_logs(user_id);
CREATE INDEX idx_ecommerce_analytics_logs_created_at ON ecommerce_analytics_logs(created_at DESC);
CREATE INDEX idx_ecommerce_analytics_logs_action_type ON ecommerce_analytics_logs(action_type);

CREATE INDEX idx_ecommerce_saved_reports_user_id ON ecommerce_saved_reports(user_id);
CREATE INDEX idx_ecommerce_saved_reports_created_at ON ecommerce_saved_reports(created_at DESC);
CREATE INDEX idx_ecommerce_saved_reports_is_favorite ON ecommerce_saved_reports(is_favorite);

-- GIN indexes for JSONB columns
CREATE INDEX idx_ecommerce_analyses_data_gin ON ecommerce_analyses USING GIN (data);
CREATE INDEX idx_ecommerce_analyses_metrics_gin ON ecommerce_analyses USING GIN (metrics);
CREATE INDEX idx_ecommerce_saved_reports_report_data_gin ON ecommerce_saved_reports USING GIN (report_data);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_ecommerce_analyses_updated_at
  BEFORE UPDATE ON ecommerce_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ecommerce_user_preferences_updated_at
  BEFORE UPDATE ON ecommerce_user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ecommerce_saved_reports_updated_at
  BEFORE UPDATE ON ecommerce_saved_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE VIEW ecommerce_user_summary AS
SELECT
  user_id,
  COUNT(*) as total_analyses,
  MAX(created_at) as last_analysis,
  AVG((metrics->>'totalRevenue')::numeric) as avg_revenue,
  SUM((metrics->>'totalOrders')::integer) as total_orders
FROM ecommerce_analyses
GROUP BY user_id;

-- Function to get user analytics summary
CREATE OR REPLACE FUNCTION get_user_analytics_summary(user_uuid UUID)
RETURNS TABLE(
  total_analyses BIGINT,
  last_analysis TIMESTAMP WITH TIME ZONE,
  avg_revenue NUMERIC,
  total_orders BIGINT,
  favorite_reports_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(analyses.total_analyses, 0),
    analyses.last_analysis,
    COALESCE(analyses.avg_revenue, 0),
    COALESCE(analyses.total_orders, 0),
    COALESCE(reports.favorite_reports_count, 0)
  FROM (
    SELECT
      COUNT(*) as total_analyses,
      MAX(created_at) as last_analysis,
      AVG((metrics->>'totalRevenue')::numeric) as avg_revenue,
      SUM((metrics->>'totalOrders')::integer) as total_orders
    FROM ecommerce_analyses
    WHERE user_id = user_uuid
  ) analyses
  CROSS JOIN (
    SELECT COUNT(*) as favorite_reports_count
    FROM ecommerce_saved_reports
    WHERE user_id = user_uuid AND is_favorite = true
  ) reports;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
