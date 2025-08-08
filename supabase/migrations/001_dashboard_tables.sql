-- Dashboard analyses table
CREATE TABLE dashboard_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  data JSONB NOT NULL,
  metrics JSONB NOT NULL,
  analysis_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE dashboard_analyses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own analyses" ON dashboard_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON dashboard_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" ON dashboard_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" ON dashboard_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_dashboard_analyses_user_id ON dashboard_analyses(user_id);
CREATE INDEX idx_dashboard_analyses_created_at ON dashboard_analyses(created_at);
CREATE INDEX idx_dashboard_analyses_analysis_type ON dashboard_analyses(analysis_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_dashboard_analyses_updated_at 
    BEFORE UPDATE ON dashboard_analyses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 