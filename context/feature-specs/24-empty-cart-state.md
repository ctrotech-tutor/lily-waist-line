Read `AGENTS.md` before starting.

We are now building the **Empty Cart State Component** for Lily Waist Line.

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/architecture-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create a **premium Empty Cart UI state**.

This appears when:

- cart has no items

It must not feel like a failure state — it should feel like a **guided re-entry into shopping**.

---

## Component Location
`components/cart/empty-cart.tsx`


Do not mix this into cart logic or summary.

---

## When It Is Used

Show when:

- cart items array is empty
- no products exist in cart state

---

## UI Structure

---

### 1. Icon / Visual Element

Use a subtle icon (lucide-react):

- Shopping bag
- or Cart icon

Keep it minimal and elegant.

---

### 2. Headline

Example:

- “Your cart is empty”

Tone must be soft, not harsh.

---

### 3. Supporting Text

Example:

- “Discover premium waist trainers designed for confidence and transformation.”

Keep it brand-aligned and aspirational.

---

### 4. Primary CTA

Button:

- “Start Shopping”

Must be visually strong and aligned with brand gold accent system.

---

### 5. Secondary Action (Optional)

- “Browse Collections”

Subtle text-style button.

---

## Layout Behavior

---

### Desktop

Centered layout:

- vertically and horizontally centered inside cart area
- minimal width container
- calm spacing

---

### Mobile

Same centered layout:

- slightly reduced padding
- maintains visual balance

---

## UI Rules (STRICT)

### MUST:

- use shadcn components:
  - Card
  - Button

- use lucide-react icons
- use theme tokens only
- maintain luxury black + gold system
- typography:
  - Bodoni Moda → headline
  - Montserrat → body text

---

### MUST NOT:

- connect navigation logic yet
- modify cart system state
- integrate backend
- trigger checkout flows
- introduce randomness or playful UI

---

## UX Direction

Empty cart must feel:

- elegant
- intentional
- non-judgmental
- conversion-recovery focused

It should gently guide the user back into shopping.

---

## Responsiveness

Must support:

- 320px
- 375px
- 768px
- 1024px+

---

## Check When Done

- empty state renders cleanly
- centered layout works
- CTA is clear and visible
- matches luxury design system
- responsive behavior correct
- no backend dependency