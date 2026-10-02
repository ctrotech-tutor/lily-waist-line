Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Prisma transactional query skills
- Next.js Server Actions best practices
- Supabase Auth session handling
- database consistency + constraint design

When transactional behavior, session handling, or ORM patterns may differ across versions:

Verify against latest official documentation:

- https://www.prisma.io/docs
- https://nextjs.org/docs
- https://supabase.com/docs

---

We are now building the **Cart Backend System** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Implement a fully functional **shopping cart system**:

- add to cart
- remove from cart
- update quantity
- fetch cart
- persist per user
- support checkout flow

---

## Core Rule

Cart is:

> transactional user state

It must always be:

- user-specific
- database-backed
- consistent with product stock

---

## Required Work

---

## 1. Server Actions Layer

Create:

`server/actions/cart/`

---

### Actions:

---

#### add-to-cart.ts

Must:

* validate user session
* validate product variantId
* check stock availability
* add or increment quantity

---

#### remove-from-cart.ts

Must:

* validate session
* remove item safely

---

#### update-cart-quantity.ts

Must:

* validate session
* enforce stock limits
* update quantity safely

---

#### get-cart.ts

Must return:

* cart items
* product details
* variant details
* computed totals

---

## 2. Cart Rules (Critical)

Enforce:

---

### Unique Constraint

One user cannot have duplicate variant entries:

(userId + variantId)

---

### Quantity Rules

* minimum = 1
* maximum = stockQuantity

---

### Stock Validation

Cart must never exceed:

> ProductVariant.stockQuantity

---

## 3. Data Hydration Strategy

Cart fetch must include:

* Product name
* Product image
* Variant size
* Variant compression
* Price snapshot

Return:

> fully UI-ready cart object

---

## 4. Pricing Logic

Cart must compute:

* subtotal
* total items
* (shipping will come later)

---

## 5. Session Enforcement

Cart requires authentication:

If not logged in:

* block action
* redirect or error safely

---

## 6. Transaction Safety

Use Prisma transactions where needed:

* add + update stock validation
* quantity updates

Prevent race conditions.

---

## 7. Performance Rules

Ensure:

* minimal DB queries
* batched relations
* no repeated product fetches
* optimized joins

---

## 8. UI Integration Preparation (NO UI YET)

Prepare structure for:

* cart page
* cart drawer (future)
* checkout integration

BUT do NOT build UI here.

---

## Important Rules

Do:

* enforce stock integrity
* use server actions only
* maintain transactional safety
* centralize cart logic

Do NOT:

* use localStorage cart
* allow guest cart persistence (phase one)
* duplicate pricing logic in UI
* bypass stock validation
* trust client-provided totals

---

## Check When Done

* cart add works
* cart update works
* cart remove works
* stock enforcement works
* totals are correct
* no duplicate entries
* fully server-safe

---

## Next Step Preview

👉 Address Backend System (shipping foundation for checkout flow)
