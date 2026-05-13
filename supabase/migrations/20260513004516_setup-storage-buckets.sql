-- =========================================
-- STORAGE BUCKETS SETUP (Lily Waist Line)
-- Payment Proofs + Product Images
-- =========================================

-- =========================================
-- 1. PAYMENT PROOFS BUCKET (PRIVATE)
-- =========================================
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'payment-proofs',
  'payment-proofs',
  false,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- PAYMENT PROOFS POLICIES
-- =========================================

-- Enable RLS (safe if already enabled)
-- Note: This requires superuser privileges, which we have during migration
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Customers upload only to their own order folders
CREATE POLICY "Customers can upload payment proofs for their orders"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'orders'
  AND (storage.foldername(name))[2] IN (
    SELECT o.id
    FROM "Order" o
    WHERE o."userId" = auth.uid()::text
  )
);

-- Customers view own payment proofs
CREATE POLICY "Customers can view own payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (storage.foldername(name))[1] = 'orders'
  AND (storage.foldername(name))[2] IN (
    SELECT o.id
    FROM "Order" o
    WHERE o."userId" = auth.uid()::text
  )
);

-- Admins can view all payment proofs
CREATE POLICY "Admins can read all payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND EXISTS (
    SELECT 1
    FROM "User" u
    WHERE u.id = auth.uid()::text
    AND u.role = 'ADMIN'
  )
);

-- Customers can update own payment proofs
CREATE POLICY "Customers can update own payment proofs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (storage.foldername(name))[1] = 'orders'
  AND (storage.foldername(name))[2] IN (
    SELECT o.id
    FROM "Order" o
    WHERE o."userId" = auth.uid()::text
  )
)
WITH CHECK (
  bucket_id = 'payment-proofs'
  AND (storage.foldername(name))[1] = 'orders'
  AND (storage.foldername(name))[2] IN (
    SELECT o.id
    FROM "Order" o
    WHERE o."userId" = auth.uid()::text
  )
);

-- Customers can delete own payment proofs
CREATE POLICY "Customers can delete own payment proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (storage.foldername(name))[1] = 'orders'
  AND (storage.foldername(name))[2] IN (
    SELECT o.id
    FROM "Order" o
    WHERE o."userId" = auth.uid()::text
  )
);

-- =========================================
-- 2. PRODUCT IMAGES BUCKET (PUBLIC)
-- =========================================
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- PRODUCT IMAGES POLICIES
-- =========================================

-- Public read access
CREATE POLICY "Public read access for product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Authenticated upload
CREATE POLICY "Authenticated upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Authenticated update
CREATE POLICY "Authenticated update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Authenticated delete
CREATE POLICY "Authenticated delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);