Read `AGENTS.md` before starting.

We are now building the **Checkout Layout Foundation** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the **Checkout Page Layout System**.

This is the structural shell that all checkout steps will use.

This is:

> UI foundation only

Do NOT connect:

- Supabase
- Prisma
- Payment logic
- Orders
- Address persistence

yet.

---

## Route

Create:
`/app/(site)/checkout/page.tsx`

This will later evolve into a multi-step flow.

---

## Layout Concept

Checkout must feel:

- focused
- minimal
- distraction-free
- conversion-optimized

No marketing content.

No unnecessary navigation.

---

## Layout Structure

### Desktop (2 Column)
| Checkout Steps | Order Summary |
| | |
| (main flow) | (sticky panel) |


---

### Mobile (1 Column)

Stacked:

1. Step content
2. Summary collapsed/expandable

No horizontal scroll.

---

## Components To Create

---

### 1. Checkout Layout Shell
`components/checkout/checkout-shell.tsx`

Responsibilities:

- 2-column responsive layout
- sticky summary panel (desktop)
- mobile stacking behavior

Accepts:

- children
- summary

---

### 2. Checkout Step Container
`components/checkout/checkout-step.tsx`


Responsibilities:

- wraps each checkout step
- provides spacing consistency
- handles step title + subtitle

---

### 3. Checkout Progress Indicator (UI only)
`components/checkout/checkout-progress.tsx`


Shows:

- Step 1: Address
- Step 2: Payment
- Step 3: Review

UI only (no logic yet)

---

### 4. Checkout Summary Panel
`components/checkout/checkout-summary.tsx`


Displays:

- subtotal
- shipping (placeholder)
- total
- item preview (mock data)

No calculations yet.

---

## UI Primitive Rules

Use existing shadcn components only:

- Card
- Separator
- Button
- ScrollArea

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must strictly follow:

- design tokens only
- luxury black + gold identity
- clean editorial spacing
- high contrast readability

No generic checkout UI.

No clutter.

---

## Checkout UX Principles

This system must:

- reduce decision friction
- always show order value clearly
- keep summary visible
- avoid distractions

---

## Responsiveness

Must support:

- 320px
- 375px
- 768px
- 1024px+
- 1440px+

---

## Important Rules

Do:

- build reusable checkout structure
- prepare for step-based flow
- keep layout strict and predictable

Do NOT:

- implement payment logic
- connect cart
- connect address database
- calculate totals dynamically

---

## Check When Done

- Checkout shell compiles
- 2-column layout works
- Mobile stacking works
- Summary panel renders
- Step container works
- Progress UI renders
- No backend logic exists
- No cart integration yet
- No address integration yet

---

## Next Step Preview

👉 Checkout Summary Logic + Mock Pricing Flow
