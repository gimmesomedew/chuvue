-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  page_url TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  search_term VARCHAR(500) NOT NULL,
  service_type VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  results_count INTEGER NOT NULL DEFAULT 0,
  page_number INTEGER NOT NULL DEFAULT 1,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page view analytics table
CREATE TABLE IF NOT EXISTS page_view_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  page_title VARCHAR(500) NOT NULL,
  time_spent INTEGER NOT NULL DEFAULT 0, -- in seconds
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user interaction analytics table
CREATE TABLE IF NOT EXISTS user_interaction_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('click', 'favorite', 'contact', 'website_visit', 'map_view')),
  target_id VARCHAR(255) NOT NULL,
  target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('service', 'profile', 'button', 'link')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at ON search_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_search_analytics_search_term ON search_analytics(search_term);
CREATE INDEX IF NOT EXISTS idx_search_analytics_service_type ON search_analytics(service_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_session_id ON search_analytics(session_id);

CREATE INDEX IF NOT EXISTS idx_page_view_analytics_created_at ON page_view_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_page_view_analytics_page_url ON page_view_analytics(page_url);
CREATE INDEX IF NOT EXISTS idx_page_view_analytics_user_id ON page_view_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_page_view_analytics_session_id ON page_view_analytics(session_id);

CREATE INDEX IF NOT EXISTS idx_user_interaction_analytics_created_at ON user_interaction_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_user_interaction_analytics_interaction_type ON user_interaction_analytics(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interaction_analytics_target_id ON user_interaction_analytics(target_id);
CREATE INDEX IF NOT EXISTS idx_user_interaction_analytics_user_id ON user_interaction_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interaction_analytics_session_id ON user_interaction_analytics(session_id);

-- Create RLS policies for analytics tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_view_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interaction_analytics ENABLE ROW LEVEL SECURITY;

-- Allow all users to insert analytics data
CREATE POLICY "Allow insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert search analytics" ON search_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert page view analytics" ON page_view_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert user interaction analytics" ON user_interaction_analytics
  FOR INSERT WITH CHECK (true);

-- Allow admins to read analytics data
CREATE POLICY "Allow admin read analytics events" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM auth.users WHERE role = 'admin'
      )
    )
  );

CREATE POLICY "Allow admin read search analytics" ON search_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM auth.users WHERE role = 'admin'
      )
    )
  );

CREATE POLICY "Allow admin read page view analytics" ON page_view_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM auth.users WHERE role = 'admin'
      )
    )
  );

CREATE POLICY "Allow admin read user interaction analytics" ON user_interaction_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM auth.users WHERE role = 'admin'
      )
    )
  ); 