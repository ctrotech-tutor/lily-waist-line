Read `AGENTS.md` before starting.

We are now composing the **final Product Details Page (PDP) assembly** for Lily Waist Line.

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Wire all previously created PDP components into a **complete Product Details Page**.

This is the final composition step for the PDP system.

---

## Components To Use

Use ONLY already built components:

### Layout Shell
- Navbar
- Mobile Navigation
- Footer

---

### Product Page Components

- Product Media Section (layout shell)
- Product Purchase Panel
- Product Trust & Benefits Section
- Product Related Products Section

---

## Page Structure

---

### 1. Navigation

Top navbar with mobile support.

---

### 2. Product Main Section

Two-column layout:

**Left:**
- Product Media Section

**Right:**
- Product Purchase Panel

---

### 3. Trust & Benefits Section

Full-width below main section.

---

### 4. Related Products Section

Full-width product grid.

---

### 5. Footer

Standard footer.

---

## Data Strategy

Use **mock product data only**.

No backend integration yet.

---

## Layout Rules

---

### Desktop

- 2-column hero layout
- sticky behavior allowed visually for purchase panel
- spacious editorial spacing

---

### Mobile

- fully stacked layout
- no horizontal scroll
- CTA remains visible naturally in flow

---

## UI Rules (STRICT)

### MUST:

- use shadcn components where needed
- use ProductCard for related products
- use theme tokens only
- follow luxury black + gold system
- maintain Bodoni Moda + Montserrat typography system

---

### MUST NOT:

- connect backend logic
- implement cart or wishlist behavior
- add API calls
- modify component internals
- introduce new UI patterns

---

## UX Direction

This page must feel:

- high-conversion
- premium retail
- calm and intentional
- structured and editorial

This is the **decision page**, not browsing.

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

- PDP renders fully without errors
- All sections integrate cleanly
- Layout matches design system
- Responsive behavior is correct
- No backend dependency
- Consistent luxury UI
- Production-ready structure