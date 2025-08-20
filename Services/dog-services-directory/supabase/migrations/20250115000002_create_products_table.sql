-- Create products table for storing product information
CREATE TABLE IF NOT EXISTS products (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6B7280', -- Hex color for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product category mappings table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS product_category_mappings (
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES product_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Insert default product categories
INSERT INTO product_categories (name, description, color) VALUES
  ('Nutritional, Food, Supplements', 'Food and nutritional supplements for dogs', '#10B981'),
  ('Calming', 'Products to help calm anxious dogs', '#8B5CF6'),
  ('Immune Support', 'Products to boost immune system', '#F59E0B'),
  ('Multi-Vitamin Supplements', 'Multi-vitamin products', '#3B82F6'),
  ('Anti-Inflammatory, Anti-Itch', 'Products for inflammation and itching', '#EF4444'),
  ('Skin and Wound Care', 'Products for skin health and wound healing', '#EC4899'),
  ('Teeth and Dental Care', 'Dental hygiene products', '#06B6D4'),
  ('Gear', 'Equipment, toys, and accessories', '#6366F1'),
  ('Red Light Therapy', 'Therapeutic red light products', '#DC2626'),
  ('Other', 'Miscellaneous products', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp for products
CREATE OR REPLACE FUNCTION update_products_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for products
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_products_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT SELECT ON products TO anon;
GRANT SELECT ON product_categories TO authenticated;
GRANT SELECT ON product_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_category_mappings TO authenticated;
GRANT SELECT ON product_category_mappings TO anon;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_location ON products(state, city, zip_code);
CREATE INDEX IF NOT EXISTS idx_products_coordinates ON products(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_products_verified ON products(is_verified_gentle_care);
CREATE INDEX IF NOT EXISTS idx_product_category_mappings_product ON product_category_mappings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_mappings_category ON product_category_mappings(category_id);
