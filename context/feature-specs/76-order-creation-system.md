Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Prisma transaction skills
- commerce data modeling skills
- Next.js Server Actions best practices
- Supabase Auth session handling

When transactional behavior, server actions, or ORM behavior may differ across versions:

Verify against latest official documentation:

- https://www.prisma.io/docs
- https://nextjs.org/docs
- https://supabase.com/docs

Follow production commerce best practices only.

---

We are now building the **Order Creation System** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Create the system that transforms:

> Cart + Selected Address + Payment Choice

into:

> Real Order Records

This powers checkout.

---

## Core Rule

Orders must be created:

> server-side only

Never trust:

- client totals
- client product prices
- client stock values

Everything must be recalculated on server.

---

## Required Work

---

## 1. Server Actions Layer

Create:

`server/actions/order/`

---

### Action:

---

#### create-order.ts

Must:

* validate user session
* fetch cart from database
* fetch selected address
* validate ownership
* validate stock
* compute totals
* create order
* create order items

Use transaction.

---

## 2. Input Requirements

Order creation requires:

---

### Address

Must:

* belong to current user

---

### Payment Method

Allowed:

* CASH_APP
* PAYPAL

Must validate enum.

---

## 3. Server Pricing Rules

Server must recalculate:

---

### For Each Cart Item

Use live DB values:

* product price
* variant availability

---

### Compute:

* subtotal
* shipping fee (placeholder for phase one)
* total

Never trust client numbers.

---

## 4. Stock Validation

Before order creation:

Every cart item must validate:

> requested quantity <= available stock

If stock fails:

Reject order safely.

---

## 5. Order Item Snapshot

Each order item must permanently store:

* product name
* variant details
* unit price
* quantity

So historical orders remain accurate even if product changes later.

---

## 6. Order Status Initialization

New order must start as:

---

### Payment Status

PENDING

---

### Fulfillment Status

PENDING

---

## 7. Cart Cleanup

After successful order creation:

Cart items must be cleared.

Only after transaction success.

---

## 8. Transaction Safety

Must use Prisma transactions for:

* stock validation
* order creation
* order items
* cart cleanup

No partial order states.

---

## 9. Checkout Integration

Connect to existing checkout flow.

Use selected:

* address
* payment method

Do NOT rebuild checkout UI.

---

## 10. Error Handling

Handle safely:

* empty cart
* invalid address
* stock conflicts
* invalid payment method

Never expose raw DB errors.

---

## Important Rules

Do:

* use server actions
* use transactions
* compute pricing server-side
* validate ownership
* snapshot order data

Do NOT:

* trust client totals
* trust client stock
* create partial orders
* bypass session checks
* leave cart uncleared after success

---

## Check When Done

* order creation works
* totals computed correctly
* stock validated
* ownership enforced
* cart clears after success
* order items created
* no race conditions
* no TypeScript errors

---

## Next Step Preview

👉 Payment Method Integration (Cash App + PayPal selection + order binding)
