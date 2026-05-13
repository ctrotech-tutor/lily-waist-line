Read `AGENTS.md` before starting.

We are building the product rendering system for the Lily Waist Line shop page.

This is where customers visually browse products.

Follow:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create:

- `components/shop/product-grid.tsx`
- `components/shop/empty-products-state.tsx`
- `components/shop/load-more-products.tsx`

Use the existing product card component already created.

Do not rebuild the product card.

Do not fetch backend data yet.

Do not connect Supabase yet.

This task is UI architecture only.

---

# UI Primitive Rules

Before building:

Inspect:

- `package.json`
- `components/ui/*`

Use existing shadcn primitives whenever appropriate.

Do NOT rebuild primitives.

Do NOT modify generated `components/ui/*`.

Use app-level composition only.

---

# Purpose

This is the main shopping experience.

Customers must be able to:

- browse products
- compare products
- add products to cart later
- save products to wishlist later

This layout must feel:

- premium
- luxurious
- editorial
- conversion-focused

Not marketplace-like.

---

# Product Grid

Create:

`components/shop/product-grid.tsx`

---

## Requirements

Use the existing product card component.

Render sample waist trainer products using local mock data.

Examples:

- Classic Sculpt Waist Trainer
- Core Fit Waist Trainer
- Elite Shape Waist Trainer
- Signature Sculpt Collection

Mock data should remain easy to replace later with backend data.

---

## Responsive Grid

---

### Mobile

2 columns.

Must remain clean.

No overflow.

---

### Tablet

2–3 columns.

Balanced spacing.

---

### Desktop

4 columns.

Luxury editorial spacing.

Strong alignment.

---

# Loading States

If products are loading:

Use the existing skeleton components.

Do not create new loading systems.

Use:

- product card skeleton
- section skeleton when needed

Layout must never shift.

---

# Empty State

Create:

`components/shop/empty-products-state.tsx`

---

## Purpose

If no products match filters:

Show a premium empty state.

Not generic.

Include:

---

### Heading

Examples:

No Products Found

---

### Supporting Copy

Examples:

Try adjusting your filters to discover more sculpting essentials.

---

### Reset Action

Use existing shadcn button.

Reset filters action only.

No real logic yet.

---

# Load More

Create:

`components/shop/load-more-products.tsx`

---

## Purpose

Prepare for pagination.

For now:

Use local UI state only.

No backend yet.

---

## Button

Use existing shadcn Button.

Examples:

- Load More
- Discover More

Must follow brand styling.

---

# Styling Rules

Must follow:

- theme tokens only
- design typography
- editorial spacing

No:

- random Tailwind colors
- generic ecommerce templates
- rebuilding design primitives

---

# Responsive Requirements

Must work perfectly across:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

---

# Important Rules

Do:

- reuse product card
- reuse skeletons
- reuse shadcn primitives
- prepare for Supabase integration later

Do NOT:

- fetch backend data
- connect server actions
- add real pagination logic

---

### Check when done

- Components compile without TypeScript errors
- Product cards render correctly
- Skeletons render correctly
- Empty state renders correctly
- Load more renders correctly
- Light mode works
- Dark mode works
- Responsive layouts work
- Components feel premium and production-ready