Read `AGENTS.md` before starting.

We are building the core product card system for Lily Waist Line.

This is one of the most important reusable UI components in the platform.

It will be reused across:

- Homepage featured products
- Shop page
- Product recommendations
- Wishlist
- Search results
- Related products

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial brand identity.

---

## Goal

Create the reusable product card component.

Create:

`components/store/product-card.tsx`

Do not connect to database or APIs yet.

Use mock props only.

This is UI architecture only.

---

# Component Requirements

The product card must feel:

- premium
- fashion editorial
- modern
- conversion-focused
- mobile-friendly

It must NOT feel like a generic SaaS card.

---

# Props

Design the component to accept:

- product image
- product name
- short product subtitle
- price
- optional original price
- badge label
- stock state
- wishlist state

Make props type-safe.

Use TypeScript interfaces.

Do not use `any`.

---

# Layout

Structure:

---

## Product Image

Large visual area.

Requirements:

- portrait ratio
- editorial fashion presentation
- image fills naturally
- no distortion

Support image hover interactions.

Examples:

- subtle zoom
- subtle glow
- premium transition

No aggressive animations.

---

## Badge

Support optional badges:

Examples:

- Best Seller
- New Arrival
- Limited

Badge should use brand styling.

Do not use default shadcn badge styling.

---

## Product Details

Show:

- product name
- short subtitle
- pricing

Typography should follow design system.

Luxury hierarchy is required.

---

## Pricing

Support:

### Regular pricing

Example:

$49.99

### Sale pricing

Example:

$69.99 → $49.99

Requirements:

- old price should appear subdued
- sale price should stand out

---

## Actions

Include:

### Wishlist button

Use `lucide-react`

Prepare for future interaction state.

Do not connect logic yet.

---

### Quick View button

Prepare UI only.

No modal logic yet.

---

### Add to Cart button

Prepare UI only.

No cart logic yet.

---

# Hover States

Desktop:

Support premium hover interactions:

Examples:

- image zoom
- gold border glow
- action reveal
- elevated depth

Must feel elegant.

No exaggerated motion.

---

# Stock States

Support:

### In Stock

### Low Stock

### Out of Stock

Use theme tokens only.

No random Tailwind colors.

---

# Responsive Requirements

Must work perfectly across:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

Requirements:

- no text clipping
- no button overlap
- no image distortion
- no layout shifts

---

# Demo Data

Create a temporary example usage file for visual testing.

Recommended:

`components/store/product-card-demo.tsx`

Use mock waist trainer product data.

Do not fetch from APIs.

Do not connect database.

---

# Important Rules

Do NOT:

- use placeholder SaaS styling
- use random Tailwind colors
- use soft startup rounded corners
- hardcode widths that break mobile

Do:

- use theme tokens only
- use luxury spacing
- use editorial typography
- maintain visual consistency

---

### Check when done

- Component compiles without TypeScript errors
- Mock data renders correctly
- Hover interactions work
- Responsive layouts work
- Light mode works
- Dark mode works
- Component feels premium and production-ready