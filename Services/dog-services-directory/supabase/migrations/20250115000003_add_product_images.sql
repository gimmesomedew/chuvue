-- Migration: Add product images and screenshot functionality
-- Date: 2025-01-15

-- Add image fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS screenshot_updated_at TIMESTAMP WITH TIME ZONE;

-- Add index for image-related queries
CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url);
CREATE INDEX IF NOT EXISTS idx_products_screenshot_url ON products(screenshot_url);

-- Add comment explaining the fields
COMMENT ON COLUMN products.image_url IS 'URL to product image (user uploaded or manually set)';
COMMENT ON COLUMN products.screenshot_url IS 'URL to website screenshot (automatically generated)';
COMMENT ON COLUMN products.screenshot_updated_at IS 'Timestamp when screenshot was last updated';

-- Grant permissions
GRANT SELECT, UPDATE ON products TO authenticated;
GRANT SELECT, UPDATE ON products TO anon;
