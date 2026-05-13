Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Prisma relation handling skills
- Next.js Server Actions patterns
- Supabase Auth session handling
- database constraint optimization

When auth/session behavior or DB patterns may differ across versions:

Verify against latest official documentation:

- https://nextjs.org/docs
- https://www.prisma.io/docs
- https://supabase.com/docs

---

We are now building the **Wishlist Backend System** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Implement a fully functional **wishlist system**:

- add product to wishlist
- remove product
- fetch wishlist
- persist per user
- integrate with product catalog

---

## Core Rule

Wishlist is:

> user-specific persistent data

It must always belong to a logged-in user.

---

## Required Work

---

## 1. Server Actions Layer

Create:

`server/actions/wishlist/`

---

### Actions:

---

#### add-to-wishlist.ts

* validate user session
* validate productId
* prevent duplicates
* insert record

---

#### remove-from-wishlist.ts

* validate user session
* remove item safely

---

#### get-wishlist.ts

* return full wishlist with:

  * product details
  * images
  * pricing

---

## 2. Prisma Query Rules

Use:

WishlistItem model:

* userId
* productId

Enforce:

* composite uniqueness (userId + productId)

---

## 3. Data Fetching Strategy

Wishlist must:

* be server-driven
* avoid client-only persistence
* always reflect DB state

---

## 4. Product Hydration

When fetching wishlist:

Join:

* Product
* ProductImage
* ProductVariant (optional summary)

Return:

> fully usable UI-ready objects

---

## 5. UI Integration Preparation (NO UI YET)

Prepare structure for:

* wishlist page
* wishlist icon state sync
* product card wishlist toggle

BUT do NOT implement UI components here.

---

## 6. Session Enforcement Rules

Wishlist requires:

* authenticated user only

If not logged in:

* reject action or redirect flow

---

## 7. Performance Rules

Ensure:

* single query retrieval
* no repeated product lookups
* no N+1 queries

---

## 8. Data Integrity Rules

Must enforce:

* no duplicate wishlist entries
* safe deletion
* consistent user-product mapping

---

## Important Rules

Do:

* use server actions
* enforce auth strictly
* optimize DB queries
* keep logic centralized

Do NOT:

* store wishlist in localStorage
* allow anonymous wishlist persistence
* duplicate wishlist logic in UI
* bypass Prisma constraints

---

## Check When Done

* add/remove works
* duplicates prevented
* wishlist fetch works
* products hydrated correctly
* auth enforced
* no performance issues

---

## Next Step Preview

👉 Cart Backend System (core commerce engine before checkout)
