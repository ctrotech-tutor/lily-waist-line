# Order inventory reservation rollout

## Policy now implemented in source

- Checkout reserves stock immediately by atomically decrementing each variant's available `stockQuantity`.
- A new order has a 24-hour deadline (`reservationExpiresAt`) to submit payment proof.
- A proof submitted before expiry clears that deadline; the reservation remains until an admin approves or rejects the proof.
- Approval marks the reservation committed. Rejection, an unpaid admin cancellation, or an unproved expiry releases it exactly once.
- Cancelling a paid order does **not** automatically restock it; any refund/physical-return policy is a separate decision.
- A request key makes checkout retries idempotent. Existing orders are not retroactively treated as reservations.
- Admin-entered stock is a total across the configured variants and is distributed evenly when the total/variant set changes. Stock/variant changes are blocked while a product has an outstanding reservation; unrelated edits and an unchanged stock total remain allowed.

## Deployment order

1. Back up the target database and confirm the deployed schema/table names.
2. Apply `supabase/migrations/20261003100000_order_inventory_reservations.sql` to staging and verify the reservation/idempotency columns and indexes.
3. Apply `supabase/migrations/20261003120000_payment_recipient_snapshot.sql` and verify `Order.paymentRecipient` and `Order.paymentUrl` exist.
4. Apply `supabase/migrations/20261003130000_payment_proof_rejection_reason.sql` and verify `PaymentProof.rejectionReason` exists.
5. Run the concurrency, payment configuration, and state-transition checks below in staging.
6. Set `CRON_SECRET` in the Vercel production environment to a random value of at least 32 characters, then deploy the code. Vercel automatically sends this value in the `Authorization` header with the `Bearer` prefix ([Vercel cron security guidance](https://vercel.com/docs/cron-jobs/manage-cron-jobs)).
7. Verify the cron endpoint is unauthorized without that header and reports a successful sweep with it.

Do not deploy this code before all three new application migrations are applied: checkout, proof upload, and expiry queries use reservation columns; order creation and payment details use the payment snapshot columns; rejected-proof review uses `PaymentProof.rejectionReason`. The migrations intentionally leave historical orders' reservation markers and payment snapshots `NULL`. Approving a legacy pending order attempts an atomic stock check at approval and may require an admin to resolve shortages manually; legacy orders without a payment snapshot must have their recipient confirmed by support rather than reusing today's settings.

## Expiry scheduling

`vercel.json` schedules a daily sweep. Vercel documents that Hobby cron jobs can run only once per day, with up to 59 minutes of timing variance ([Vercel cron usage and pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing)). Product, cart, order-detail, proof-upload, and checkout requests also run bounded expiry sweeps/on-demand expiry, so active catalog traffic releases overdue stock without waiting for the scheduled run. On a quiet site, a daily scheduler can release stock later than the exact 24-hour deadline; do not promise minute-level stock restoration unless the deployment plan/scheduler supports a more frequent schedule.

## Staging verification checklist

1. Set a variant to stock `1`; submit two simultaneous orders with distinct keys. Exactly one should succeed, and stock must never become negative.
2. Submit the same checkout request key twice, including concurrently. Both responses should identify the same order; stock should decrease only once and the cart should clear only for the successful order.
3. Force an order's `reservationExpiresAt` into the past without a proof; call the cron endpoint or a catalog/order request. It should become `CANCELLED`, set `inventoryReleasedAt`, clear its expiry, and restore each ordered unit once. Re-run the sweep; stock must not increase again.
4. Upload proof before expiry. Confirm `reservationExpiresAt` becomes `NULL`; a sweep must not release the order while the proof is pending.
5. Approve the proof; confirm stock stays deducted and `inventoryCommittedAt` is set. Reject the proof or cancel an unpaid reservation; confirm stock is restored once and further upload/approval is blocked.
6. Attempt to order more than available stock and simulate a price change between cart read and reservation. Confirm the transaction creates no order, does not clear the cart, and rolls back all earlier item decrements.
7. Delete a user with an unpaid reservation; confirm stock is restored before its cascading order deletion. Confirm account deletion remains blocked when the user has an active paid order.
8. With a pending proof/reservation, try changing product stock or removing its variant; expect a clear admin error. An unrelated product edit or a no-op save of the unchanged total must not reset per-variant stock.
9. Disable Cash App or PayPal, remove/invalidly configure its recipient, and confirm checkout hides it and the server rejects a forged request. Confirm U.S. addresses can only use configured Cash App and non-U.S. addresses can only use configured PayPal.
10. Place an order with each supported destination and confirm the recipient, exact amount, and link/email-only instructions are shown on confirmation and proof pages. Change the admin recipient afterwards; the existing order and its re-sent email must still use the original snapshot. For legacy orders with null snapshots, confirm the site warns customers not to pay until support verifies the details.
11. Reject a proof with a specific reason. Confirm the reason is required, stored on that proof, included in the email and customer order page, the order is closed and stock released once, and neither the page nor API accepts a replacement proof on that closed order. If the customer already paid, ensure instructions say to contact support before paying or reordering.

Run `npm test` for the focused pure tests covering expiry boundaries, stock distribution, and payment-method availability/destination snapshots. These tests do not exercise Prisma transactions or concurrent database behavior; no production database access was used. The staging checks above remain required before the change is considered deployed or verified.
