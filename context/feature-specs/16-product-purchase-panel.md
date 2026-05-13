Read `AGENTS.md` before starting.

We are now building the **Product Purchase Panel component** for the Lily Waist Line Product Details Page.

Follow strictly:

* `context/design.md`
* `context/ui-context.md`
* `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Build the **right-side purchase interaction panel** for the Product Details Page.

This is the **core conversion component** where users decide to purchase.

It must feel:

* premium
* trustworthy
* minimal
* conversion-focused

---

## Component Location

Create or update:
`components/product/product-purchase-panel.tsx` 

This component will be used inside the PDP layout.

---

## Data Source

Use **mock product data only** .

Do NOT connect to backend.

Mock fields:

* name
* price
* stock status
* sizes
* compression levels

---

## Panel Structure

---

### 1. Product Header

Includes:

* Product Name (Bodoni Moda)
* Short luxury tagline
* Price (prominent display)
* Stock Badge (In Stock / Low Stock)

---

### 2. Variant Selection

#### Size Selector

Use shadcn:

* Select / Toggle Group

Options:
* XS
* S
* M
* L
* XL

---

#### Compression Level

Use segmented UI:

* Light Sculpt
* Medium Sculpt
* Maximum Sculpt

Must feel premium (not default dropdown UI).

---

### 3. Quantity Selector

Compact stepper UI:

* [-] 1 [+]

Rules:
* min = 1
* max = 10 (UI only)

---

### 4. CTA Section

#### Primary Action

* Add to Cart

Use:
* shadcn Button (primary styling)

---

#### Secondary Action

* Add to Wishlist

Less prominent style

---

#### Optional (UI only placeholder)

* Buy Now (disabled or hidden)

---

### 5. Trust Micro Section

Small reassurance block under CTA:

Include:

* Secure Checkout
* Fast Delivery
* Easy Returns

Use Lucide icons.

---

## UI Rules (STRICT)

### MUST:

* use shadcn components:
  + Button
  + Select
  + Badge
  + Separator
  + Toggle Group (if needed)

* use theme tokens only
* follow black + gold luxury aesthetic
* Bodoni Moda only for product title
* Montserrat for UI text

---

### MUST NOT:

* connect cart logic
* connect wishlist logic
* implement checkout flow
* fetch real backend data
 * modify `components/ui/*`

* introduce business logic

---

## Interaction Rules

* Variant selection updates local state only
* Quantity updates local state only
* Buttons are UI-ready but not functional yet

---

## Layout Behavior

### Desktop

* vertical stacked panel
* sticky behavior allowed visually (no logic)

### Mobile

* full-width layout
* CTA always visible in scroll flow

---

## Visual Direction

This panel must feel:

* luxury retail (not generic ecommerce)
* calm, confident, minimal
* highly conversion-optimized

No clutter.

---

## Responsiveness

Must support:

* 320px
* 375px
* 768px
* 1024px
* 1440px+

---

## Check When Done

* Component renders without errors
* UI matches design system
* Variants and quantity UI work visually
* Buttons render correctly
* Fully responsive
* No backend dependency
* Clean integration ready for PDP composition
