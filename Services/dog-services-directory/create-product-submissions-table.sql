-- Create product_submissions table for storing product submissions that need review
-- Run this script in your Supabase SQL editor or database client

CREATE TABLE IF NOT EXISTS product_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(500),
  contact_number VARCHAR(20),
  email VARCHAR(255),
  location_address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified_gentle_care BOOLEAN DEFAULT false,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_submissions_status ON product_submissions(status);
CREATE INDEX IF NOT EXISTS idx_product_submissions_created_at ON product_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_product_submissions_location ON product_submissions(state, city, zip_code);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_submissions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for product_submissions
CREATE TRIGGER update_product_submissions_updated_at 
  BEFORE UPDATE ON product_submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_product_submissions_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON product_submissions TO authenticated;
GRANT SELECT ON product_submissions TO anon;

-- Insert some sample data for testing
INSERT INTO product_submissions (name, description, website, contact_number, email, city, state, status) VALUES
  ('Pawsome Pet Supplies', 'Premium dog food and treats made with natural ingredients', 'https://pawsomepets.com', '555-0123', 'info@pawsomepets.com', 'Austin', 'TX', 'pending'),
  ('Gentle Care Dog Products', 'Specialized products for dogs with sensitive skin and allergies', 'https://gentlecare.com', '555-0456', 'hello@gentlecare.com', 'Portland', 'OR', 'pending'),
  ('Bark & Play Toys', 'Durable and safe toys for all dog sizes and ages', 'https://barkandplay.com', '555-0789', 'contact@barkandplay.com', 'Denver', 'CO', 'pending')
ON CONFLICT DO NOTHING;
