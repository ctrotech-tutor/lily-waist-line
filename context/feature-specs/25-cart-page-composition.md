Read `AGENTS.md` before starting.

We are now composing the **full Cart Page** for Lily Waist Line by wiring all existing cart components together.

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/architecture-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Assemble the full cart experience using already-built components:

- Cart Page Shell
- Cart Item Component
- Cart Summary Component
- Empty Cart State

This is **integration only** — no new UI primitives.

---

## Route
`/cart`

Use existing App Router structure.

---

## Page Composition Order

---

### 1. Navigation

Use existing:

- Navbar
- Mobile Navigation

---

### 2. Page Header

Include:

- “Your Cart”
- Optional subtitle (luxury tone)

---

## 3. Conditional Rendering (IMPORTANT)

Cart page must support two states:

---

### A. Empty Cart State

If cart is empty:

Render:

- `EmptyCart`

Stop here (do NOT render other sections)

---

### B. Active Cart State

If cart has items:

Render full layout:

---

## 4. Main Cart Layout

Use existing cart shell structure:

---

### Desktop Layout

Two columns:
Left: Cart Items List
Right: Cart Summary (sticky)


---

### Mobile Layout

Single column:

- Cart Items
- Cart Summary below

---

## 5. Cart Items Rendering

Render:

- `CartItem` component
- map over mock cart data (temporary)

Rules:

- no backend fetch yet
- no Supabase
- no Prisma

---

## 6. Cart Summary Rendering

Render:

- `CartSummary` component

Must reflect same mock totals as items

---

## 7. Interaction Rules (MVP ONLY)

For now:

- quantity updates can be local only
- remove item can update local state only
- no persistence

---

## 8. Footer

Use existing footer component.

---

## Data Rules

- Use mock cart array only
- Keep structure realistic for future Supabase integration
- Must be easy to replace later

---

## UI Rules (STRICT)

### MUST:

- use existing components only
- use shadcn primitives where already used
- maintain black + gold luxury theme
- ensure consistency with design system

---

### MUST NOT:

- create new cart UI components
- introduce backend logic
- connect checkout flow
- modify architecture
- introduce new state systems

---

## UX Direction

Cart page must feel:

- complete
- structured
- premium
- production-ready

Even though it’s still mock data.

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

- empty state works correctly
- cart state renders correctly
- layout is responsive
- summary syncs visually with items
- no backend dependency
- clean composition architecture
