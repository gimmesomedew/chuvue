-- Add status column to existing product_submissions table
-- Run this script in your Supabase SQL editor

-- Add status column if it doesn't exist
ALTER TABLE product_submissions 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Add check constraint for status values
ALTER TABLE product_submissions 
DROP CONSTRAINT IF EXISTS product_submissions_status_check;

ALTER TABLE product_submissions 
ADD CONSTRAINT product_submissions_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing records to have 'pending' status if they don't have one
UPDATE product_submissions 
SET status = 'pending' 
WHERE status IS NULL;

-- Create index on status column for better query performance
CREATE INDEX IF NOT EXISTS idx_product_submissions_status 
ON product_submissions(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_product_submissions_created_at 
ON product_submissions(created_at);

-- Grant permissions (in case they don't exist)
GRANT SELECT, INSERT, UPDATE, DELETE ON product_submissions TO authenticated;
GRANT SELECT ON product_submissions TO anon;
