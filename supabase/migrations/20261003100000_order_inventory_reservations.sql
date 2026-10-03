-- Reserve product inventory when an order is created, then release it only once.
-- Existing orders keep NULL markers and are not retroactively restocked.
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
  ADD COLUMN IF NOT EXISTS "inventoryReservedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "reservationExpiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "inventoryCommittedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "inventoryReleasedAt" TIMESTAMP(3);

-- NULL values remain allowed so legacy orders and repeated NULLs do not conflict.
CREATE UNIQUE INDEX IF NOT EXISTS "Order_idempotencyKey_key"
  ON "Order" ("idempotencyKey");

CREATE INDEX IF NOT EXISTS "Order_reservationExpiresAt_paymentStatus_fulfillmentStatus_idx"
  ON "Order" ("reservationExpiresAt", "paymentStatus", "fulfillmentStatus");
