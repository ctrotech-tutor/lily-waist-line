Read `AGENTS.md` before starting.

We are now building the **Checkout Payment Method UI** for Lily Waist Line.

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

Introduce a **dual payment method selection system** in checkout:

- Cash App (US customers)
- PayPal (International customers)

This is:

> UI only (no payment processing yet)

---

## Core Concept

Checkout must now support:

### Payment Routing Logic (UI level)

- If user selects **US region → Cash App**
- If user selects **International → PayPal**

BUT:

> No automatic detection yet — user selects manually for now

---

## Checkout Step

This becomes:

> Step 2 of Checkout Flow

(after address selection)

---

## Components To Create

---

### 1. Payment Method Selector
`components/checkout/payment-method-selector.tsx`


Responsibilities:

- choose between payment methods
- show two premium cards
- highlight selected method

---

## Payment Options

---

### Option 1: Cash App (US)

Label:

> Cash App (US Orders)

Description:

> Pay securely via Cash App for US-based customers.

Badge:

- “Recommended for US”

---

### Option 2: PayPal (International)

Label:

> PayPal (International Orders)

Description:

> Pay securely via PayPal for global customers.

Badge:

- “Global Payments”

---

## UI Behavior

---

### Selection Rules

- Only one method can be active
- Selected method is visually highlighted
- Smooth transition between selections

---

## Payment Instruction Preview Panel

Create:
`components/checkout/payment-instructions.tsx`

This updates based on selection:

---

### If Cash App Selected

Show:

- Cash App handle placeholder
- instruction text:
  > Send payment via Cash App after order confirmation

---

### If PayPal Selected

Show:

- PayPal email placeholder
- instruction text:
  > You will be redirected to PayPal after placing your order

---

## Checkout Flow Integration

This step connects into:
`checkout-step.tsx`

Flow becomes:

---

### Step 1 → Address

### Step 2 → Payment Method

### Step 3 → Review Order

---

## UX Rules

Payment selection must feel:

- clear
- trustworthy
- low-friction

Users must instantly understand:

> “How do I pay?”

---

## UI Primitive Rules

Use:

- Card
- Button
- Badge
- Separator
- Radio-style selection UI

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must follow:

- luxury black + gold system
- soft hover glow
- clean spacing
- premium selection states

No generic fintech UI.

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

- keep payment methods isolated
- prepare for backend routing later
- keep UI flexible for future gateways

Do NOT:

- integrate Cash App API
- integrate PayPal SDK
- process payments
- store transactions

---

## Check When Done

- Payment selector renders
- Cash App option works
- PayPal option works
- Selection state works
- Instruction panel updates dynamically
- Checkout step integration works
- Mobile works
- Desktop works
- UI feels premium and clear

---

## Next Step Preview

👉 Checkout Review + Place Order UI (final step before payment execution flow)