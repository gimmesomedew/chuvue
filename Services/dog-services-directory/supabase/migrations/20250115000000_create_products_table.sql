-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  sub_categories TEXT[],
  description TEXT,
  price DECIMAL(10,2),
  in_stock BOOLEAN DEFAULT true,
  tags TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products_tags junction table
CREATE TABLE IF NOT EXISTS product_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag_name ON product_tags(tag_name);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products can be created by authenticated users" ON products
  FOR INSERT WITH AUTHENTICATED (true);

CREATE POLICY "Products can be updated by owner" ON products
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Products can be deleted by owner" ON products
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for product_tags
CREATE POLICY "Product tags are viewable by everyone" ON product_tags
  FOR SELECT USING (true);

CREATE POLICY "Product tags can be created by authenticated users" ON product_tags
  FOR INSERT WITH AUTHENTICATED (true);

-- RLS Policies for product_reviews
CREATE POLICY "Product reviews are viewable by everyone" ON product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Product reviews can be created by authenticated users" ON product_reviews
  FOR INSERT WITH AUTHENTICATED (true);

CREATE POLICY "Product reviews can be updated by owner" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Product reviews can be deleted by owner" ON product_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Add created_by column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();
