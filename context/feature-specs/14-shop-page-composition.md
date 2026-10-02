Read `AGENTS.md` before starting.

We are now composing the full Lily Waist Line shop page using the components already built.

Follow:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Wire the completed shop components into the actual shop page route.

Locate the correct project route for the shop page.

Use the existing routing structure.

Do not change route architecture unless required.

---

# Components To Use

Use the components already created:

---

## Navigation

Use the existing:

- navbar
- mobile navigation

---

## Shop Components

Use:

- shop header
- shop layout
- shop filters
- mobile filter drawer
- shop sort
- product grid
- empty products state
- load more products

---

## Footer

Use the existing footer component.

---

# Page Flow

The page should feel intentional and premium.

Use this structure:

---

1. Navigation

---

2. Shop Header

Introduce the collection.

---

3. Shop Controls

Include:

- mobile filter trigger
- desktop filters
- sorting

---

4. Product Grid

Render sample products.

If loading states are needed:

Use existing skeletons.

---

5. Load More Section

Render after the product grid.

---

6. Footer

---

# Product Data

Use local mock product data for now.

Do not fetch from:

- :contentReference[oaicite:0]{index=0}

yet.

Mock data must remain easy to replace later.

---

# Layout Behavior

---

## Desktop

Use:

Left:

filters

Right:

sorting + product grid

---

## Mobile

Use:

single-column layout

Filters hidden behind mobile drawer.

Sorting remains accessible.

No horizontal overflow.

---

# SEO Basics

Add shop page metadata if needed.

Examples:

### Title

Shop | Lily Waist Line

---

### Description

Discover premium waist trainers designed for confidence, sculpting, and transformation.

---

# UI Primitive Rules

Use existing shadcn primitives.

Do not rebuild any primitives.

Do not modify generated `components/ui/*`.

---

# Styling Rules

Use:

- theme tokens only
- design typography
- editorial spacing

No:

- random Tailwind colors
- generic ecommerce layouts

---

# Responsive Requirements

Must work across:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

---

# Important Rules

Do:

- maintain luxury consistency
- preserve responsive behavior
- keep component boundaries clean

Do NOT:

- connect backend yet
- connect filters to real database queries
- connect server actions yet

---

### Check when done

- Shop page compiles without TypeScript errors
- All components render correctly
- Navigation works
- Filters work
- Sorting works
- Product grid works
- Load more works
- Footer works
- Light mode works
- Dark mode works
- Responsive layouts work
- Shop page feels premium and production-ready