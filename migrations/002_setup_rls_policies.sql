-- Migration 002: Set up Row-Level Security (RLS) Policies
-- Run this in Supabase SQL Editor

-- ============================================
-- PRODUCTS TABLE RLS POLICIES
-- ============================================

-- Policy 1: Allow anyone to READ/SELECT all products (public catalog)
CREATE POLICY "products_select_public" ON products
FOR SELECT
TO public
USING (true);

-- Policy 2: Allow only authenticated admin to INSERT products
CREATE POLICY "products_insert_admin" ON products
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Allow only authenticated admin to UPDATE products
CREATE POLICY "products_update_admin" ON products
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Allow only authenticated admin to DELETE products
CREATE POLICY "products_delete_admin" ON products
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE: PRODUCT-IMAGES BUCKET SECURITY
-- ============================================

-- Policy 1: Allow anyone to read images from product-images bucket
CREATE POLICY "product_images_select" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Policy 2: Allow only authenticated user to upload/insert images
CREATE POLICY "product_images_insert" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow only authenticated user to update images (replace)
CREATE POLICY "product_images_update" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow only authenticated user to delete images
CREATE POLICY "product_images_delete" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);
