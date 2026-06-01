-- ============================================
-- Storage Bucket Policies for UUID-based Auth
-- ============================================
-- Update storage policies to work with UUID User IDs
-- Run this AFTER completing the user ID migration
-- ============================================

-- ============================================
-- Payment Proofs Bucket Policies
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Customers can upload payment proofs for their orders" ON storage.objects;
DROP POLICY IF EXISTS "Customers can view own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Customers can update own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Customers can delete own payment proofs" ON storage.objects;

-- Policy: Customers can upload payment proofs for their own orders
CREATE POLICY "Customers can upload payment proofs for their orders" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND auth.role() = 'authenticated'
  AND (
    -- Extract order ID from path: orders/{orderId}/payment-proof/{filename}
    (storage.foldername(name))[1] = 'orders'
    AND (storage.foldername(name))[2] IN (
      SELECT o.id 
      FROM "Order" o 
      WHERE o."userId" = auth.uid()  -- UUID comparison
    )
  )
);

-- Policy: Customers can view their own payment proofs
CREATE POLICY "Customers can view own payment proofs" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'payment-proofs' 
  AND (
    -- Extract order ID from path: orders/{orderId}/payment-proof/{filename}
    (storage.foldername(name))[1] = 'orders'
    AND (storage.foldername(name))[2] IN (
      SELECT o.id 
      FROM "Order" o 
      WHERE o."userId" = auth.uid()  -- UUID comparison
    )
  )
);

-- Policy: Admins can read all payment proofs
CREATE POLICY "Admins can read all payment proofs" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'payment-proofs' 
  AND (
    SELECT EXISTS (
      SELECT 1 
      FROM "User" u 
      WHERE u.id = auth.uid()  -- UUID comparison
      AND u.role = 'ADMIN'
    )
  )
);

-- Policy: Users can update their own payment proofs (for replacements)
CREATE POLICY "Customers can update own payment proofs" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'payment-proofs' 
  AND (
    -- Extract order ID from path: orders/{orderId}/payment-proof/{filename}
    (storage.foldername(name))[1] = 'orders'
    AND (storage.foldername(name))[2] IN (
      SELECT o.id 
      FROM "Order" o 
      WHERE o."userId" = auth.uid()  -- UUID comparison
    )
  )
) WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND (
    -- Extract order ID from path: orders/{orderId}/payment-proof/{filename}
    (storage.foldername(name))[1] = 'orders'
    AND (storage.foldername(name))[2] IN (
      SELECT o.id 
      FROM "Order" o 
      WHERE o."userId" = auth.uid()  -- UUID comparison
    )
  )
);

-- Policy: Users can delete their own payment proofs
CREATE POLICY "Customers can delete own payment proofs" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'payment-proofs' 
  AND (
    -- Extract order ID from path: orders/{orderId}/payment-proof/{filename}
    (storage.foldername(name))[1] = 'orders'
    AND (storage.foldername(name))[2] IN (
      SELECT o.id 
      FROM "Order" o 
      WHERE o."userId" = auth.uid()  -- UUID comparison
    )
  )
);

-- ============================================
-- User Avatars Bucket Policies
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view avatars" ON storage.objects;

-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-avatars'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text  -- UUID as text
);

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-avatars'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text  -- UUID as text
)
WITH CHECK (
  bucket_id = 'user-avatars'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text  -- UUID as text
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-avatars'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text  -- UUID as text
);

-- Policy: Everyone can view avatars (public profiles)
CREATE POLICY "Everyone can view avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-avatars'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- ============================================
-- Verification: List all storage policies
-- ============================================
-- Simple verification that lists policies from pg_policies instead of storage.policies

SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual IS NOT NULL as has_qual
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;

-- Final message
SELECT 'Storage policies updated successfully for UUID-based authentication!' AS status;