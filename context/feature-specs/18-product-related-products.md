Read `AGENTS.md` before starting.

We are now building the **Related Products Section** for the Lily Waist Line Product Details Page.

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Build the **“You May Also Like” / Related Products section**.

This section increases:
- cross-selling
- average order value (AOV)
- product discovery depth

It must feel **intentional, curated, and premium**, not algorithmic or noisy.

---

## Component Location

Create:
`components/product/product-related-products.tsx`

This will be used at the bottom of the Product Details Page.

---

## Data Source

Use **mock product list only**.

Structure:

- id
- name
- price
- image (use `/public/img-1.png`)
- short tagline (optional)

No backend integration.

---

## Section Structure

---

### 1. Section Header

Include:

- Eyebrow: “You May Also Like”
- Title: “Curated for Your Transformation”
- Optional subtitle: short luxury line

Tone:
- editorial
- refined
- non-salesy

---

### 2. Product Grid

Use existing:

- `ProductCard` component

Grid rules:

### Desktop
- 3 or 4 columns

### Tablet
- 2 columns

### Mobile
- 1–2 columns

---

### 3. Optional CTA Row (Future-ready)

Include placeholder:

- “View All Products”

Do NOT wire navigation yet.

---

## UI Rules (STRICT)

### MUST:

- use shadcn layout primitives where needed:
  - Card
  - Separator
- reuse existing ProductCard
- use theme tokens only
- maintain black + gold luxury system
- Bodoni Moda only for headings
- Montserrat for UI text

---

### MUST NOT:

- fetch real data
- connect recommendation logic
- add backend filtering
- modify ProductCard internals
- introduce business logic

---

## Layout Behavior

### Desktop

- centered section container
- spacious grid
- consistent card sizing

---

### Mobile

- horizontally tight grid
- no overflow
- scroll-safe layout

---

## Visual Direction

This section must feel:

- curated, not automated
- boutique-style selection
- minimal and premium
- editorial product showcase

Avoid “ecommerce spam” feel.

---

## Responsiveness

Must support:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

---

## Check When Done

- renders without errors
- integrates cleanly with PDP
- uses ProductCard correctly
- fully responsive
- no backend dependency
- consistent luxury styling