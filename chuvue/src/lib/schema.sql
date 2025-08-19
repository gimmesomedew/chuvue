-- ChuVue Database Schema

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'learner' CHECK (role IN ('admin', 'creator', 'learner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table for organizing interactives
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#8b5cf6',
  icon VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactives table for learning modules
CREATE TABLE IF NOT EXISTS interactives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0
);

-- Screens table for individual learning screens
CREATE TABLE IF NOT EXISTS screens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interactive_id UUID REFERENCES interactives(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('start', 'intro', 'video', 'content', 'completion')),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url VARCHAR(500),
  quote TEXT,
  author VARCHAR(255),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(interactive_id, order_index)
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interactive_id UUID REFERENCES interactives(id) ON DELETE CASCADE,
  current_screen INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- in seconds
  UNIQUE(user_id, interactive_id)
);

-- Screen interactions for analytics
CREATE TABLE IF NOT EXISTS screen_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  screen_id UUID REFERENCES screens(id) ON DELETE CASCADE,
  interactive_id UUID REFERENCES interactives(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- 'view', 'complete', 'navigate'
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB -- additional data like time spent, user agent, etc.
);

-- Insert default categories
INSERT INTO categories (name, description, color, icon) VALUES
  ('Personal Development', 'Skills and mindset development', '#8b5cf6', 'brain'),
  ('Communication', 'Verbal and written communication skills', '#3b82f6', 'users'),
  ('Leadership', 'Leadership principles and practices', '#10b981', 'target'),
  ('Innovation', 'Creative thinking and problem solving', '#f59e0b', 'lightbulb')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interactives_category ON interactives(category_id);
CREATE INDEX IF NOT EXISTS idx_interactives_status ON interactives(status);
CREATE INDEX IF NOT EXISTS idx_interactives_created_by ON interactives(created_by);
CREATE INDEX IF NOT EXISTS idx_screens_interactive ON screens(interactive_id);
CREATE INDEX IF NOT EXISTS idx_screens_order ON screens(interactive_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_interactive ON user_progress(interactive_id);
CREATE INDEX IF NOT EXISTS idx_screen_interactions_user ON screen_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_screen_interactions_screen ON screen_interactions(screen_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to tables
CREATE TRIGGER update_interactives_updated_at BEFORE UPDATE ON interactives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_screens_updated_at BEFORE UPDATE ON screens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
