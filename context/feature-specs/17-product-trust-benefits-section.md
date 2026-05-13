Read `AGENTS.md` before starting.

We are now building the **Product Trust & Benefits Section** for the Lily Waist Line Product Details Page.

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Build the **trust-building + product benefits section** under the Product Purchase Panel.

This section reinforces buying confidence through:
- emotional reassurance
- product value clarity
- visual trust signals

It is a **conversion psychology layer**, not just UI content.

---

## Component Location

Create:
`components/product/product-trust-benefits-section.tsx`


This will be used inside the PDP below the purchase panel.

---

## Data Source

Use **mock structured content only**.

No backend connection.

---

## Section Structure

---

### 1. Section Header

Include:

- Small eyebrow text: “Why You’ll Love It”
- Section title (editorial style)
- Short supporting line

Tone:
- calm
- premium
- confidence-building

---

### 2. Benefits Grid

Display **4 core benefits** in a grid.

Each item includes:

- Icon (Lucide only)
- Title
- Short description

### Suggested Benefits:

- Core Support
- Waist Sculpting Effect
- Breathable Comfort
- Workout Friendly Design

---

### 3. Trust Indicators

Add a horizontal trust row:

Include:

- Secure Checkout
- Fast Delivery
- Easy Returns

Must feel subtle, not loud marketing.

---

### 4. Material / Quality Highlight

Add a highlighted card section:

Include:

- Premium Fabric
- Durable Compression Structure
- Skin-friendly Material

This should feel like a “luxury assurance block”.

---

## UI Rules (STRICT)

### MUST:

- use shadcn components:
  - Card
  - Badge
  - Separator
  - Grid layout system

- use theme tokens only
- follow black + gold luxury aesthetic
- Bodoni Moda only for headings
- Montserrat for body text

---

### MUST NOT:

- add interactivity logic
- connect backend data
- duplicate purchase panel logic
- modify UI primitives in `components/ui/*`

---

## Layout Behavior

### Desktop

- 2x2 benefits grid
- trust row aligned horizontally
- material highlight as full-width card

---

### Mobile

- single column stack
- compact spacing
- trust row wraps vertically

---

## Visual Direction

This section must feel:

- reassuring
- premium
- calm confidence
- subtle persuasion

Avoid aggressive marketing language.

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

- renders cleanly
- fully responsive
- consistent with PDP design system
- no backend dependency
- integrates visually with purchase panel
- maintains luxury aesthetic