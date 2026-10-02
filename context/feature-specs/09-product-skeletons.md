Read `AGENTS.md` before starting.

We are building reusable loading skeleton components for Lily Waist Line.

These skeletons will be used anywhere product data or homepage content is loading.

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create reusable skeleton loading components.

Create:

- `components/shared/product-card-skeleton.tsx`
- `components/shared/section-heading-skeleton.tsx`

Do not wire them into pages yet.

Only create the components.

---

# Purpose

These skeletons should preserve layout stability while data loads.

They should feel premium and intentional.

Not like default app placeholders.

The emotional goals:

- premium performance
- polished UX
- zero layout shift
- visual consistency

---

# Product Card Skeleton

Create a skeleton version of the product card.

The dimensions and spacing should match the real product card exactly.

Include placeholders for:

---

## Product Image

Large editorial portrait placeholder.

Should match the product image ratio.

Must preserve layout dimensions.

---

## Product Name

Text placeholder.

Should match the approximate width of real product names.

---

## Product Subtitle / Variant

Smaller text placeholder.

---

## Product Price

Shorter placeholder.

---

## CTA Button

Button placeholder.

Same sizing as real CTA.

---

# Section Heading Skeleton

Create a reusable section heading skeleton.

Include:

---

## Eyebrow Label Placeholder

Small line.

---

## Heading Placeholder

Large editorial heading line.

---

## Supporting Text Placeholder

Optional smaller line.

---

# Styling Rules

Skeletons must follow brand styling.

Use:

- theme tokens only
- layered surfaces
- premium spacing

Do NOT:

- use default gray bubble skeletons
- use random Tailwind colors
- use overly rounded placeholders

---

# Shape Rules

Must follow the design system:

- sharp edges
- architectural feel
- no soft pill skeletons

---

# Animation

Use subtle loading animation.

Recommended:

- pulse
or
- shimmer effect

Must feel elegant.

No aggressive animation.

---

# Responsive Requirements

Must work perfectly across:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

Skeleton dimensions must match real responsive layouts.

No layout jumps.

---

# Important Rules

Do:

- match real UI dimensions
- preserve layout rhythm
- keep premium spacing
- support light and dark mode

Do NOT:

- hardcode random widths
- use generic loading designs
- break design consistency

---

### Check when done

- Components compile without TypeScript errors
- Skeleton dimensions match real components
- Light mode works
- Dark mode works
- Responsive layouts work
- Loading states feel premium and production-ready