Read `AGENTS.md` before starting.

We are building the product filtering and sorting system for Lily Waist Line.

This is a core shopping experience feature.

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create:

- `components/shop/shop-filters.tsx`
- `components/shop/mobile-filter-drawer.tsx`
- `components/shop/shop-sort.tsx`

Do not connect backend logic yet.

Do not fetch real products yet.

Do not wire URL state yet.

This task is UI architecture only.

---

# Purpose

Customers must be able to quickly narrow down products.

This should feel premium, clean, and easy to use.

Not cluttered.

Not marketplace-like.

Not dashboard-like.

---

# Desktop Filtering

Create:

`components/shop/shop-filters.tsx`

This will live in the left sidebar area.

---

## Filter Groups

Build these filter sections:

---

### Size

Options:

- XS
- S
- M
- L
- XL
- XXL

---

### Compression Level

Options:

- Light Sculpt
- Medium Sculpt
- Maximum Sculpt

---

### Color

Options:

- Black
- Nude

Future ready for more colors.

---

### Availability

Options:

- In Stock
- Sold Out

---

# Interaction Design

Each filter should support:

- selected state
- hover state
- active state

Must feel premium.

Possible patterns:

- chips
- segmented buttons
- custom check selectors

Avoid default checkbox styling.

---

# Mobile Filters

Create:

`components/shop/mobile-filter-drawer.tsx`

---

## Mobile UX

Must open as:

- slide-over drawer
or
- bottom sheet

Use shadcn dialog/drawer patterns.

---

## Mobile Requirements

Include:

- section title
- close action
- filter groups
- reset filters action
- apply filters action

Must be thumb-friendly.

---

# Sorting

Create:

`components/shop/shop-sort.tsx`

---

## Sorting Options

Use a premium dropdown or select.

Include:

- Featured
- Best Selling
- New Arrivals
- Price: Low to High
- Price: High to Low

---

# UI Behavior

Sorting UI should feel editorial.

Not default browser select styling.

Use shadcn patterns if needed.

Custom brand styling required.

---

# Placeholder Logic

Use local component state for now.

No backend.

No global state.

No URL syncing yet.

This is temporary UI state only.

---

# Styling Rules

Must follow:

- theme tokens only
- editorial spacing
- sharp architecture

No:

- generic ecommerce filters
- random Tailwind colors
- bulky form controls

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

Filters hidden behind drawer trigger.

Sorting stays accessible.

---

## Tablet/Desktop

Sidebar filters visible.

Sorting visible near product grid.

---

# Important Rules

Do:

- keep components reusable
- prepare for backend integration
- maintain premium consistency

Do NOT:

- fetch products
- mutate URLs
- add server actions
- connect APIs

---

### Check when done

- Components compile without TypeScript errors
- Filter states work
- Sorting works
- Drawer works
- Light mode works
- Dark mode works
- Responsive layouts work
- Components feel premium and production-ready