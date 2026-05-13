Read `AGENTS.md` before starting.

We are now wiring the **Checkout Flow System** for Lily Waist Line.

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

Wire all previously created checkout UI components into a **working multi-step checkout flow (UI state only)**.

This includes:

- Step navigation
- State handling
- UI transitions
- Flow orchestration

This is:

> UI orchestration only

Do NOT connect:

- backend
- database
- payments
- orders
- Supabase
- Prisma

---

## Checkout Flow Structure

### Steps

1. Address Selection
2. Payment Method Selection
3. Order Review + Place Order

---

## Core Implementation Concept

Use **local UI state only**:

Example:

```ts
const [step, setStep] = useState(1)
``` id="lwstate48"

Also track:

```ts
selectedAddress
selectedPaymentMethod
```

---

## Route

Use existing:
`/checkout`

No route restructuring.

---

## Components To Wire

---

### Existing Components

Must integrate:

- checkout-shell
- checkout-step
- checkout-progress
- address-selector
- payment-method-selector
- payment-instructions
- checkout-summary
- checkout-review UI

---

## Flow Behavior

---

### Step 1 → Address

Actions:

- select address
- “Continue” button enabled only when selected

Button:

> Continue to Payment

Moves:

→ Step 2

---

### Step 2 → Payment Method

Actions:

- select Cash App / PayPal
- show dynamic instructions

Button:

> Continue to Review

Moves:

→ Step 3

---

### Step 3 → Review

Actions:

- show final summary
- confirm selections

Button:

> Place Order

UI-only loading + transition

---

## Navigation Rules

Include:

### Back Buttons

- Step 2 → Step 1
- Step 3 → Step 2

Must preserve selected state.

---

## Progress Indicator Sync

Must reflect current step:

- Active step highlighted
- Completed steps marked
- Future steps dimmed

---

## State Rules

All state must be:

- local to checkout page OR checkout provider (if used)
- no backend persistence yet
- no Supabase calls
- no server actions

---

## UX Rules

Checkout must feel:

- linear
- guided
- frictionless
- confident

User must always know:

> “Where am I in checkout?”

---

## UI Animation Rules

Use subtle transitions:

- step fade-in
- slide transitions (optional)
- no heavy animations

Keep luxury feel.

---

## UI Primitive Rules

Use:

- Button
- Card
- Separator
- Progress (shadcn optional)
- Badge

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must follow:

- luxury black + gold theme
- strong hierarchy
- clean spacing system
- minimal distractions

No clutter.

No generic checkout wizard styling.

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

- keep flow predictable
- preserve all selections across steps
- ensure clarity at every stage

Do NOT:

- connect backend
- persist data
- trigger real payments
- integrate APIs

---

## Check When Done

- Step system works correctly
- Navigation forward/back works
- State persists across steps
- Progress indicator updates
- Address selection works
- Payment selection works
- Review step works
- Mobile works
- Desktop works
- UI feels like real production checkout

---

## Next Step Preview

👉 Cart Page System (UI + interactions before checkout entry)