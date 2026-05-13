Read `AGENTS.md` before starting.

We are now building the **Cart Page Shell (layout foundation)** for Lily Waist Line.

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/architecture-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create the **base layout structure for the Cart page**.

This is ONLY the shell:

- no cart logic
- no item rendering
- no checkout logic

Just structure + layout readiness.

---

## Route

/cart

Use existing App Router structure.

Do NOT modify routing system.

---

## Page Structure

---

### 1. Navigation

Use existing:

- Navbar
- Mobile Navigation

---

### 2. Page Header Section

Include:

- Title: “Your Cart”
- Subtitle (luxury editorial tone)
- Optional cart item count placeholder (static for now)

---

### 3. Cart Layout Container

Create main layout structure:

---

## Desktop Layout

Two-column grid:

Left:  Cart Items Area (placeholder container)
Right: Cart Summary Area (placeholder container)

Rules:

* Left = scrollable area
* Right = sticky visual panel (not functional yet)

---

## Mobile Layout

Single column:

* stacked sections
* no horizontal overflow
* natural scroll flow

---

### 4. Placeholder Sections

Inside layout:

### Left Column:

* “Cart Items will render here”

### Right Column:

* “Cart Summary will render here”

Use simple placeholder UI cards (shadcn Card recommended).

---

### 5. CTA Placeholder Area

Add disabled visual placeholder:

* “Proceed to Checkout”

Do NOT wire navigation.

---

### 6. Footer

Use existing footer component.

---

## Data Rules

* NO real cart data
* NO mock item rendering
* NO state management yet

This is structural only.

---

## UI Rules (STRICT)

### MUST:

* use shadcn components:

  * Card
  * Separator
  * Container layout primitives

* use theme tokens only

* maintain black + gold luxury system

* Bodoni Moda for headings only

* Montserrat for UI text

---

### MUST NOT:

* implement cart logic
* create item components here
* connect backend or Supabase
* add checkout functionality
* introduce global state

---

## UX Direction

This shell must feel:

* structured
* premium
* calm
* editorial
* conversion-ready (but inactive)

Think of it as a **luxury frame waiting for content**.

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

* layout renders correctly
* responsive grid works
* no logic implemented
* placeholders visible
* matches design system
* no backend dependency