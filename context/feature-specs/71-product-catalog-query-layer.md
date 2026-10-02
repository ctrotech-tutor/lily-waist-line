Read `AGENTS.md` before starting.

Before implementation:

You must use available agent skills/tools where relevant.

This includes:

- Prisma query optimization skills
- Next.js App Router data fetching patterns
- Supabase Postgres querying behavior
- modern server component data strategies

When query behavior, pagination, filtering, or performance patterns may differ across versions:

Verify against latest official documentation:

- https://www.prisma.io/docs
- https://nextjs.org/docs
- https://supabase.com/docs

---

We are now building the **Product Catalog Query Layer** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Build a **real database-powered product system** for:

- shop page
- product listing
- filters
- sorting
- search
- pagination

This replaces all mock product data.

---

## Core Rule

All product data must now come from:

> Prisma → Supabase PostgreSQL

No mock product usage in production layer anymore.

---

## Required Work

---

## 1. Product Query Service Layer

Create:

`lib/services/product-service.ts`

---

### Responsibilities:

Central product querying logic:

* get products
* filter products
* sort products
* paginate results
* search products

---

## 2. URL-Driven Search System

Must support:

Example URLs:

- `/shop?q=waist`
- `/shop?size=M`
- `/shop?compression=high`
- `/shop?sort=price_asc`
- `/shop?q=latex&size=M&compression=high`

---

### Rules:

* all filters must be derived from URL search params
* no local-only state for filters
* state must be shareable and persistent via URL

---

## 3. Supported Filters

Implement backend query support for:

---

### Search Query

* name
* description
* slug match (optional fuzzy)

---

### Size Filter

* XS
* S
* M
* L
* XL

---

### Compression Filter

* LIGHT
* MEDIUM
* HIGH

---

### Sorting

Support:

* FEATURED
* NEWEST
* PRICE_ASC
* PRICE_DESC

---

### Availability

* in stock only

---

## 4. Pagination System

Implement:

* limit
* offset (or cursor if preferred)

Must support:

> Load More UX

---

## 5. Server Component Data Fetching

Shop page must:

* fetch data on server
* pass results to UI components
* avoid client-only fetching for initial load

---

## 6. Query Optimization Rules

Must ensure:

* minimal DB calls
* indexed fields used (slug, price, createdAt)
* no N+1 queries
* variant data loaded efficiently

---

## 7. Prisma Query Layer

All queries must go through Prisma.

No raw SQL unless necessary.

---

## 8. Data Shape Standardization

Return unified product shape:

* product
* variants
* images
* computed availability

---

## 9. Shop Page Integration

Update:

`app/shop/page.tsx`

The Featured Product Section Of:
`app/page.tsx`

Must:

* read searchParams
* call product service
* render results
* support pagination

---

## Important Rules

Do:

* enforce URL-driven state
* centralize product logic in service layer
* use server components where possible
* keep queries optimized

Do NOT:

* use client-only filtering
* duplicate query logic across files
* bypass Prisma
* reintroduce mock product data
* mix UI state with backend logic

---

## Check When Done

* shop page uses real DB data
* filters work via URL
* sorting works correctly
* pagination works
* search works
* performance is stable
* no mock data leaks
* no duplicated query logic

---

## Next Step Preview

👉 Product Media + Storage System (Supabase image pipeline + variants)