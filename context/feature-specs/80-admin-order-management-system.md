Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Prisma admin query optimization skills
- Next.js Server Actions patterns
- role-based access control enforcement
- transactional update safety

When admin workflows, status transitions, or ORM behavior may differ across versions:

Verify against latest official documentation:

- https://www.prisma.io/docs
- https://nextjs.org/docs
- https://supabase.com/docs

---

We are now building the **Admin Order Management System** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Allow admins to:

- view all orders
- verify payment proof
- approve or reject orders
- update fulfillment status
- assign tracking numbers
- manage shipping lifecycle

---

## Core Rule

Admin actions are:

> authoritative business operations

They override customer-facing state.

Must be fully server-secured.

---

## Required Work

---

## 1. Server Actions Layer

Create:

`server/actions/admin/orders/`

---

### Actions:

---

#### get-all-orders.ts

Must:

* return all orders
* include customer info
* include payment status
* include fulfillment status

Support:

* pagination
* filtering (status, payment state)

---

#### verify-payment.ts

Must:

* validate admin role
* validate order exists
* set payment status:

APPROVED or REJECTED

Must update:

PaymentProof status accordingly.

---

#### update-fulfillment-status.ts

Must:

* validate admin role
* update order status safely

Allowed transitions:

* PENDING → PROCESSING → SHIPPED → DELIVERED

Prevent invalid jumps.

---

#### add-tracking-number.ts

Must:

* attach carrier info
* attach tracking number
* update shipment record

---

## 2. Role Enforcement (Critical)

All admin actions must enforce:

> ADMIN role only

If not admin:

* reject request immediately
* no partial execution

---

## 3. Order Status Control Rules

Must enforce valid transitions:

---

### Payment Status

* PENDING
* PAID
* REJECTED

---

### Fulfillment Status

* PENDING
* PROCESSING
* SHIPPED
* DELIVERED
* CANCELLED

---

## 4. Payment Proof Review Flow

Admin must be able to:

* view uploaded proof
* approve payment → set PAID
* reject payment → set REJECTED

---

## 5. Shipping Workflow

Admin must:

* assign tracking number
* update carrier
* mark shipped/delivered

---

## 6. Data Integrity Rules

Must ensure:

* no duplicate status updates
* no invalid state transitions
* order history remains intact

---

## 7. Query Optimization

Ensure:

* efficient joins for admin dashboard
* minimal DB load per order list
* indexed filtering fields

---

## 8. UI Integration Preparation (NO UI YET)

Prepare backend for:

* admin orders dashboard
* order detail view
* payment verification panel
* shipping management panel

---

## Important Rules

Do:

* enforce admin-only access
* validate state transitions
* use server actions only
* keep operations atomic

Do NOT:

* allow customer-level access
* bypass role checks
* allow invalid status jumps
* mutate unrelated order fields

---

## Check When Done

* admin can view all orders
* payment verification works
* fulfillment updates work
* tracking works
* role enforcement active
* no invalid transitions
* no TypeScript errors

---

## Next Step Preview

👉 Email & Notification System (order confirmations, alerts, and lifecycle communication)
