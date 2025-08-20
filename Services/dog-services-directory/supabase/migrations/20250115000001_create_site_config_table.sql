-- Create site configuration table for storing configurable site settings
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default popular search tags
INSERT INTO site_config (config_key, config_value, description) VALUES
  ('popular_search_tag_1', 'Dog Parks close to me', 'First popular search tag'),
  ('popular_search_tag_2', 'Dog Parks in Indiana', 'Second popular search tag'),
  ('popular_search_tag_3', 'Groomers in Indianapolis', 'Third popular search tag'),
  ('popular_search_tag_4', 'Veterinarians in Indiana', 'Fourth popular search tag'),
  ('popular_search_tag_5', 'Dog Trainers near me', 'Fifth popular search tag'),
  ('popular_search_tag_6', 'Boarding & Daycare', 'Sixth popular search tag')
ON CONFLICT (config_key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_site_config_updated_at 
  BEFORE UPDATE ON site_config 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON site_config TO authenticated;
GRANT SELECT ON site_config TO anon;
