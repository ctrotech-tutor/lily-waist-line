Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Next.js App Router caching strategies
- Prisma query optimization skills
- database indexing knowledge
- server component performance patterns

When caching behavior, rendering strategy, or query optimization differs across versions:

Verify against latest official documentation:

- https://nextjs.org/docs
- https://www.prisma.io/docs
- https://supabase.com/docs

---

We are now building the **Performance Optimization & Caching Layer** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Optimize the entire system for:

- fast shop browsing
- efficient product queries
- reduced database load
- optimized server rendering
- scalable checkout performance

---

## Core Rule

Performance must be:

> server-first and query-aware

Do NOT optimize prematurely on the client.

---

## Required Work

---

## 1. Product Query Optimization

Improve:

- shop queries
- filters
- sorting
- pagination

Ensure:

- indexed fields are used
- minimal joins
- no redundant queries

---

## 2. Database Index Strategy

Ensure indexes exist for:

- userId
- productId
- variantId
- slug
- orderId
- createdAt
- price

Optimize for:

- shop filtering
- admin dashboard
- order retrieval

---

## 3. Server Component Caching

Apply caching where safe:

- product listing pages
- product details pages
- static metadata

Use Next.js caching mechanisms properly.

---

## 4. Revalidation Strategy

Define:

- when product data updates invalidate cache
- when orders invalidate user views
- when admin updates affect frontend

Ensure consistency between:

- server actions
- cached pages

---

## 5. Data Fetch Reduction

Eliminate:

- duplicate Prisma calls
- repeated joins in same request
- unnecessary hydration queries

---

## 6. Image Optimization Strategy

Ensure:

- lazy loading enabled
- optimized Supabase image URLs
- responsive image sizing strategy

---

## 7. Cart Performance Rules

Ensure:

- minimal recalculation queries
- batch product/variant lookups
- avoid repeated stock checks

---

## 8. Admin Dashboard Performance

Optimize:

- order listing queries
- filtering large datasets
- pagination efficiency

---

## 9. API / Server Action Efficiency

Ensure:

- no redundant server calls
- minimal payload transfer
- reuse service layer functions

---

## 10. Frontend Performance Boundaries

Ensure:

- server components used where possible
- client components minimized
- no unnecessary re-renders for static data

---

## Important Rules

Do:

- optimize based on real DB usage
- use indexes properly
- reduce redundant queries
- apply caching only where safe

Do NOT:

- over-cache dynamic checkout flows
- cache sensitive user data incorrectly
- break real-time correctness for performance
- duplicate query logic in multiple layers

---

## Check When Done

- shop loads faster
- product queries optimized
- admin dashboard responsive
- cart performs efficiently
- caching does not break correctness
- DB load reduced
- no duplicate queries

---

## Next Step Preview

👉 Final Production Audit + Deployment Readiness (system verification, cleanup, and launch preparation)
