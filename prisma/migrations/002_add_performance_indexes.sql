-- Performance Optimization Indexes for Lily Waist Line
-- Compatible with Supabase migrations
-- Removed CONCURRENTLY because migrations run in transactions


-- =========================================
-- PRODUCT INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_product_status_created_at"
ON "Product" ("status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_product_base_price"
ON "Product" ("basePrice");

CREATE INDEX IF NOT EXISTS "idx_product_name_search"
ON "Product"
USING gin (
  to_tsvector(
    'english',
    COALESCE("name", '') || ' ' ||
    COALESCE("description", '') || ' ' ||
    COALESCE("shortDescription", '')
  )
);


-- =========================================
-- PRODUCT VARIANT INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_variant_product_size_compression"
ON "ProductVariant" ("productId", "size", "compressionLevel");

CREATE INDEX IF NOT EXISTS "idx_variant_stock_product"
ON "ProductVariant" ("stockQuantity", "productId")
WHERE "stockQuantity" > 0;

CREATE INDEX IF NOT EXISTS "idx_variant_size_stock"
ON "ProductVariant" ("size", "stockQuantity")
WHERE "stockQuantity" > 0;

CREATE INDEX IF NOT EXISTS "idx_variant_compression_stock"
ON "ProductVariant" ("compressionLevel", "stockQuantity")
WHERE "stockQuantity" > 0;


-- =========================================
-- PRODUCT IMAGE INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_image_product_type_sort"
ON "ProductImage" ("productId", "imageType", "sortOrder");

CREATE INDEX IF NOT EXISTS "idx_image_variant_type_sort"
ON "ProductImage" ("variantId", "imageType", "sortOrder")
WHERE "variantId" IS NOT NULL;


-- =========================================
-- CART INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_cart_user_created"
ON "CartItem" ("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_cart_variant_user"
ON "CartItem" ("variantId", "userId");


-- =========================================
-- ORDER INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_order_user_created"
ON "Order" ("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_order_payment_status"
ON "Order" ("paymentStatus", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_order_fulfillment_status"
ON "Order" ("fulfillmentStatus", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_order_created_status"
ON "Order" ("createdAt" DESC, "paymentStatus", "fulfillmentStatus");


-- =========================================
-- ORDER ITEM INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_order_item_order_product"
ON "OrderItem" ("orderId", "productId");

CREATE INDEX IF NOT EXISTS "idx_order_item_variant"
ON "OrderItem" ("variantId");


-- =========================================
-- PAYMENT PROOF INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_payment_proof_order_status"
ON "PaymentProof" ("orderId", "status", "uploadedAt" DESC);


-- =========================================
-- SHIPMENT INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_shipment_order_status"
ON "Shipment" ("orderId", "shippedAt" DESC)
WHERE "shippedAt" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_shipment_tracking"
ON "Shipment" ("trackingNumber")
WHERE "trackingNumber" IS NOT NULL;


-- =========================================
-- WISHLIST INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_wishlist_user_created"
ON "WishlistItem" ("userId", "createdAt" DESC);


-- =========================================
-- ADDRESS INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_address_user_default"
ON "Address" ("userId", "isDefault" DESC, "createdAt" DESC);


-- =========================================
-- USER INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_user_role_created"
ON "User" ("role", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_user_search"
ON "User"
USING gin (
  to_tsvector(
    'english',
    COALESCE("email", '') || ' ' ||
    COALESCE("fullName", '')
  )
);


-- =========================================
-- PARTIAL INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_product_active_status_price"
ON "Product" ("status", "basePrice")
WHERE "status" = 'ACTIVE';

CREATE INDEX IF NOT EXISTS "idx_variant_active_product_stock"
ON "ProductVariant" ("productId", "stockQuantity" DESC)
WHERE "stockQuantity" > 0;

CREATE INDEX IF NOT EXISTS "idx_product_active_only"
ON "Product" ("createdAt" DESC, "slug", "basePrice")
WHERE "status" = 'ACTIVE';

CREATE INDEX IF NOT EXISTS "idx_variant_in_stock_only"
ON "ProductVariant" (
  "productId",
  "size",
  "compressionLevel",
  "stockQuantity" DESC
)
WHERE "stockQuantity" > 0;

CREATE INDEX IF NOT EXISTS "idx_order_pending_payment"
ON "Order" ("createdAt" DESC, "userId")
WHERE "paymentStatus" = 'PENDING';

CREATE INDEX IF NOT EXISTS "idx_shipment_active"
ON "Shipment" (
  "orderId",
  "shippedAt" DESC,
  "deliveredAt" DESC
)
WHERE "shippedAt" IS NOT NULL
AND "deliveredAt" IS NULL;


-- =========================================
-- ADMIN DASHBOARD INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "idx_order_admin_filters"
ON "Order" (
  "createdAt" DESC,
  "paymentStatus",
  "fulfillmentStatus",
  "userId"
);


-- =========================================
-- INDEX DOCUMENTATION
-- =========================================

COMMENT ON INDEX "idx_product_name_search"
IS 'Full-text product search optimization';

COMMENT ON INDEX "idx_user_search"
IS 'Full-text user search optimization';

COMMENT ON INDEX "idx_product_active_status_price"
IS 'Optimizes active product filtering';

COMMENT ON INDEX "idx_variant_active_product_stock"
IS 'Optimizes in-stock product variant queries';

COMMENT ON INDEX "idx_order_admin_filters"
IS 'Optimizes admin order filtering';

COMMENT ON INDEX "idx_product_active_only"
IS 'Partial index for active products';

COMMENT ON INDEX "idx_variant_in_stock_only"
IS 'Partial index for in-stock variants';

COMMENT ON INDEX "idx_order_pending_payment"
IS 'Partial index for pending payments';

COMMENT ON INDEX "idx_shipment_active"
IS 'Partial index for active shipments';