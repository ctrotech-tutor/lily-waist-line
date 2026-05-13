Read `AGENTS.md` before starting.

We are now building the **Product Details Page (PDP) layout composition** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

# Goal

Compose the full Product Details Page using layout structure and existing UI primitives.

Do NOT build product logic yet.

This is purely page composition + layout wiring.

---

# Route

Use existing routing system.

Expected route:

`/product/[id]/[slug]`

Do NOT modify routing architecture.

---

# Components To Use (ONLY EXISTING OR PLACEHOLDER-COMPLIANT)

## Navigation

- navbar
- mobile navigation

---

## Product Page Sections (to be created in later specs but referenced here as layout slots)

You will structure the page using these logical sections:

### 1. Product Media Section
- image gallery container
- uses `/public/img-1.png` as fallback mock
- thumbnail strip placeholder

---

### 2. Product Info Panel
Includes layout placeholders for:

- product title
- price
- stock badge
- variant selector container
- quantity selector container
- CTA container (Add to Cart / Wishlist placeholders)

---

### 3. Product Description Section
- text content container (placeholder only)

---

### 4. Product Benefits Section
- grid container for icons + text (placeholder only)

---

### 5. Shipping & Trust Section
- trust badges container
- shipping info container

---

### 6. Related Products Section
- grid container using existing `ProductCard`

---

## Footer

Use existing footer component.

---

# Page Layout Structure

---

## Desktop Layout

Two-column structure:

Left:
- Product Media Section

Right:
- Product Info Panel

Below full width:
- Description
- Benefits
- Shipping Info
- Related Products

---

## Mobile Layout

Stacked layout:

1. Product Media
2. Product Info Panel
3. Description
4. Benefits
5. Shipping Info
6. Related Products

---

# UI Rules (CRITICAL)

Follow strictly:

## MUST:
- use shadcn components where appropriate:
  - Card → sections
  - Badge → stock state
  - Button → CTA placeholders
  - Separator → section breaks

- use theme tokens only
- follow luxury black/gold design system
- maintain editorial spacing

---

## MUST NOT:
- implement product logic
- fetch real data yet
- connect cart or wishlist
- implement variant behavior
- implement pricing logic
- modify UI primitives in `components/ui/*`

---

# Product Data

Use mock data only.

- static product object
- placeholder images from `/public/img-1.png`

---

# Layout Behavior Rules

## Desktop

- 2-column hero layout
- sticky product info panel allowed (visual only, no logic yet)

## Mobile

- fully stacked layout
- no horizontal scroll
- CTA must remain visible in viewport (future sticky behavior placeholder only)

---

# Visual Direction

This page must feel:

- premium
- editorial
- trust-focused
- conversion-ready
- minimal but high-end

No clutter.

---

# SEO

- title: Product Name | Lily Waist Line
- description: Premium waist trainers designed for sculpting and transformation

---

# Responsiveness

Must support:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

---

# Important Rules

Do:

- keep layout clean and modular
- reuse existing components
- preserve system consistency
- ensure responsive structure is correct

Do NOT:

- build business logic
- connect database
- implement interactivity beyond layout
- modify design system

---

# Check When Done

- Page renders successfully
- Layout matches desktop + mobile rules
- All sections appear as placeholders
- No TypeScript errors
- No UI inconsistencies
- Fully consistent with shop page design system
- Ready for next phase (logic wiring)