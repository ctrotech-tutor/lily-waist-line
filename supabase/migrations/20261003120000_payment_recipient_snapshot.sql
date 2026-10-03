-- Preserve the payment destination shown for each order so later admin-setting
-- changes cannot silently redirect a customer's payment.
BEGIN;

ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "paymentRecipient" TEXT,
  ADD COLUMN IF NOT EXISTS "paymentUrl" TEXT;

COMMENT ON COLUMN "Order"."paymentRecipient" IS
  'Recipient displayed when the order was created; snapshot, not a live configuration lookup.';
COMMENT ON COLUMN "Order"."paymentUrl" IS
  'Payment URL displayed when the order was created; null for PayPal-email-only instructions.';

COMMIT;
