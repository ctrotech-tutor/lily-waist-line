# Comprehensive Fix Plan

---

## 🩺 Diagnosis Summary

### Issue 1: Product Image Upload — PNG Files Fail

**Root Cause:** The MIME type `image/x-png` (legacy format some browsers send) is not in any allowlist. All 6 validation points do exact string match — `image/x-png` fails every check silently.

**Secondary Cause:** No `serverActions.bodySizeLimit` configured. Next.js defaults to ~4MB. PNG images between 4-5MB pass client validation but get dropped by the framework.

**Fix Needed:**
- Add `image/x-png` + extension-based fallback (`file.name` ends with `.png`) to all MIME checks
- Set `serverActions.bodySizeLimit: '6mb'` in `next.config.ts`

**Files Affected:**
- `lib/services/storage-service.ts`
- `server/actions/media/upload-product-image.ts`
- `server/actions/media/upload-temp-image.ts`
- `components/admin/products/form/product-variant-images.tsx`
- `components/admin/products/form/product-main-image.tsx`
- `components/admin/products/form/product-media.tsx`
- `next.config.ts`

---

### Issue 2: Admin Settings — Save Silently Fails

**Bug A (🔴 Critical):** `admin-payment-settings.tsx` calls `updateMutation.mutate()` **twice synchronously** (Cash App then PayPal). `useMutation` does not queue — second call gets silently dropped. Only one config saves.

**Bug B (🟡 Medium):** Cash App handle validation (`$` prefix) does a bare `return` with no toast or error. User clicks Save — nothing happens, no feedback.

**Bug C (🟡 Medium):** The `PaymentConfiguration` table has no migration file. On a fresh database, the table doesn't exist — Prisma throws "relation does not exist".

**Fix Needed:**
- Consolidate into single server action or use sequential `mutateAsync`
- Add toast error for `$` prefix validation
- Generate/migrate the `PaymentConfiguration` table in Supabase

**Files Affected:**
- `components/admin/settings/admin-payment-settings.tsx`
- `server/actions/admin/payment/update-payment-config.ts`
- `prisma/schema.prisma` (verify model exists)

---

### Issue 3: Payment Proof Upload — "Forbidden" Errors

**Cause A — Origin Validation:** API route checks `Origin`/`Referer` against `ALLOWED_ORIGINS`. Preview deployments, staging URLs, non-browser uploads fail with 403.

**Cause B — Supabase RLS Type Mismatch:** Storage bucket RLS INSERT policy compares `auth.uid()` with `Order.userId`. If the UUID migration wasn't applied, the subquery returns no rows — Supabase silently rejects with 403.

**Cause C — Race Condition:** No Prisma `$transaction`. Two simultaneous uploads can both pass the "no pending proof" check, creating duplicate PENDING records.

**Additional Bugs:**
- 🔴 **Transaction reference is dead UX:** `payment-proof-dropzone.tsx` collects `transactionRef` from user but **never sends it**. `PaymentProof` model has no field for it.
- 🟡 **Zod `.cuid()` on UUID field:** Validator says `orderId.cuid()` but order IDs are UUIDs.

**Fix Needed:**
- Improve origin validation for preview deployments
- Run/verify the UUID storage RLS migration in Supabase dashboard
- Wrap upload in Prisma `$transaction`
- Add `transactionRef` field to `PaymentProof` model
- Wire `transactionRef` through dropzone → API → DB
- Display payment handle/email on upload page
- Fix Zod schema validator

**Files Affected:**
- `app/api/uploads/payment-proof/route.ts`
- `components/order/payment-proof-dropzone.tsx`
- `app/(site)/order/payment-proof/[orderId]/payment-proof-upload-client.tsx`
- `prisma/schema.prisma`
- `lib/validators/payment-proof.ts`
- SQL: storage RLS policy for `payment-proofs` bucket

---

### Issue 4: Email Templates — Broken URLs & Placeholders

**Bug A (🔴 Critical):** `payment-instructions.ts` upload URL uses `orderNumber` (e.g., `LWL-2026-A1B2`) instead of `orderId` (UUID). Link in email returns 404.

**Bug B (🔴 Critical):** `payment-rejected.ts` has `{{orderUrl}}` literal placeholder — never replaced. Users see broken template variable.

**Bug C (🟡 Medium):** Hardcoded domain `https://lilywaistline.com` in multiple templates instead of `getAppUrl()`. Breaks on preview/staging.

**Bug D (🟡 Medium):** `orderNumber` stored in DB but always recomputed from UUID. If format changes, old records show wrong numbers.

**Files Affected:**
- `lib/email/temp/payment-instructions.ts`
- `lib/email/temp/payment-rejected.ts`
- `server/actions/payment/send-payment-instructions.ts`
- `server/actions/admin/orders/verify-payment.ts`
- `lib/services/email/email-triggers.ts`
- `lib/email/temp/welcome-email.ts`
- `lib/email/temp/login-alert.ts`
- `lib/email/temp/password-reset-success-email.ts`
- `lib/email/temp/order-confirmation.ts`

---

### Issue 5: Payment Details Display

- Correct PayPal: `https://www.paypal.me/lilywaistline`
- Correct Cash App: `$lydiasaa`
- Already configurable via admin settings → `PaymentConfiguration` table
- Displayed on confirmation page ✅
- **Missing from email templates**
- **Missing from payment proof upload page**
- Transaction/reference ID should be collected

**Files Affected:**
- `lib/email/temp/payment-instructions.ts`
- `app/(site)/order/payment-proof/[orderId]/payment-proof-upload-client.tsx`

---

### Issue 6: Order Number Consistency

- Fallback `"LWL-2024-XXXX"` in `order-details-card.tsx` — wrong year, wrong format
- Fallback `"LWL-XXXX-XXXX"` in `order-confirmation-client.tsx` — different format
- `orderNumber` stored in DB but always recomputed at read time
- Should be read from DB consistently

**Files Affected:**
- `components/order/order-details-card.tsx`
- `app/(site)/order/confirmation/[orderId]/order-confirmation-client.tsx`
- `server/actions/orders/get-order-details.ts`
- `server/actions/orders/get-user-orders.ts`
- `server/actions/payment/send-payment-instructions.ts`
- `server/actions/admin/orders/verify-payment.ts`
- `server/actions/admin/orders/update-fulfillment-status.ts`
- `server/actions/admin/orders/add-tracking-number.ts`
- `prisma/schema.prisma`

---

## 📋 Execution Plan

### Phase 1 — Quick Wins

| # | Task | Impact | Files |
|---|------|--------|-------|
| 1.1 | Add `image/x-png` + `.png` extension fallback to all MIME validators | Fixes PNG uploads | 6 files |
| 1.2 | Add `serverActions.bodySizeLimit: '6mb'` | Fixes large PNG uploads | `next.config.ts` |
| 1.3 | Fix double `mutate` race in admin settings | Fixes settings save | `admin-payment-settings.tsx` |
| 1.4 | Add toast for Cash App `$` validation | Fixes silent failure | `admin-payment-settings.tsx` |
| 1.5 | Consolidate update-payment-config into single upsert | Supports batch save | `update-payment-config.ts` |
| 1.6 | SQL: Run/verify storage RLS UUID migration in Supabase dash | Fixes 403 on upload | SQL (provided) |

### Phase 2 — Payment Proof Upload Overhaul

| # | Task | Impact | Files |
|---|------|--------|-------|
| 2.1 | Add `transactionRef` field to Prisma `PaymentProof` model + SQL | Enable reference capture | `schema.prisma`, SQL |
| 2.2 | Run `prisma generate` | Sync client | CLI |
| 2.3 | Wire `transactionRef`: dropzone → API → DB | Complete dead UX | `dropzone.tsx`, `route.ts` |
| 2.4 | Wrap upload in Prisma `$transaction` | Atomicity, prevent dupes | `route.ts` |
| 2.5 | Show payment handle/email on upload page | Better UX | `payment-proof-upload-client.tsx` |
| 2.6 | Improve origin validation for preview deploys | Reduce false 403s | `route.ts` |
| 2.7 | Fix Zod `.cuid()` → `.uuid()` | Correct validation | `payment-proof.ts` |

### Phase 3 — Email Template Overhaul

| # | Task | Impact | Files |
|---|------|--------|-------|
| 3.1 | Fix upload link: pass `orderId`, use `ROUTE_BUILDERS` | Fix 404 in email | `payment-instructions.ts`, `send-payment-instructions.ts`, `email-triggers.ts` |
| 3.2 | Fix `{{orderUrl}}` placeholder in rejected email | Fix broken link | `payment-rejected.ts`, `verify-payment.ts`, `email-triggers.ts` |
| 3.3 | Replace hardcoded domains with `getAppUrl()` | Fix preview/staging | All email templates |
| 3.4 | Include payment handle/email in email content | Better instructions | `payment-instructions.ts` |
| 3.5 | Add transaction ID instruction to email + upload page | Clearer guidance | `payment-instructions.ts`, upload page |

### Phase 4 — Order Number Consistency

| # | Task | Impact | Files |
|---|------|--------|-------|
| 4.1 | Read `orderNumber` from DB instead of recomputing | Consistency | 6 server actions |
| 4.2 | Fix inconsistent fallback values | Polish | 2 UI components |
| 4.3 | Make `orderNumber` non-optional + generate before creation | Reliability | `schema.prisma`, `create-order.ts`, SQL |
| 4.4 | Run `prisma generate` | Sync client | CLI |
