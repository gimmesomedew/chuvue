-- Add RLS policies for deleting analytics data
-- Allow admins and reviewers to delete analytics data

-- For user_interaction_analytics
CREATE POLICY "Allow admin and reviewer delete user interaction analytics" ON user_interaction_analytics
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role IN ('admin', 'reviewer')
    )
  );

-- For search_analytics
CREATE POLICY "Allow admin and reviewer delete search analytics" ON search_analytics
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role IN ('admin', 'reviewer')
    )
  );

-- For page_view_analytics
CREATE POLICY "Allow admin and reviewer delete page view analytics" ON page_view_analytics
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role IN ('admin', 'reviewer')
    )
  );

-- For analytics_events
CREATE POLICY "Allow admin and reviewer delete analytics events" ON analytics_events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role IN ('admin', 'reviewer')
    )
  ); 