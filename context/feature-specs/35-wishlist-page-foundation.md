Read `AGENTS.md` before starting.

We are now building the **Wishlist Page Foundation** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the standalone **Wishlist UI system** where authenticated users will eventually manage saved products.

This is:

> UI only

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- Authentication
- Cart logic

yet.

Use local mock data only.

---

## Route

Create:
`/wishlist`


Use the existing App Router structure.

---

## Components To Create

Create:

---

### 1. Wishlist Header

File:
`components/wishlist/wishlist-header.tsx`


Must include:

- editorial heading:
  - “Your Wishlist”

- supporting copy

Example:

> Save the pieces you love and return anytime.

Luxury editorial tone.

---

### 2. Wishlist Item Card

File:
`components/wishlist/wishlist-item-card.tsx`


Purpose:

Display a saved product.

Must support:

- product image
- product name
- short luxury tagline (optional)
- product price
- stock status

Actions:

---

### Primary

> Add to Cart

---

### Secondary

> Remove

Use:

- existing product visual style
- `lucide-react` icons where appropriate

Must visually align with existing product-card system.

---

### 3. Empty Wishlist State

File:
`components/wishlist/empty-wishlist-state.tsx`


If user has no wishlist items:

Show:

- premium empty state
- supportive copy

Example:

> Your saved favorites will appear here.

Include CTA:

> Continue Shopping

CTA should point to:
`/shop`

---

## Page Behavior

Support two states using mock data:

---

### State A — Empty

Render:

- empty-wishlist-state

---

### State B — Saved Products

Render:

- wishlist-header
- wishlist item cards

Use local mock product data.

---

## Layout Rules

---

### Desktop

Use:

- centered container
- product grid or stacked cards

2–4 columns depending on viewport.

---

### Mobile

Use:

- single column or 2-column product flow
- touch-friendly spacing

No overflow.

---

## UI Primitive Rules

Use existing shadcn primitives where needed:

- Card
- Button
- Badge

Do NOT rebuild primitives.

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must use:

- theme tokens only
- luxury typography
- editorial spacing
- gold-accent interactions

Do NOT use:

- raw colors
- default ecommerce styling

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

- build reusable wishlist components
- align visually with product-card system
- prepare for future auth integration

Do NOT:

- connect backend
- persist wishlist state
- connect cart yet

---

## Check When Done

- Wishlist page compiles
- Empty state works
- Saved state works
- Add to Cart button renders
- Remove action renders
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Premium consistency maintained