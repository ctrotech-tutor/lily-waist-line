Read `AGENTS.md` before starting.

We are now building the **Cart Item Component** for Lily Waist Line.

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/architecture-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create a **reusable Cart Item UI component**.

This is the core building block of the cart system.

It represents a single product inside the cart.

---

## Component Location

`components/cart/cart-item.tsx`

Do not mix business logic into page routes.

---

## Data Model (Mock Only)

Each cart item should support:

- id
- product name
- image
- price
- size
- compression (optional)
- quantity

---

## UI Structure

Each cart item must include:

---

### 1. Product Image

- fixed aspect ratio
- rounded styling consistent with design system
- lazy-loaded (future-ready)

---

### 2. Product Info Block

Includes:

- Product Name (primary)
- Variant details:
  - Size
  - Compression (if exists)

---

### 3. Price Section

- unit price
- optional total (price × quantity)

---

### 4. Quantity Controls

Controls:

- minus button
- quantity display
- plus button

Rules:

- minimum quantity = 1
- no negative values

---

### 5. Remove Action

- subtle destructive action
- icon-based (use lucide-react)
- no confirmation modal yet

---

## Layout Behavior

---

### Desktop

Horizontal layout:

[ Image ] [ Product Info ] [ Quantity Controls ] [ Price ] [ Remove ]

---

### Mobile

Stacked layout:

* image on top
* info below
* controls grouped
* price aligned clearly
* remove at bottom or top-right

---

## UI Rules (STRICT)

### MUST:

* use shadcn components where applicable:

  * Button
  * Card (optional wrapper)
  * Separator (if needed)

* use lucide-react icons

* use theme tokens only

* maintain black + gold luxury system

* typography:

  * Bodoni Moda → product name
  * Montserrat → details

---

### MUST NOT:

* manage global cart state
* connect backend
* persist data
* implement checkout logic
* duplicate cart summary logic

---

## Interaction Rules (MVP)

For now:

* quantity changes only update local state (if used)
* remove only updates local state
* no persistence layer

---

## UX Direction

Cart item should feel:

* premium retail line item
* clean and minimal
* not cluttered
* easy to scan
* confidence-building

No noise.

---

## Responsiveness

Must support:

* 320px
* 375px
* 768px
* 1024px+

---

## Check When Done

* component renders cleanly
* responsive behavior works
* quantity controls function visually
* remove action works visually
* no backend dependency
* consistent with design system
