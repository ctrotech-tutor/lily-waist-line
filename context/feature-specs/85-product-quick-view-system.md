Read `AGENTS.md` before starting.

We are now building the **Product Quick View UI System** for Lily Waist Line.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- shadcn/ui Drawer component usage
- Next.js App Router UI patterns
- responsive layout best practices
- accessibility-first modal/drawer behavior

When UI behavior differs across framework versions:

Verify against latest official documentation:

- https://ui.shadcn.com
- https://nextjs.org/docs
- https://react.dev

---

Follow strictly:

- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`

Maintain strict consistency with Lily Waist Line’s luxury editorial identity.

---

## Goal

Implement a **Quick View Drawer UI** for products.

This is a **UI-only system** at this stage.

No backend refactoring is required in this phase.

---

## Core UX Principle

Quick View must feel:

- instant
- elegant
- non-intrusive
- conversion-focused
- premium editorial

It should enhance browsing without disrupting flow.

---

## Trigger Source

Existing:

> Product Card “Quick View” button

Must open the drawer.

Do NOT modify product card structure beyond wiring event handler.

---

## UI Component Choice

Use:

:contentReference[oaicite:0]{index=0} Drawer component

---

## Drawer Behavior Rules

---

### Desktop

- Opens from RIGHT side
- Width: balanced (not full screen)
- Scroll locked background

---

### Mobile

- Opens from BOTTOM
- Full-width drawer style
- Smooth swipe-close behavior (native feel)

---

## Content Layout (Inside Drawer)

---

## 1. Product Image Section

- primary product image
- clean aspect ratio handling
- lazy loading enabled

---

## 2. Product Info Section

Display:

- product name
- short description
- price

Keep spacing minimal and premium.

---

## 3. Variant UI (Visual Only for Now)

Show:

- size options (UI only)
- compression options (UI only)

No backend interaction required yet.

---

## 4. Stock Badge

Display:

- In Stock
- Low Stock
- Out of Stock

Based on placeholder or existing product data mapping.

---

## 5. Action Buttons (UI Only)

Buttons:

- Add to Cart (UI wired, no backend logic required yet)
- View Full Product

Navigation:

→ /products/[slug]

---

## 6. Wishlist Button (UI Only)

- Heart icon toggle UI
- No persistence required yet

Must visually reflect state changes locally.

---

## Interaction Rules

- Drawer opens instantly
- No page navigation
- Background blur / overlay required
- Escape closes drawer
- Click outside closes drawer (desktop only)

---

## Responsiveness Rules

Must support:

- 320px mobile
- tablet
- desktop

Drawer behavior must adapt automatically.

---

## Animation Rules

Use existing system motion style:

- smooth open transition
- no aggressive bounce
- subtle fade overlay

---

## Accessibility Rules

Must include:

- focus trap inside drawer
- ARIA labels for drawer
- keyboard navigation support
- escape key close support

---

## Performance Rules

Must:

- lazy render drawer content
- avoid unnecessary re-renders
- keep UI lightweight

---

## Important Rules

Do:

- use shadcn Drawer only
- keep UI modular
- maintain responsiveness
- keep styling consistent with design system

Do NOT:

- implement backend logic yet
- fetch additional product data outside existing structure
- rebuild modal system
- duplicate product page layout

---

## Check When Done

- drawer opens from right (desktop)
- drawer opens from bottom (mobile)
- product UI renders correctly
- buttons visible and styled
- wishlist UI toggles locally
- accessibility works
- no layout shift issues
