# Lily Waist Line — deep review

**Reviewed:** 2026-10-03

**Scope:** Current repository snapshot (`9ce7c10`, shallow clone), selected public pages on `lilywaistline.com`, and static review of auth, orders, payment proof, storage, inventory, admin, migrations, SEO, and deployment setup.
**Initial review boundary:** The initial review made no application/source changes; follow-up implementation status is recorded at the end of this file.

## Executive summary

The storefront has a substantial amount of UI and the TypeScript/Prisma schema currently validate, but several critical paths are not yet reliable enough to treat as production-safe:

1. **Security:** The dependency audit reports a critical Next.js advisory and many high findings. A checked-in Supabase policy grants every authenticated user write access to the public product-image bucket. A later storage-policy migration also appears incompatible with the checked-in text ID schema.
2. **Orders and payments:** Successful orders do not reduce or reserve inventory. Checkout does not enforce enabled/region-appropriate payment methods. PayPal configuration can be lost or ignored, payment details are not shown on the proof-upload page, and rejecting a proof leaves no working retry path.
3. **Account and record integrity:** Profile email changes update Prisma but not Supabase Auth; phone is validated but not saved. Account deletion removes cascading order history before attempting an Auth-admin deletion on a user-scoped client, then reports success even if Auth deletion fails. Orders reference mutable address/product records rather than preserving a full shipping/item snapshot.
4. **Release safety:** The declared Prisma deploy workflow has no standard Prisma migration folders to apply, SQL snapshots disagree, and the sitemap queries the database during build. The local production build reached prerendering but failed at `/sitemap.xml` because the dummy database was unreachable.
5. **Business truthfulness and unfinished work:** Shipping claims disagree with the actual fixed `$10` charge; promo codes do not change totals; the tax label is not backed by tax calculation; several newsletter/admin buttons are placeholders.

**Recommended first moves:** close the storage and dependency risks, make order creation/inventory/payment behavior authoritative on the server, repair proof retries and email-delivery reporting, then establish a reproducible database migration/build/test pipeline. Reconcile live pricing/policy promises before accepting more orders.

## Findings

Severity is about the likely impact if the checked-in behavior is deployed. Items marked **conditional** need production configuration or database verification; I did not have access to the live database, Supabase policy state, or deployment environment variables.

### Critical / High

#### H-01 — Installed dependency set has critical/high security advisories

- **Evidence:** `package.json:33-41, 49-62` pins `next` at `16.2.6`, uses `nodemailer ^8.0.7`, and lists `shadcn ^4.7.0` as a production dependency. The lockfile resolves Prisma packages at `7.8.0`.
- **Check:** `npm audit --omit=dev` returned **29 findings: 1 critical, 20 high, 5 moderate, 3 low**. `next@16.2.6` is reported critical; the audit suggested `next@16.3.8`. `nodemailer@8.0.7` is reported high, with the suggested fix at `10.0.13` (a major upgrade). Prisma is also reported high; npm's suggested `6.19.3` is a major downgrade from the app's Prisma 7 line, so do not blindly run `npm audit fix --force`.
- **Impact:** This is an urgent supply-chain/runtime risk. Some Next advisories depend on enabled surfaces (for example, image/OG handling), but the installed release is still inside multiple vulnerable ranges.
- **Work:** Review the advisories against the deployed runtime and upgrade Next plus `eslint-config-next` together; test the Nodemailer major upgrade; identify a supported patched Prisma 7 release or a deliberate migration path. Move the `shadcn` CLI to development-only dependencies if it is only used for authoring. Re-run the full audit after changes.

#### H-02 — Any authenticated customer can write to the public product-image bucket

- **Evidence:** `supabase/migrations/20260513004516_setup-storage-buckets.sql:142-174` grants `INSERT`, `UPDATE`, and `DELETE` on `product-images` to `authenticated`; the predicates check the bucket and authenticated role, not an admin role or product ownership.
- **Impact:** A normal signed-in account can consume public storage and, if it knows an object path, overwrite or remove storefront product media. This is an integrity and storage-abuse risk. The same migration also allows customers to update/delete their own payment-proof objects after submission, which can undermine review or leave a database record pointing at a missing/changed file.
- **Work:** Verify the deployed Supabase policies first. Restrict product-image writes to an admin/service-role path; for payment proofs, make customer upload append-only and reserve replacement/deletion for a deliberate, state-checked workflow.

#### H-03 — The later storage-policy migration appears to compare `text` IDs with UUIDs

- **Evidence:** `prisma/schema.prisma:51-53, 184-186, 209-225` declares user and order foreign-key IDs as Prisma `String` with no `@db.Uuid` mapping. The initial storage migration casts `auth.uid()::text`; `supabase/migrations/20260527100455_update-storage-policies-uuid.sql.sql:31-67, 86-115` compares `"userId"`/`id` directly to `auth.uid()` and labels it a UUID comparison.
- **Impact:** On the schema defined in this repository, PostgreSQL normally stores these Prisma strings as text; `text = uuid` has no implicit equality operator. The policy migration may fail to apply, leaving old policies active or storage uploads broken. The actual deployed schema/history is unknown.
- **Work:** Check Supabase migration history and `information_schema` in staging/production. Align the column types and casts, then run the migration on a clean disposable database and test upload/read access as customer and admin.

#### H-04 — Orders do not reserve or decrement stock; stale/inactive cart items can still be ordered

- **Evidence:** `server/actions/order/create-order.ts:82-102` reads cart stock and checks it against quantity, but the transaction never updates `ProductVariant.stockQuantity`; it only clears cart rows at about line 181. The product selection does not include `status`, and the action does not re-check that the product is `ACTIVE`. `verify-payment.ts` changes payment status but does not decrement stock either.
- **Impact:** Every successful order leaves inventory unchanged. Multiple customers can buy the same last unit, and concurrent/double submissions can both read the same cart/stock before either finishes. An item added while active can remain orderable after the product is archived. Low-stock figures therefore do not reflect sales.
- **Work:** Decide whether inventory is reserved at order placement or deducted on verified payment, and how unpaid reservations expire/cancellations restore stock. Implement an atomic conditional update/locking strategy and idempotency key; re-check product status, quantity, price, and ownership inside the same transaction.

#### H-05 — Payment configuration and checkout can send a customer to the wrong recipient or strand the order

- **Evidence:** `server/actions/payment/get-payment-config.ts:12-19` returns `paypalEmail` but omits `paypalHandle`; `hooks/admin/use-admin-settings.ts` uses this result to populate the settings UI, which reads the missing handle as blank. Saving can therefore clear a configured handle. `update-payment-config.ts:57-89` allows either a PayPal email or handle, but `send-payment-instructions.ts:81-86` builds a PayPal.me URL from the handle only and falls back to the hard-coded `lilywaistline` handle. `create-order.ts:58-66` validates only the enum and creates the order without checking whether that method is enabled. `send-payment-instructions.ts:60-68` later requires an enabled config and can fail after the order already exists. `components/checkout/payment-method-selector.tsx:17-31` hard-codes both methods; the separate region-validation action is not called by checkout.
- **Impact:** Saving settings can lose the PayPal.me value; email instructions may point at the wrong PayPal account; disabled methods can still create orders that cannot receive instructions. Cash App/PayPal region labels are not enforced server-side.
- **Work:** Return `paypalHandle`, validate both PayPal fields, and generate a link from the configured handle (or provide a supported email-payment flow). Load available methods from config, enforce enabled/region rules in the order action, and show the exact recipient and amount on the confirmation/proof page before order completion.

#### H-06 — A rejected payment proof can be re-uploaded but can never be reviewed

- **Evidence:** `app/(site)/order/payment-proof/[orderId]/payment-proof-upload-client.tsx:54-95` only special-cases `PAID`, so a `REJECTED` order still displays the uploader. `app/api/uploads/payment-proof/route.ts:74-84` checks ownership but not order payment status. `server/actions/admin/orders/verify-payment.ts:50-65` refuses verification unless the order is `PENDING`; rejection changes it to `REJECTED` and fulfillment to `CANCELLED`. `components/admin/order/admin-payment-review.tsx` only shows review buttons for `PENDING` orders.
- **Impact:** The customer is invited to submit another screenshot, but the admin cannot approve it. The proof can remain pending indefinitely and the user has no route to finish payment.
- **Work:** Define an explicit retry state machine (for example, allow a replacement proof while payment remains retryable, or create a new payment attempt/order) and apply the same transition rules to the page, upload endpoint, and admin action.

#### H-07 — Email delivery failures are swallowed while the UI reports success

- **Evidence:** `lib/services/email/email-service.ts:10-18, 108-117` returns no delivery result from `sendEmailAsync`; `sendEmail` can return `{success:false}` when SMTP is absent/failing, but the helper catches/logs and resolves. `server/actions/payment/send-payment-instructions.ts` then returns success, and `components/order/payment-next-step.tsx:32-42` shows “Payment instructions sent.” Signup and password recovery also rely on the custom SMTP path (`server/actions/auth/signup.ts`, `forgot-password.ts`, and `email-triggers.ts`). SMTP variables are optional in `lib/env/env.server.ts`.
- **Impact:** The app can tell a customer to check email when no email was delivered. For signup, custom verification mail is necessary; for manual payment, the email may be the only place the merchant handle/link is supplied. This can block account activation or payment without a useful retry/error.
- **Work:** Return and act on the provider's send result, make email configuration a launch check, provide an on-page payment fallback, and add durable retry/outbox or provider-webhook monitoring for transactional mail. Avoid logging “sent successfully” when only an attempt was made.

#### H-08 — Profile email changes drift from Supabase Auth; phone is silently discarded

- **Evidence:** `server/actions/account/index.ts:27-77` validates `fullName`, `email`, and `phone`, but the Prisma update writes only `fullName` and `email`; comments explicitly say Auth email changes are not implemented.
- **Impact:** The account page can show a new email while Supabase login/password recovery still uses the old one. Later OAuth/session sync can restore the old Auth email into Prisma. The user also gets a success response even though the submitted phone was not saved.
- **Work:** Make email changes a verified Auth flow and update/sync both systems atomically or through a recoverable state; persist phone or remove it from the form until supported. Add a regression test for login, recovery, and profile display after an email change.

#### H-09 — Account deletion can erase order history and still leave the Auth account active

- **Evidence:** `server/actions/account/index.ts:231-260` blocks only some paid, undelivered orders, deletes the Prisma user first, then calls `supabase.auth.admin.deleteUser()` on the regular user-scoped `createClient()` and logs/ignores deletion errors before returning success. `prisma/schema.prisma:224` cascades user deletion to orders.
- **Impact:** Deleting an account can erase delivered order, payment-proof, shipment, and customer-service history. The Supabase Auth admin endpoint generally requires service-role credentials; if this user-scoped call fails, the customer can still authenticate but their Prisma profile is gone. Pending/unpaid orders can also be cascaded away.
- **Work:** Decide the required financial/chargeback/privacy retention policy. Use a service-role-only deletion workflow with explicit success/failure handling; consider anonymizing the profile while retaining required order records rather than cascading them. Test partial failure and retry behavior.

#### H-10 — Historical orders are linked to mutable addresses and catalog records, not immutable snapshots

- **Evidence:** `prisma/schema.prisma:209-250` stores `Order.addressId` and `OrderItem.productId/variantId`; the order item stores a price snapshot but not a product/variant name snapshot. `server/actions/address/update-address.ts:26-74` edits a saved address in place without checking whether orders reference it. `server/actions/orders/get-order-details.ts:37-66, 99-140` reads the current address, product, and variant relations (despite comments calling the address an immutable snapshot).
- **Impact:** Editing a saved address can retroactively change the shipping destination shown for prior orders; editing a product/variant can rewrite historical item descriptions. `delete-address.ts:48-66` checks only active orders, then may still hit the FK restriction for delivered/cancelled historical orders and return a generic failure.
- **Work:** Snapshot the shipping address and customer-facing product/variant labels on each order at creation. Until then, prevent edits/deletion of addresses referenced by orders and return a clear error.

#### H-11 — The declared Prisma migration workflow is not a reproducible schema history

- **Evidence:** `prisma.config.ts:6-13` points to `prisma/migrations`, but that directory currently contains only root-level `001_add_product_image_storage_fields.sql` and `002_add_performance_indexes.sql`; standard Prisma migration folders (`<timestamp>_name/migration.sql`) are absent. `package.json:13-18` nevertheless exposes `db:migrate:deploy`. The initial review found conflicting root snapshots; the unreferenced stale `init-1.sql` and `schema.sql` have since been removed, while `init.sql` remains the script output and still is not migration history.
- **Impact:** A fresh database and a production database can be materially different, and the declared `migrate deploy` path cannot reliably apply the loose SQL files as migrations. Manual `db push`/SQL edits make future changes difficult to review or roll back.
- **Work:** Reconcile the actual production schema, create a baseline plus ordered Prisma migrations, test deploy from an empty database and from a production-like copy, and stop treating multiple generated SQL snapshots as migration history.

#### H-12 — Build-time sitemap generation requires a reachable database

- **Evidence:** `app/sitemap.ts:5-14` queries Prisma for active products. The local `npm run build` compiled and type-checked but failed prerendering `/sitemap.xml` with Prisma `P1001` because the supplied dummy database at `127.0.0.1:5432` was unreachable.
- **Impact:** This proves the build currently depends on a live/reachable database at sitemap generation time. It does **not** prove production builds fail when a correctly configured database is available, but it makes deployments sensitive to DB availability/migration state on the build worker.
- **Work:** Make sitemap generation dynamic/resilient or provide a safe empty/fallback result, and test a clean production build with the intended deployment environment. Keep DB access out of build if it is not a deliberate requirement.

#### H-13 — Actual shipping price and delivery promises conflict

- **Evidence:** `components/home/why-choose-section.tsx:28-32` promises complimentary express shipping on all orders and 2–3 business days. `app/(site)/shipping/page.tsx:21-28, 175-180` says `$10` flat rate or free over `$100`, 2–3 processing days plus 2–4 US delivery days, and says international rates are calculated at checkout. `lib/services/cart-service.ts:72-73` and `server/actions/order/create-order.ts:126-128` charge a fixed `$10` for every non-empty cart; no threshold or destination calculation is applied.
- **Impact:** Customers can be charged shipping on orders the policy says should be free, while the homepage promises free shipping on all orders. International customers are shown no destination-specific rate despite the policy. The time promise also omits processing time.
- **Work:** Decide the real policy, then use one server-side shipping calculator for cart, checkout, order totals, emails, and policy copy. Do not rely on a client-displayed total.

### Medium

#### M-01 — Payment-proof upload origin check is both brittle and potentially misconfigured (**production-dependent**)

- **Evidence:** `app/api/uploads/payment-proof/route.ts:10-17` allows `getAppUrl()` and checks `source.startsWith(allowedOrigin)`. `lib/utils/app-url.ts` prefers `NEXT_PUBLIC_APP_URL`, then `VERCEL_URL`, then a hard-coded fallback. The live apex domain redirects to `www`, while the live sitemap emitted non-`www` URLs.
- **Impact:** If production `NEXT_PUBLIC_APP_URL` is apex/non-`www` or a Vercel deployment hostname while customers browse `www`, uploads can return 403. Prefix matching is not exact origin validation and can accept lookalike prefixes in some contexts.
- **Work:** Confirm the deployed value and test the upload from the canonical production host. Compare parsed `URL.origin` values against an explicit allowlist; use one canonical public URL and explicitly handle approved preview origins.

#### M-02 — Proof upload is not truly atomic, can orphan objects, and trusts file labels

- **Evidence:** `app/api/uploads/payment-proof/route.ts:36-39, 52-69, 91-150` calls `request.formData()` before enforcing the 10 MB limit, validates MIME/extension rather than file bytes, uploads to Supabase before creating the database row, then checks for a pending proof and inserts inside a transaction. `PaymentProof` has only a normal `(orderId,status,uploadedAt)` index (`prisma/schema.prisma:258-270`), not a uniqueness constraint.
- **Impact:** Oversized authenticated requests are buffered before rejection; spoofed files can pass label-based checks; a DB error or a conflict leaves an orphaned storage object. Two concurrent transactions can both see no pending row under ordinary read-committed isolation and create duplicate pending proofs—the transaction alone does not serialize this check.
- **Work:** Validate file signatures/parse the image, enforce request/body limits before buffering, add a DB-enforced one-pending-proof invariant or locking strategy, rate-limit uploads, and clean up the storage object on database failure/conflict.

#### M-03 — Auth return URLs are not restricted to same-site paths

- **Evidence:** `app/(auth)/login/login-page-client.tsx:18, 48-53` passes query `redirectTo` directly to `router.replace`; `server/actions/auth/google-signin.ts` embeds it into callback `next`; `app/auth/callback/auth-callback-client.tsx:66, 83-115` also calls `router.replace(next)` without validation.
- **Impact:** An attacker can craft a login/OAuth link that sends a user to an external site after authentication (open redirect/phishing). This is not, by itself, proof of session-token disclosure.
- **Work:** Parse and allow only safe relative paths on the same origin; reject protocol-relative URLs, absolute external URLs, control characters, and unexpected schemes in both the login and callback paths.

#### M-04 — Rate-limit helpers are not wired into public actions

- **Evidence:** `lib/security/rate-limiting.ts` uses a process-local `Map`; repository search found no action imports/calls. Signup, resend/reset email, payment-proof upload, order creation, and repeated payment-instruction sends therefore have no application-level shared limit.
- **Impact:** Email floods, brute-force attempts, and storage/DB abuse can reach the app. The in-memory map would not be a reliable distributed limiter on serverless instances even if used.
- **Work:** Use provider-native limits where appropriate plus a shared store/edge limiter keyed by user and/or IP; use generic signup/resend responses to avoid account enumeration. Treat client disabled buttons as UX only.

#### M-05 — Admin customer totals and segmentation are inaccurate

- **Evidence:** `lib/services/admin-service.ts:360-424` does not filter `role: 'CUSTOMER'`, includes only the latest order (`take: 1`), then calls that sum `totalSpent`. `:544-590` sums at most 50 orders on a customer profile. `app/(admin)/admin/customers/page.tsx` derives active/returning stats from the current page of rows.
- **Impact:** Admins can see admin accounts in the customer list, and lifetime spend/VIP/returning labels and page-level KPIs are wrong for customers with multiple orders or beyond the current page.
- **Work:** Filter customers explicitly; calculate lifetime aggregates in SQL/Prisma; compute dashboard totals across the full filtered dataset, not only the visible page.

#### M-06 — One inventory field has two incompatible meanings; price sorting ignores variant prices

- **Evidence:** `components/admin/products/form/product-inventory.tsx:69-82` exposes one “Stock Quantity” field. `create-product.ts:104-115` applies it to every generated size/compression variant; `update-product.ts:239-255` treats it as a total and distributes it across variants. Separately, `lib/services/product-service.ts:118-121` sorts by product `basePrice`, while transformed products display the minimum in-stock variant price around `:244-248`.
- **Impact:** Creating and editing the same product can change total inventory unexpectedly; shoppers can see products out of price order when variants have overrides.
- **Work:** Decide whether stock is per variant or a total and make create/edit use the same model. Sort by the same effective price that is displayed.

#### M-07 — Public quick-view can return non-active products; public product pagination has no cap

- **Evidence:** `server/actions/products/get-quick-view-product.ts:6-34` queries by ID without `status: 'ACTIVE'`. `server/actions/products.ts:9-18, 30-40` exposes public product actions; `ProductService.getProducts` passes caller `limit` directly to Prisma (`lib/services/product-service.ts:64-72, 145-153`) without a runtime maximum.
- **Impact:** Anyone who knows/obtains a draft product ID can request its title, pricing, images, and variants. Unbounded public `limit`/search inputs can produce expensive database responses.
- **Work:** Filter public reads by `ACTIVE`, validate inputs on the server, cap page size/search length, and keep admin preview behind admin authorization.

#### M-08 — Product media changes can leave broken or orphaned files

- **Evidence:** `server/actions/admin/products/delete-product.ts:38-54` removes storage objects before deleting the product; a product referenced by `OrderItem` can fail the database delete after media is already removed. Storage `.remove()` errors are ignored. `update-product.ts:99-101, 172-180` deletes image rows but does not remove corresponding Supabase objects.
- **Impact:** An admin delete can leave a product record with missing images; image replacements/removals can accumulate orphan storage files and cost.
- **Work:** Use a safe soft-delete/archive for order-referenced products, check storage results, and implement a cleanup/reconciliation job that only removes objects after DB state is committed.

#### M-09 — “Clear All Data” leaves Supabase Auth users and storage objects behind

- **Evidence:** `server/actions/admin/settings/clear-all-data.ts:20-33` deletes Prisma payment proofs, orders, customers, products, and image rows, but never deletes Supabase Auth users or Supabase Storage files.
- **Impact:** The UI says all customer/order/product data is removed, but auth identities and uploaded objects remain. Users can still authenticate without a matching Prisma profile; payment proofs/product media remain in storage.
- **Work:** Either rename/document this as a Prisma-only reset or implement an explicit, audited purge with preview, re-auth/typed confirmation, backup, Auth/storage cleanup, and partial-failure reporting. Avoid this action against production until tested.

#### M-10 — Order numbers can collide and admin screens do not consistently use the stored value

- **Evidence:** `lib/utils/order.ts:2-4` uses only the last six UUID hex characters and defaults to the current year. `create-order.ts:132-146` stores that number. `app/(admin)/admin/orders/[orderId]/page.tsx:15-24` regenerates it using the current year; `AdminService.getOrderById` does not select the stored `orderNumber`. `components/admin/orders/admin-orders-table.tsx:98-102` displays the raw UUID instead.
- **Impact:** Six hex characters provide only 24 random bits; approximate birthday-collision probability is 3% by 1,000 orders in one year and 95% by 10,000, causing a unique-key insert failure. After a year changes, the admin detail can display a different year than the stored/customer-facing number.
- **Work:** Use a longer non-guessable suffix or a sequence with a collision-safe constraint, always display the stored `orderNumber`, and add a migration/backfill for legacy orders.

#### M-11 — Signup leaks whether an email already has an account; legacy resend link points at a stale host

- **Evidence:** `server/actions/auth/signup.ts` returns “An account with this email already exists” when `generateLink` detects a duplicate. `server/actions/account/index.ts:166-171` uses `NEXT_PUBLIC_SITE_URL` or a hard-coded `https://lily-waist-line.vercel.app`, rather than the configured `NEXT_PUBLIC_APP_URL`/`getAppUrl()`.
- **Impact:** Signup enables email/account enumeration. The account security-center resend flow can send verification links to an old/non-production hostname.
- **Work:** Keep signup responses generic, rate-limit resend, and use the same canonical URL builder for every auth email path. Verify the Supabase redirect allowlist includes that URL.

#### M-12 — “Buy Now,” promo, and tax presentation are placeholders

- **Evidence:** `components/product/product-purchase-panel.tsx:152-163` implements Buy Now by only adding to cart; `components/checkout/checkout-summary.tsx:60-65, 183-195, 240-264` marks any non-empty promo code as applied while checkout passes `discount={0}` (`app/(site)/checkout/page.tsx:214-220`) and still says “Including taxes.”
- **Impact:** A shopper can be told a code was applied despite receiving no discount; the Buy Now label does not take them to checkout; the total may be interpreted as tax-calculated when no tax line/engine is present.
- **Work:** Implement server-validated promotions and tax/shipping calculations, or remove those controls/claims until ready. Make Buy Now add the item and proceed to checkout.

#### M-13 — Some operations and integrations are visibly unfinished

- **Evidence:** `components/home/newsletter-section.tsx:85-90` only prevents form submission and is currently commented out in `app/(site)/page.tsx`; admin customer note/contact/flag handlers are comments/placeholders in `components/admin/customers/profile/admin-customer-notes.tsx` and `admin-customer-actions.tsx`. `app/api/payments/route.ts` returns “not implemented yet.” The schema/actions do not provide a return/refund case workflow, despite the static returns policy describing provider refunds.
- **Impact:** These controls do not perform the action their labels promise. The current payment workflow is manual and does not have an automated gateway/webhook or return/refund tracking path.
- **Work:** Either remove/label as coming soon, or implement with persistence, permission checks, audit trail, and operational owner. Decide whether manual payments/returns are intentional and make the website copy match.

#### M-14 — SEO and canonical metadata need a consistency pass

- **Evidence:** `app/sitemap.ts:25-31` includes `/orders`, `/wishlist`, and `/cart`; `robots.ts:5-13` only disallows admin/API/auth. `app/(site)/layout.tsx:5-10` sets the section default title to “Shop,” which matches the live homepage title reported as “Shop | Lily Waist Line.” Legal page titles already include the brand while the root template appends it again. Live canonical pages use `www`, while the live sitemap emits non-`www` URLs.
- **Impact:** Auth-only pages are advertised to crawlers, title tags are generic/duplicated, and the sitemap/canonical host can split indexing signals. The host mismatch is also relevant to the upload-origin issue above.
- **Work:** Remove private routes from the sitemap; align all canonicals, `NEXT_PUBLIC_APP_URL`, metadata base, robots, and redirects to one host; use page titles that do not duplicate the template.

### Low / hygiene

#### L-01 — Runtime dependencies are classified as development-only; generated Prisma output is ignored

- **Evidence:** `lib/prisma.ts:1-7` imports `@prisma/adapter-pg` at runtime; `package.json:50,60` puts `@prisma/adapter-pg` and `pg` in `devDependencies`. The custom client output is under ignored `lib/generated/prisma` (`.gitignore`), while `build` is only `next build` and no `postinstall`/`prepare` script explicitly runs `prisma generate`.
- **Impact:** A production install that prunes development dependencies or a clean CI/build that does not auto-generate the custom client can fail at runtime/build. This needs a clean-install deployment test before assuming it is safe.
- **Work:** Move runtime adapter/driver packages to production dependencies and make Prisma generation an explicit, tested build/CI step.

#### L-02 — Project onboarding and automated verification are incomplete

- **Evidence:** `README.md` remains the create-next-app scaffold; there is no tracked `.env.example` or `.github/workflows` CI files. The initial review had no test script/suite; the inventory tranche has since added a focused `test:inventory` script and pure policy/allocation tests, but no DB-backed integration tests. `lib/env/env.server.ts` requires database, Supabase, and public-app-URL variables. `supabase/.temp/*` generated CLI/link state is tracked; `.gitignore` ignores `/scripts/` but not `supabase/.temp`.
- **Impact:** A new developer has no reliable setup/deploy guide; regressions in auth/order/payment are not automatically caught. Generated Supabase state may be stale or environment-specific.
- **Work:** Add a safe env template (names/placeholders only), setup/migration/deploy docs, test scripts and CI for lint/typecheck/test/build/audit; ignore local Supabase state and reconsider ignoring the entire scripts directory.

#### L-03 — Live content does not fully match the checked-in source/policies

- **Evidence:** The live site was spot-checked on 2026-10-03. Its contact page showed a Gmail address while policy pages show `support@lilywaistline.com`; the checked-in contact page uses the support address. The homepage shipping claim conflicts with the shipping policy and server calculation described in H-13.
- **Impact:** Customers may contact an unmonitored address or rely on promises that checkout does not honor; this also suggests production may not be built from the reviewed commit/content.
- **Work:** Confirm the production branch/commit, choose one monitored support address, and reconcile the live copy with the implemented pricing and delivery rules.

## Prioritized work sequence

### 0. Verify the production state (before editing risky migrations)

1. Confirm the production commit, `NEXT_PUBLIC_APP_URL`, `VERCEL_URL`, SMTP variables, Supabase bucket privacy/size settings, and currently deployed storage policies.
2. In staging, test a customer upload from the canonical `www` URL and a rejected-proof retry. Check the actual Prisma column types and Supabase migration history.
3. Make a restorable DB/storage backup before any schema or “Clear All Data” work.

### 1. Close security and revenue blockers

1. Upgrade the vulnerable Next.js release and evaluate Nodemailer/Prisma fixes; re-run audit and test email/image/server-action paths.
2. Replace authenticated-wide product-image writes with admin-only writes; repair/type-check storage policies and test customer/admin access.
3. Define the order/payment/inventory state machine. Enforce active product, allowed/enabled method, region, stock reservation/decrement, idempotency, and email verification on the server.
4. Repair the PayPal configuration mapping/link generation; show payment recipient and fallback instructions in-app; make email delivery failure visible/retriable.
5. Fix rejected-proof retry and add a DB-enforced invariant for pending proof uploads; validate file bytes and clean up failed uploads.
6. Correct account email update and account deletion, including retention/anonymization rules and partial-failure handling.

### 2. Stabilize records and deployment

1. Snapshot shipping address and customer-facing product/variant labels onto orders; stop mutating historical order data through saved-address edits.
2. Create a real Prisma baseline and ordered migration history; test both clean install and upgrade from a production-like schema.
3. Remove the build-time DB dependency from sitemap generation and verify a clean production build with only documented environment variables.
4. Add tests for order totals/inventory, payment state transitions/retries, profile email sync/deletion, storage authorization, and shipping/promo rules. Run them in CI.

### 3. Finish customer/admin workflows and polish

1. Implement or remove newsletter, customer notes/contact/flag, Buy Now, promo/tax, refund/return, and payment API placeholder UI.
2. Correct customer metrics, product stock semantics/price sorting, draft quick-view exposure, product-image cleanup, order number format, private sitemap paths, titles, and canonical host.
3. Replace the scaffold README/PLAN with current setup and operational documentation; ignore local Supabase state and run a clean install/build test.

## Initial review verification and limitations

- `npm run typecheck`: **passed**.
- `npm run lint`: **passed with 7 warnings**.
- `npx prisma validate`: **passed**.
- `npm run build`: compilation/type-checking completed, but prerendering `/sitemap.xml` failed with Prisma `P1001` because the review environment used an unreachable dummy database. Production build behavior remains unverified.
- `npm audit --omit=dev`: **29 findings** as detailed in H-01.
- No tests or CI workflow were found. No production database, Supabase policy state, or Vercel environment variables were inspected. The clone is shallow, so the secret scan covered the current tracked snapshot only—not full Git history. No actual secret was identified in that current-tree scan.

## Implementation progress — 2026-10-03

The first focused implementation batch is now in the local working tree. These changes have **not** been deployed to Vercel or applied to the client’s Supabase project.

- **H-01 partially addressed:** Next.js and `eslint-config-next` are now `16.3.8`; Nodemailer is `10.0.13`; Prisma packages are aligned on stable `7.10.0`; `@prisma/adapter-pg` and `pg` are production dependencies; `shadcn` is development-only. The supported non-forced audit fix also patched `fast-uri` and `baseline-browser-mapping`. `npm audit --omit=dev` now reports **4 high, 0 critical**: `prisma`, `@prisma/config`, `deepmerge-ts`, and `mysql2`. npm’s offered remediation downgrades Prisma 7 to 6.19.3, a breaking change, so that was deliberately not applied. The full dependency tree still reports **25 findings, including 1 critical** in the tooling/development tree; this needs a separate compatibility-focused dependency pass.
- **H-02/H-03 mitigated in source:** added `supabase/migrations/20261003090000_harden-storage-policies.sql`. It keeps product-image reads public but restricts writes to admins, keeps payment proofs private and owner/admin-readable, makes customer proof objects append-only, and uses text casts for user/order IDs. The migration parses as PostgreSQL SQL, but has not been run against a Supabase instance; inspect the live policy catalog and apply to staging before production.
- **H-12/M-14 addressed in source:** `app/sitemap.ts` is dynamic with a database-failure fallback and no longer advertises `/cart`, `/orders`, or `/wishlist`.
- **Validation after changes:** `npm run typecheck` passed; Prisma validation and client generation passed with a dummy database URL; the production build passed with dummy environment variables and an unreachable dummy database; SQL parsing accepted all 45 statements. Lint has 8 warnings and no errors. SMTP delivery, production environment variables, live database behavior, and deployed Supabase policy behavior remain unverified.

The order/inventory correctness tranche is implemented in source, pending migration and staging verification. Configured payment-method enforcement and order-specific payment recipient snapshots are also implemented locally; the rejected-proof retry state machine remains the next product-policy decision.

### Order/inventory correctness tranche — 2026-10-03

- **H-04 implemented in source:** checkout now reserves each variant using conditional, atomic stock decrements in the same transaction as order creation; it verifies active product status, current base/variant prices, cart quantities, address ownership, rejects a total that changed since checkout review, and uses an idempotency key. The checkout copy, order confirmation, and confirmation email explain the 24-hour proof-submission deadline. A submitted-on-time proof clears the deadline but retains the reservation until admin decision. Product creation/update now treat the admin stock field consistently as a total across variants, avoid redistributing stock on a no-op save, lock the product row against concurrent checkout, and block stock/variant changes while an outstanding reservation exists.
- **M-06 partially addressed:** product creation now divides entered total stock across generated variants; editing treats the field as total available units and does not reset variant stock on an unchanged save. Stock/variant changes are blocked while reservations are open. The price-sort/display mismatch and any decision to support per-variant stock entry remain outstanding.
- **Release/commit paths:** added nullable reservation/commit/release timestamps and an idempotency key in Prisma schema plus `supabase/migrations/20261003100000_order_inventory_reservations.sql`. Expiry, unpaid admin cancellation, proof rejection, and account deletion restore stock transactionally with a one-time release marker. Approval commits stock; cancelling a paid order does not auto-restock. Historical orders are not retroactively adjusted; legacy approval performs a fresh conditional stock check.
- **Expiry handling:** added a bearer-protected `/api/cron/release-expired-inventory` endpoint and daily Vercel schedule. Catalog/cart/order/proof paths also perform bounded or per-order expiry sweeps, so customer activity does not depend only on the daily scheduler. `CRON_SECRET` must be configured in Vercel (minimum 32 characters). A quiet site on a once-daily cron can still release stock later than the exact deadline; the configured schedule respects Vercel Hobby's daily limit ([Vercel cron usage/pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing)).
- **Proof upload/state safeguards:** the upload endpoint now checks owner and order state, prevents uploads after expiry/cancellation/payment, extends a valid reservation only when proof creation succeeds, serializes concurrent submissions through the order row, and removes failed-upload objects using the service-role client. Origin checking now compares parsed exact origins and includes the canonical `https://www.lilywaistline.com` host. Expired/rejected/cancelled orders no longer display an uploader; pending proof pages show the review state. The unused `server/actions/admin/payment-proofs.ts` alternate status path (no source callers found) was removed so it cannot mark payments paid without inventory handling. **The complete rejected-proof retry flow remains unresolved:** this tranche directs the customer to place a new order; a dedicated retry/payment-attempt state machine remains for the next payment stage.
- **Account deletion:** now locks the user row against concurrent checkout, blocks deletion for active paid orders, and releases outstanding unpaid reservations before cascading order deletion. The existing Supabase Auth deletion failure/retention issues in H-09 are not otherwise fixed.
- **Operational notes:** see `docs/order-inventory-reservations.md` for migration-before-deploy ordering, Vercel setup, legacy behavior, and staging checks. Migration history was not deleted or rewritten; production-applied migration state remains unknown. Removed the unreferenced stale `init-1.sql`/`schema.sql` snapshots and generated `.VSCodeCounter/` reports after repository-wide reference checks; retained `init.sql` (still produced by the existing script), all migration files, and `supabase/.temp` (the local project-link state may be useful for future deployment verification).
- **Validation at this tranche checkpoint:** `npm run test:inventory` passed (6 pure tests for 24-hour expiry boundaries and total-stock distribution); `npm run typecheck` passed; `npm run lint` passed with 8 existing warnings and no errors; Prisma format/validate/client generation passed; `npm run build` passed with dummy environment variables and an unreachable dummy DB; PostgreSQL parsing accepted the 3-statement reservation migration. No live database, concurrent checkout, Supabase storage, cron invocation, or production deployment test was available. Do not describe this change as deployed or DB-verified.

### Payment-method enforcement and recipient snapshots — 2026-10-03

- **H-05 implemented in source:** checkout now loads configured methods, only offers enabled methods with valid recipients for the selected shipping region, and the order action independently rechecks the country and live configuration inside the creation transaction. The existing policy is preserved: Cash App for U.S. addresses; PayPal for non-U.S. addresses.
- **Recipient safety:** admin configuration validates Cash App handles, PayPal handles/emails, and saves both method records atomically. Each new order snapshots the recipient and payment link so later settings changes cannot redirect that customer. Confirmation, proof-upload, admin-review, and payment-instructions email use that order snapshot; PayPal email-only configuration is supported without inventing a PayPal.me link or hard-coded recipient. Legacy orders have `NULL` snapshots and are directed to support rather than shown potentially stale live account details.
- **Migrations:** added `supabase/migrations/20261003120000_payment_recipient_snapshot.sql` for nullable `Order.paymentRecipient`/`paymentUrl`, and `supabase/migrations/20261003130000_payment_proof_rejection_reason.sql` for nullable `PaymentProof.rejectionReason`. Apply them after the reservation migration and before deploying code that queries these fields. None has been applied to a database.
- **H-06 partially addressed:** a rejected proof closes the order and releases stock as approved by the reservation policy; the former misleading same-order uploader is removed, and the API also rejects uploads to closed orders. Admin rejection now requires a reason, stored against that proof and shown to the customer/in the rejection email. Customers who already paid are told to contact support before paying or reordering; unpaid customers may create a new order. A same-order retry/re-reservation flow is intentionally not added without the client’s decision on stock reacquisition and retry limits.
- **Validation after payment changes:** `npm test` passed 16 pure tests (inventory timing/allocation, payment-region enforcement, recipient snapshots, rejection-reason validation, and payment email rendering); `npm run typecheck` passed; `npm run lint` passed with 8 pre-existing warnings and no errors; Prisma format/validate/client generation and the production build passed with dummy environment values. The new migrations and lock-query SQL are parsed locally only; no database, concurrent transaction, email-provider, Vercel, or Supabase live behavior has been exercised.
