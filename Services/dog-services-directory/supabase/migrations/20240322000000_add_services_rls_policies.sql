-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to services
CREATE POLICY "Allow public read access to services"
  ON services
  FOR SELECT
  TO public
  USING (true);

-- Allow admins and reviewers to delete services
CREATE POLICY "Allow admin and reviewer delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role IN ('admin', 'reviewer')
    )
  );

-- Allow admins and reviewers to update services
CREATE POLICY "Allow admin and reviewer update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role IN ('admin', 'reviewer')
    )
  );

-- Allow admins and reviewers to insert services
CREATE POLICY "Allow admin and reviewer insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role IN ('admin', 'reviewer')
    )
  ); 