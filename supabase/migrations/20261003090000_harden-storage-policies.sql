-- Harden object access without rewriting previously applied migrations.
-- Product images remain publicly readable, but writes are admin-only.
-- Payment proofs remain private, owner-readable, and append-only for customers.

BEGIN;

-- SECURITY DEFINER lets storage policies check the Prisma-backed role table even
-- if public-table RLS is enabled. Every object reference is schema-qualified and
-- the search path is empty to avoid object-shadowing attacks.
CREATE OR REPLACE FUNCTION public.is_current_storage_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."User" AS storage_user
    WHERE storage_user.id::text = auth.uid()::text
      AND storage_user.role::text = 'ADMIN'
  );
$function$;

CREATE OR REPLACE FUNCTION public.can_access_payment_proof_storage(object_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  WITH path_parts AS (
    SELECT storage.foldername(object_name) AS segments
  )
  SELECT auth.uid() IS NOT NULL
    AND (
      public.is_current_storage_admin()
      OR EXISTS (
        SELECT 1
        FROM public."Order" AS storage_order
        CROSS JOIN path_parts
        WHERE path_parts.segments[1] = 'orders'
          AND path_parts.segments[2] IS NOT NULL
          AND path_parts.segments[3] = 'payment-proof'
          AND storage_order.id::text = path_parts.segments[2]
          AND storage_order."userId"::text = auth.uid()::text
      )
    );
$function$;

REVOKE ALL ON FUNCTION public.is_current_storage_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_access_payment_proof_storage(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_current_storage_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_payment_proof_storage(text) TO anon, authenticated;

-- Enforce the intended bucket settings even if a bucket with the same ID already
-- existed with less restrictive settings.
INSERT INTO storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
VALUES (
  'payment-proofs',
  'payment-proofs',
  false,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Remove the known broad or type-incompatible policies from earlier migrations.
DROP POLICY IF EXISTS "Authenticated upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_insert_guard" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_update_guard" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_delete_guard" ON storage.objects;

DROP POLICY IF EXISTS "Customers can upload payment proofs for their orders" ON storage.objects;
DROP POLICY IF EXISTS "Customers can view own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Customers can update own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Customers can delete own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Customers and admins can read payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_select_guard" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_insert_guard" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_update_guard" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_delete_guard" ON storage.objects;

-- Restrictive guards are intentional: PostgreSQL ANDs restrictive policies with
-- every permissive policy, so an overlooked older permissive write rule cannot
-- reopen access to these two buckets.
CREATE POLICY "product_images_admin_insert_guard"
ON storage.objects AS RESTRICTIVE
FOR INSERT TO PUBLIC
WITH CHECK (
  bucket_id IS DISTINCT FROM 'product-images'
  OR public.is_current_storage_admin()
);

CREATE POLICY "product_images_admin_update_guard"
ON storage.objects AS RESTRICTIVE
FOR UPDATE TO PUBLIC
USING (
  bucket_id IS DISTINCT FROM 'product-images'
  OR public.is_current_storage_admin()
)
WITH CHECK (
  bucket_id IS DISTINCT FROM 'product-images'
  OR public.is_current_storage_admin()
);

CREATE POLICY "product_images_admin_delete_guard"
ON storage.objects AS RESTRICTIVE
FOR DELETE TO PUBLIC
USING (
  bucket_id IS DISTINCT FROM 'product-images'
  OR public.is_current_storage_admin()
);

-- Keep direct authenticated storage access functional for admins; application
-- server actions also use the service role after checking the admin role.
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_current_storage_admin()
);

CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.is_current_storage_admin()
)
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_current_storage_admin()
);

CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.is_current_storage_admin()
);

-- Keep payment-proof reads private even if another permissive read policy exists.
CREATE POLICY "payment_proofs_select_guard"
ON storage.objects AS RESTRICTIVE
FOR SELECT TO PUBLIC
USING (
  bucket_id IS DISTINCT FROM 'payment-proofs'
  OR public.can_access_payment_proof_storage(name)
);

CREATE POLICY "Customers and admins can read payment proofs"
ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND public.can_access_payment_proof_storage(name)
);

-- Customer uploads are restricted to their own order path. The restrictive
-- guard also blocks any other permissive insert rule from bypassing ownership.
CREATE POLICY "payment_proofs_insert_guard"
ON storage.objects AS RESTRICTIVE
FOR INSERT TO PUBLIC
WITH CHECK (
  bucket_id IS DISTINCT FROM 'payment-proofs'
  OR public.can_access_payment_proof_storage(name)
);

CREATE POLICY "Customers can upload payment proofs for their orders"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs'
  AND public.can_access_payment_proof_storage(name)
);

-- Payment proof objects are immutable for customers once uploaded. Admins retain
-- delete access through the review action; replacement uploads use a new path.
CREATE POLICY "payment_proofs_update_guard"
ON storage.objects AS RESTRICTIVE
FOR UPDATE TO PUBLIC
USING (bucket_id IS DISTINCT FROM 'payment-proofs')
WITH CHECK (bucket_id IS DISTINCT FROM 'payment-proofs');

CREATE POLICY "payment_proofs_delete_guard"
ON storage.objects AS RESTRICTIVE
FOR DELETE TO PUBLIC
USING (
  bucket_id IS DISTINCT FROM 'payment-proofs'
  OR public.is_current_storage_admin()
);

CREATE POLICY "Admins can delete payment proofs"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND public.is_current_storage_admin()
);

COMMIT;
