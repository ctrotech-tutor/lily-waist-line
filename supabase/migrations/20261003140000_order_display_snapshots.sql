BEGIN;

ALTER TABLE "Order"
  ADD COLUMN "shippingFirstName" TEXT,
  ADD COLUMN "shippingLastName" TEXT,
  ADD COLUMN "shippingCompany" TEXT,
  ADD COLUMN "shippingAddressLine1" TEXT,
  ADD COLUMN "shippingAddressLine2" TEXT,
  ADD COLUMN "shippingCity" TEXT,
  ADD COLUMN "shippingState" TEXT,
  ADD COLUMN "shippingPostalCode" TEXT,
  ADD COLUMN "shippingCountry" TEXT,
  ADD COLUMN "shippingPhone" TEXT;

-- Legacy values are best-effort snapshots of the address as it exists at migration time.
UPDATE "Order" AS o
SET
  "shippingFirstName" = a."firstName",
  "shippingLastName" = a."lastName",
  "shippingCompany" = a."company",
  "shippingAddressLine1" = a."addressLine1",
  "shippingAddressLine2" = a."addressLine2",
  "shippingCity" = a."city",
  "shippingState" = a."state",
  "shippingPostalCode" = a."postalCode",
  "shippingCountry" = a."country",
  "shippingPhone" = a."phone"
FROM "Address" AS a
WHERE a."id" = o."addressId";

ALTER TABLE "Order"
  ALTER COLUMN "shippingFirstName" SET NOT NULL,
  ALTER COLUMN "shippingLastName" SET NOT NULL,
  ALTER COLUMN "shippingAddressLine1" SET NOT NULL,
  ALTER COLUMN "shippingCity" SET NOT NULL,
  ALTER COLUMN "shippingState" SET NOT NULL,
  ALTER COLUMN "shippingPostalCode" SET NOT NULL,
  ALTER COLUMN "shippingCountry" SET NOT NULL;

ALTER TABLE "OrderItem"
  ADD COLUMN "productNameSnapshot" TEXT,
  ADD COLUMN "variantSizeSnapshot" TEXT,
  ADD COLUMN "variantCompressionLevelSnapshot" TEXT,
  ADD COLUMN "variantColorSnapshot" TEXT,
  ADD COLUMN "variantSkuSnapshot" TEXT;

-- Legacy values are best-effort snapshots of catalog labels at migration time.
UPDATE "OrderItem" AS oi
SET
  "productNameSnapshot" = p."name",
  "variantSizeSnapshot" = v."size",
  "variantCompressionLevelSnapshot" = v."compressionLevel",
  "variantColorSnapshot" = v."color",
  "variantSkuSnapshot" = v."sku"
FROM "Product" AS p, "ProductVariant" AS v
WHERE p."id" = oi."productId"
  AND v."id" = oi."variantId"
  AND v."productId" = oi."productId";

ALTER TABLE "OrderItem"
  ALTER COLUMN "productNameSnapshot" SET NOT NULL,
  ALTER COLUMN "variantSizeSnapshot" SET NOT NULL,
  ALTER COLUMN "variantCompressionLevelSnapshot" SET NOT NULL,
  ALTER COLUMN "variantSkuSnapshot" SET NOT NULL;

COMMIT;
