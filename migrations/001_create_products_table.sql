-- Migration 001: Create products table
-- Run this in Supabase SQL Editor

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Enable Row-Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_products_timestamp();

-- Add comments for documentation
COMMENT ON TABLE products IS 'Product catalog for the online store';
COMMENT ON COLUMN products.id IS 'Unique product identifier (UUID)';
COMMENT ON COLUMN products.name IS 'Product name (max 255 chars)';
COMMENT ON COLUMN products.price IS 'Product price in currency units';
COMMENT ON COLUMN products.description IS 'Detailed product description';
COMMENT ON COLUMN products.image_url IS 'URL to product image in Supabase Storage';
COMMENT ON COLUMN products.category IS 'Product category for filtering';
COMMENT ON COLUMN products.created_at IS 'When product was created';
COMMENT ON COLUMN products.updated_at IS 'When product was last updated';
