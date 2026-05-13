Read `AGENTS.md` before starting.

We are now composing the full **Wishlist Page** for Lily Waist Line using the components already built.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Wire the completed wishlist components into the real application route.

This creates:

> A complete wishlist browsing experience

for future:

- authentication
- cart integration
- database persistence

But NOT yet.

---

## Route

Use the existing App Router structure.

Create:
`/wishlist`

---

## Components To Use

Use the components already created.

---

### Navigation

Use existing:

- navbar
- mobile navigation

---

### Wishlist Components

Use:

- wishlist-header
- wishlist-item-card
- empty-wishlist-state

---

### Footer

Use existing footer component.

---

## Page Flow

The page must feel premium and conversion-focused.

---

### 1. Navigation

Use the existing global navigation.

---

### 2. Wishlist State

Support both UI states.

---

## Empty State

If no saved products exist:

Render:

- empty-wishlist-state

CTA:

Navigate to:
`/shop`


---

## Saved State

If products exist:

Render:

---

### Wishlist Header

Introduce saved products.

---

### Wishlist Grid

Render mock saved products.

Use local mock data only.

Do NOT fetch from database yet.

---

### Item Actions

Each item must support:

---

#### Add to Cart

Visual action only for now.

Do NOT connect cart system yet.

---

#### Remove

Visual action only for now.

Do NOT persist removal yet.

---

### Footer

Use existing footer.

---

## Product Data

Use mock local product data.

Data must be easy to replace later with:

- Supabase
- Prisma
- authenticated user wishlist records

---

## Layout Rules

---

### Desktop

Use:

- 2 / 3 / 4 column responsive grid

Depending on viewport.

---

### Mobile

Use:

- single or 2-column layout

Touch-friendly spacing.

No horizontal overflow.

---

## UX Rules

Wishlist should feel:

- aspirational
- premium
- emotionally engaging

This is not just storage.

It should feel like:

> “Your curated collection.”

---

## UI Primitive Rules

Use existing shadcn primitives only.

Do NOT rebuild primitives.

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must use:

- theme tokens only
- editorial spacing
- design typography
- gold-accent interactions

No:

- raw colors
- generic ecommerce grids

---

## Responsiveness

Must support:

- 320px
- 375px
- 768px
- 1024px+
- 1440px+

---

## Important Rules

Do:

- preserve product-card consistency
- keep boundaries clean
- prepare for future cart integration

Do NOT:

- connect backend
- connect auth
- persist wishlist state
- trigger server actions

---

## Check When Done

- Wishlist page compiles
- Navigation works
- Empty state works
- Saved state works
- Shop CTA works
- Add to Cart renders
- Remove renders
- Footer works
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Wishlist feels premium and production-ready
