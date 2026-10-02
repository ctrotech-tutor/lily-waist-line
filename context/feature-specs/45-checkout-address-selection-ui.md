Read `AGENTS.md` before starting.

We are now building the **Checkout Address Selection UI** for Lily Waist Line.

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

Integrate **shipping address selection UI** into the checkout flow.

This connects checkout with:
`/address`

BUT:

> No backend integration yet

This is UI orchestration only.

---

## Checkout Step

This becomes:

> Step 1 of Checkout Flow

---

## Components To Create

---

### 1. Address Selector
`components/checkout/address-selector.tsx`

Responsibilities:

- show list of saved addresses (mock data)
- allow selection of one address
- highlight selected address
- show “Add New Address” button

---

### 2. Address Card (Reusable)
`components/checkout/address-card.tsx`


Each card shows:

- full name
- address line 1
- city / state / country
- phone (optional)
- default badge (if applicable)

Must support:

- selected state UI
- hover state

---

## Mock Data

Use local mock:

```ts
const mockAddresses = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Doe",
    addressLine1: "12 Luxury Street",
    city: "Lagos",
    country: "Nigeria",
    phone: "08012345678",
    isDefault: true
  }
]
```

---

## Add New Address Flow

Button:

> + Add New Address

Behavior:

- navigates to:
  - `/address/new`

No backend connection yet.

No modal yet.

---

## Checkout Integration

This step must plug into:
`checkout-step.tsx`

So structure becomes:

---

### Step 1

Shipping Address

---

### Step 2 (later)

Payment

---

### Step 3 (later)

Review

---

## UX Rules

Address selection must feel:

- fast
- clear
- confidence-building

No confusion allowed.

User must always know:

> “This is where my order will be delivered.”

---

## UI Behavior

---

### Selection

- clicking a card selects it
- only one active selection at a time

---

### Default Address

- auto-selected if exists

---

## UI Primitive Rules

Use:

- Card
- Button
- Badge
- Separator

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must follow:

- luxury black + gold system
- clean spacing
- soft borders
- premium hover states

No generic address forms.

No clutter.

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

- keep address UI reusable
- prepare for backend integration later
- ensure selection state is clear

Do NOT:

- connect Supabase
- persist address selection
- mutate database
- handle server logic

---

## Check When Done

- Address selector renders
- Address cards render
- Selection works
- Default address highlighted
- Add new address navigates
- Checkout step integrates properly
- Mobile works
- Desktop works
- UI remains premium

---

## Next Step Preview

👉 Checkout Payment UI (Cash App instruction flow)

