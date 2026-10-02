Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Supabase Storage upload patterns
- Next.js App Router route handler patterns
- secure multipart upload handling
- Prisma relational consistency

When storage APIs, file upload APIs, or framework behavior may differ across versions:

Verify against latest official documentation:

- Supabase Storage docs
- Next.js official docs
- Prisma official docs

Follow secure upload best practices only.

---

We are now building the **Payment Proof Upload System** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

This phase allows customers to submit payment evidence.

---

## Goal

Allow customers to upload:

> payment screenshots / proof of payment

and attach them securely to their order.

---

## Core Architecture Rule

Because this involves file uploads:

Use:

---

### Route Handlers

Use:

`app/api/uploads/payment-proof/`

Do NOT use server actions for multipart uploads.

---

### Database Updates

Use:

Prisma

---

### File Storage

Use:

Supabase Storage

---

## Required Work

---

## 1. Storage Bucket Setup

Create bucket:

`payment-proofs`

Rules:

* private bucket
* customer upload allowed via backend only
* admin can read

Never public.

---

## 2. Folder Structure

Use:

`orders/{orderId}/payment-proof/`

---

## 3. Upload Route Handler

Create:

`app/api/uploads/payment-proof/route.ts`

Must:

* validate authenticated session
* validate order ownership
* validate file
* upload securely
* create DB record

---

## 4. File Validation Rules

Allow:

* image/png
* image/jpeg
* image/webp

Reject:

* executable files
* unsupported formats
* empty files

---

## Size Limit

Enforce safe upload limits.

Example:

Max 10MB

(Use best practice implementation.)

---

## 5. Database Binding

After upload:

Create:

`PaymentProof` record

Attach to:

`Order`

---

### Initial Status

PENDING

---

## 6. Duplicate Submission Rule

Phase one:

Allow replacement upload if previous proof is:

REJECTED

Do NOT allow duplicate pending submissions.

---

## 7. Ownership Rules

Customers must only upload for:

> their own orders

Must validate:

`order.userId == currentUser.id`

---

## 8. Payment Lock Rule

After proof upload:

Order.paymentStatus remains:

PENDING

Admin will verify later.

---

## 9. Error Handling

Handle safely:

* invalid file
* unauthorized user
* invalid order
* duplicate pending proof
* storage failure

Never expose raw backend errors.

---

## 10. Checkout Integration

Connect to:

existing payment proof UI

Do NOT rebuild frontend.

---

## Security Rules

Must enforce:

* backend-only uploads
* private storage
* ownership validation
* MIME validation
* file size limits

---

## Important Rules

Do:

* use route handlers
* use Supabase Storage
* validate ownership
* keep proofs private

Do NOT:

* use public proof URLs
* trust client order IDs
* allow cross-user uploads
* allow arbitrary file types

---

## Check When Done

* uploads work
* file validation works
* ownership enforced
* proof stored privately
* DB record created
* duplicate pending proofs blocked
* no TypeScript errors

---

## Next Step Preview

👉 Customer Orders Backend (order history + tracking + payment visibility)

