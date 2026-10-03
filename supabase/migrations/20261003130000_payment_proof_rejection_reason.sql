-- Store a review reason with a rejected proof so the customer can see what needs
-- attention, and keep the explanation tied to the specific proof attempt.
BEGIN;

ALTER TABLE "PaymentProof"
  ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;

COMMENT ON COLUMN "PaymentProof"."rejectionReason" IS
  'Admin-provided explanation for rejecting this individual payment-proof attempt.';

COMMIT;
