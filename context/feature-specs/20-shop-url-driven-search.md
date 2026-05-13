Read `AGENTS.md` before starting.

We are now upgrading the **Shop system to a URL-driven search, filter, and sorting architecture** for Lily Waist Line.

Follow strictly:

* `context/design.md`
* `context/ui-context.md`
* `context/code-standards.md`
* `context/architecture-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Convert the Shop page into a **fully URL-synced filtering system** .

This enables:

* shareable search states
* persistent filters on refresh
* SEO-friendly product discovery
* clean server/client separation

---

## Target URL Structure

Support query-based filtering like:

* `/shop?q=waist`
* `/shop?size=m`
* `/shop?sort=price_asc`
* `/shop?q=latex&size=m&compression=high`
* `/shop?sort=featured`

---

## Supported Query Parameters

### Search

* `q` → product keyword search

### Filters

* `size` → xs, s, m, l, xl
* `compression` → light, medium, high

### Sorting

* `sort` →
  + featured
  + newest
  + price_asc
  + price_desc

---

## Architecture Rules

### MUST USE Next.js App Router tools:

* `searchParams` (server components)
* `useSearchParams()` (client components)
* `useRouter()` (navigation updates)
* `router.replace()` (preferred for filter updates)

---

## State Rules (CRITICAL)

### DO NOT:

* store filters in only local React state
* duplicate URL state and UI state independently
* create separate filter state stores

---

### MUST:

URL is the **single source of truth** .

UI reflects URL.

Any filter change updates URL.

---

## Filter Behavior

---

### 1. Search Input

* updates `q`
* debounced update (optional)
* updates URL instantly or via controlled delay

---

### 2. Size Filter

* updates `size`
* single select

---

### 3. Compression Filter

* updates `compression`
* single select

---

### 4. Sorting

* updates `sort`
* dropdown or select

---

## Navigation Rules

When filters change:

```ts
router.replace("/shop?...params")
````

NOT push (avoid history clutter)

---

## Server vs Client Split

---

### Server Component (Shop Page)

Responsibilities:

* read `searchParams`
* filter mock data (for now)
* pass filtered results to UI

---

### Client Components

Responsibilities:

* update URL params
* control UI interactions
* trigger router.replace()

---

## Data Handling (MVP)

Use mock data only.

Filtering logic must support:

* keyword match (q)
* size match
* compression match
* sorting logic

---

## UX Rules

---

### Must behave like:

* real ecommerce store (Shopify-level UX feel)
* instant feedback
* no page reload flicker
* stable filter state

---

## UI Rules (STRICT)

### MUST:

* use existing Shop components:

  + shop header
  + shop filters
  + shop sort
  + product grid
* use shadcn primitives only
* use theme tokens only
* maintain luxury black & gold identity

---

### MUST NOT:

* introduce new filter UI system
* break existing layout system
* connect backend yet
* store filters only in React state

---

## SEO Benefits

This system allows:

* indexable filtered pages
* shareable product states
* better Google product discovery

---

## Responsiveness

Must work across:

* 320px
* 375px
* 768px
* 1024px
* 1440px

---

## Check When Done

* URL updates correctly on filter change
* refresh retains state
* filters sync with UI
* sorting works via URL
* product grid responds correctly
* no backend dependency
* no UI desync issues
* fully responsive
* production-grade UX feel
