Read `AGENTS.md` before starting.

We are building the foundation of the Lily Waist Line shop page.

This is the first dedicated shopping experience in the platform.

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create the foundational shop page UI components.

Create:

- `components/shop/shop-header.tsx`
- `components/shop/shop-layout.tsx`

Do not build filters yet.

Do not build sorting yet.

Do not connect backend data yet.

Do not wire product fetching yet.

This task is only the page shell and content framing.

---

# Purpose

The shop page should immediately communicate:

- premium shopping experience
- product confidence
- clarity
- editorial luxury

This is not a generic marketplace layout.

This must feel curated.

---

# Shop Header

Create:

`components/shop/shop-header.tsx`

---

## Content

Include:

### Eyebrow Label

Luxury uppercase label.

Examples:

- Lily Collection
- Sculpt Collection

Use editorial spacing.

---

### Main Heading

Examples:

- Shop Waist Trainers
- Designed For Transformation

Use design system heading typography.

Large editorial presence.

---

### Supporting Copy

Short premium body copy.

Communicate:

- quality
- shaping
- comfort
- performance

Keep it concise.

---

### Product Count

Include a product count label.

Example:

Showing 12 products

For now use static placeholder count.

Must be easy to replace later with real backend data.

---

# Shop Layout

Create:

`components/shop/shop-layout.tsx`

---

## Purpose

This component acts as the shell of the shop page.

It will later support:

- filters
- sorting
- product grid
- pagination

For now only create the layout structure.

---

# Layout Requirements

Use a responsive layout.

---

## Desktop

Prepare for:

Left side:

future filters

Right side:

products area

Do not build filters yet.

Only reserve structural space.

---

## Tablet

Adapt naturally.

---

## Mobile

Single column.

No horizontal overflow.

---

# Placeholder Content

For now:

Use simple placeholder areas that indicate:

- filters area (future)
- products area (future)

Keep placeholders elegant.

No ugly debug boxes.

Use subtle surfaces or thin borders if needed.

---

# Styling Rules

Must follow:

- theme tokens only
- editorial spacing
- sharp architectural design

No:

- default dashboard layouts
- generic ecommerce templates
- random Tailwind colors

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

- maintain luxury brand consistency
- prepare for scalable architecture
- keep component boundaries clean

Do NOT:

- add filters yet
- add sorting yet
- fetch products yet
- wire page routing yet

---

### Check when done

- Components compile without TypeScript errors
- Layout feels premium
- Light mode works
- Dark mode works
- Responsive layouts work
- Components are ready for the next phase