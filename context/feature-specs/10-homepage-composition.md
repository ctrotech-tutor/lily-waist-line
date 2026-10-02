Read `AGENTS.md` before starting.

We are now composing the Lily Waist Line homepage using the sections and shared components already built.

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Assemble the homepage using the completed components.

Wire everything into the homepage route.

Use the existing project route structure.

Locate the correct homepage route and compose the page there.

---

# Components To Use

Use the existing components already created:

### Navigation

- navbar
- mobile navigation / sidebar

---

### Homepage Sections

- hero section
- featured products section
- why choose section
- newsletter section

---

### Footer

- footer component

---

# Loading Architecture

Use the skeleton components where appropriate.

If product data is not connected yet:

Render:

- section heading skeleton
- product card skeletons

until real data is wired.

For now, static placeholder product data may be used if needed.

The page structure must be ready for real backend integration later.

---

# Homepage Flow

The homepage order should feel premium and intentional.

Use this flow:

1. Navigation
2. Hero Section
3. Featured Products
4. Why Choose Lily Waist Line
5. Newsletter Section
6. Footer

Spacing between sections must follow the design system.

No cramped layouts.

No random gaps.

---

# Product Section

If static placeholder products are needed for now:

Use realistic waist trainer sample data.

Examples:

- Classic Sculpt Waist Trainer
- Core Fit Waist Trainer
- Elite Shape Waist Trainer

Use local placeholder image references if needed.

Do not fetch backend data yet.

---

# Layout Rules

Maintain editorial composition.

Use:

- strong whitespace
- controlled max widths
- premium section rhythm

Avoid:

- generic SaaS landing page layouts
- inconsistent spacing
- oversized containers

---

# SEO Basics

Add proper metadata for the homepage if not already present.

Include:

- page title
- description

Aligned with the brand.

---

# Responsive Requirements

Must work perfectly across:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

---

## Mobile

Navigation and sections must stack naturally.

No horizontal scrolling.

---

## Tablet

Balanced spacing and composition.

---

## Desktop

Luxury editorial composition.

Strong visual hierarchy.

---

# Important Rules

Do:

- use theme tokens only
- follow design typography
- maintain premium spacing
- preserve visual consistency

Do NOT:

- use random Tailwind colors
- break section rhythm
- introduce inconsistent layouts

---

### Check when done

- Homepage compiles without TypeScript errors
- All sections render correctly
- Navigation works
- Footer works
- Skeletons work
- Light mode works
- Dark mode works
- Responsive layouts work
- Homepage feels premium and production-ready