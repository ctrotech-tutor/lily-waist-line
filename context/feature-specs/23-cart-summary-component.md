Read `AGENTS.md` before starting.

We are now building the **Cart Summary Component** for Lily Waist Line.

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/architecture-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create the **Cart Summary Panel UI component**.

This is the **decision layer** of the cart:

- shows total cost
- reinforces trust
- pushes user toward checkout

It must feel calm, premium, and conversion-focused.

---

## Component Location
`components/cart/cart-summary.tsx`


Do not embed logic in pages.

---

## Data Model (Mock Only)

Use:

- subtotal
- delivery fee (placeholder)
- discount (optional placeholder)
- total

No backend integration.

---

## UI Structure

---

### 1. Summary Header

- Title: “Order Summary”
- Optional subtle divider

---

### 2. Price Breakdown

Include:

- Subtotal
- Delivery Fee (placeholder text like “Calculated at checkout” or fixed mock value)
- Discount (optional, hidden if not used)
- Total (emphasized)

---

### 3. Trust Microcopy Section

Very important for conversion.

Examples:

- Secure Checkout
- Fast Delivery
- Easy Returns

Keep it minimal and elegant.

---

### 4. Primary CTA

Button:

- “Proceed to Checkout”

Rules:

- full width
- visually dominant
- gold-accent styling allowed via tokens
- no navigation logic yet

---

### 5. Secondary Action

Button or link:

- “Continue Shopping”

Subtle styling.

---

## Layout Behavior

---

### Desktop

Sticky-style visual panel:

- stays visible while cart items scroll
- compact spacing
- high visual hierarchy

---

### Mobile

Full-width block:

- appears after cart items
- CTA remains prominent
- no sticky behavior required yet

---

## UI Rules (STRICT)

### MUST:

- use shadcn components:
  - Card
  - Button
  - Separator

- use theme tokens only
- maintain black + gold luxury identity
- typography:
  - Bodoni Moda → section title
  - Montserrat → body text

---

### MUST NOT:

- connect checkout flow
- trigger navigation
- store persistent state
- integrate payment logic
- modify cart items

---

## UX Direction

Cart summary must feel:

- confident
- reassuring
- simple
- premium retail checkout panel

It should reduce hesitation, not create complexity.

---

## Responsiveness

Must support:

- 320px
- 375px
- 768px
- 1024px+
  
---

## Check When Done

- component renders cleanly
- totals display correctly (mock data)
- CTA visually dominant
- trust section present
- responsive layout works
- no backend dependency
- matches design system