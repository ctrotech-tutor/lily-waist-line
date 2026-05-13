Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- commerce checkout architecture skills
- Next.js Server Actions best practices
- payment workflow modeling
- Prisma transaction handling

When framework behavior, enums, validation, or server actions may differ across versions:

Verify against latest official documentation:

- Next.js official docs
- Prisma official docs

Use payment architecture best practices.

Do NOT over-engineer phase one.

---

We are now building the **Payment Method Integration Layer** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

This phase connects payment method selection to order creation.

---

## Goal

Allow customers to securely choose:

- Cash App
- PayPal

and bind the selected payment method to their order.

---

## Current Business Rule

Phase one uses:

---

### United States Customers

Use:

Cash App

---

### International Customers

Use:

PayPal

---

## Important Clarification

This phase does NOT:

- verify payments automatically
- process payment APIs
- use webhooks
- call external payment SDKs

That comes later.

This phase only:

> stores the selected payment path.

---

## Required Work

---

## 1. Payment Validation Layer

Create:

`lib/validators/payment/`

---

### Validate:

Allowed methods:

* CASH_APP
* PAYPAL

Reject:

* unknown strings
* client tampering

---

## 2. Server Actions Layer

Create:

`server/actions/payment/`

---

### Action:

---

#### select-payment-method.ts

Must:

* validate session
* validate order ownership
* validate selected method
* update order safely

---

## 3. Region-Based Payment Rules

Implement business rules:

---

### If shipping country is:

United States

Allowed:

Cash App

---

### If shipping country is:

Outside United States

Allowed:

PayPal

---

## Critical Rule

Do NOT trust client region claims.

Always derive region from:

> selected shipping address

---

## 4. Order Binding

Selected payment method must be stored on:

Order.paymentMethod

Order.paymentStatus remains:

PENDING

---

## 5. Checkout Integration

Connect to existing checkout UI.

Use:

selected address → derive country → determine payment options

Do NOT rebuild checkout UI.

---

## 6. Safe Error Handling

Handle:

* invalid order
* unauthorized access
* invalid payment method
* region mismatch

Never expose raw backend errors.

---

## 7. Data Integrity Rules

Must enforce:

* only order owner can update payment method
* payment method cannot be changed after payment proof is uploaded (future-safe)

Prepare for this rule.

---

## Important Rules

Do:

* validate server-side
* derive region from saved address
* enforce ownership
* keep payment state consistent

Do NOT:

* call external payment SDKs yet
* use client-side country logic
* trust client enums
* bypass order ownership

---

## Check When Done

* payment method selection works
* US users see Cash App logic
* international users see PayPal logic
* order updates correctly
* payment status remains PENDING
* ownership enforced
* no TypeScript errors

---

## Next Step Preview

👉 Payment Proof Upload System (customer proof submission + storage binding)