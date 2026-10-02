Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Prisma relational querying skills
- Next.js Server Components data fetching patterns
- pagination + filtering best practices
- Supabase Auth session handling

When query performance, relational joins, or data fetching patterns may differ across versions:

Verify against latest official documentation:

- https://www.prisma.io/docs
- https://nextjs.org/docs
- https://supabase.com/docs

---

We are now building the **Customer Orders Backend System** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Allow customers to:

- view all their orders
- view single order details
- track payment status
- track fulfillment status
- see order history clearly

---

## Core Rule

All orders must be:

> user-scoped and server-validated

No customer can access another customer’s order.

---

## Required Work

---

## 1. Server Actions Layer

Create:

`server/actions/orders/`

---

### Actions:

---

#### get-user-orders.ts

Must:

* validate session
* fetch all orders for user
* include summary data
* support pagination

---

#### get-order-details.ts

Must:

* validate session
* validate ownership
* return full order breakdown

Includes:

* order items
* product snapshot
* payment status
* shipping status
* address snapshot

---

## 2. Data Hydration Rules

Order data must include:

---

### Order Summary

* total
* status
* payment method
* created date

---

### Order Detail

* items
* variants
* pricing snapshot
* shipping info
* payment proof status

---

## 3. Security Rules

Must enforce:

* user can only access own orders
* no order ID guessing allowed
* strict ownership validation

---

## 4. Query Optimization

Ensure:

* single query for order list
* optimized joins for order detail
* no N+1 queries
* indexed userId usage

---

## 5. Order Status Visibility

Expose:

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

## 6. Shipping Tracking Integration

Include:

* carrier name
* tracking number
* shippedAt timestamp

---

## 7. UI Integration Preparation (NO UI YET)

Prepare backend data for:

* `/orders` page
* `/orders/[id]` page
* order timeline UI

---

## 8. Data Integrity Rules

Must ensure:

* immutable order history
* snapshot correctness
* no live product mutation affects past orders

---

## Important Rules

Do:

* use server actions
* enforce ownership strictly
* optimize queries
* preserve historical accuracy

Do NOT:

* allow cross-user access
* recompute historical prices from product table
* expose raw DB structure
* skip validation layers

---

## Check When Done

* user orders load correctly
* order detail works
* ownership enforced
* payment + shipping visible
* no query duplication
* no TypeScript errors

---

## Next Step Preview

👉 Admin Order Management System (verification, shipping control, fulfillment operations)
