Read `AGENTS.md` before starting.

We are now building the **Checkout Review + Place Order UI** for Lily Waist Line.

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

Build the final checkout step:

> Order Review + Place Order UI

This is where the user confirms everything before payment flow begins.

This is:

> UI only (no backend order creation yet)

---

## Checkout Step

This becomes:

> Step 3 of Checkout Flow

---

## Components To Use

Must integrate existing checkout system:

- checkout-shell
- checkout-step
- checkout-summary
- address-selector (selected value only)
- payment-method-selector (selected value only)

---

## Page Sections

---

### 1. Order Summary Recap

Show:

- product list (from mock cart)
- quantity
- subtotal
- shipping
- total

Reuse:
`components/checkout/checkout-summary.tsx`

---

### 2. Shipping Address Recap

Display selected address:

- full name
- address line
- city/state/country

Include edit button:

> Change

Navigates back to step 1 UI state.

---

### 3. Payment Method Recap

Show selected method:

- Cash App OR PayPal
- short description
- badge indicator

Include edit button:

> Change

Navigates back to step 2 UI state.

---

## 4. Trust & Assurance Section

This is VERY important for conversion.

Include:

- Secure Checkout badge
- Manual verification note
- Fast processing note

Example copy:

> Your order is protected and will be processed securely after confirmation.

---

## 5. Place Order CTA

Primary button:

> Place Order

Behavior:

- UI loading state only
- no real order creation yet

After click:

Show temporary UI state:

> Preparing your order…

Then:

> Redirecting to payment instructions…

---

## Payment Routing Note (UI)

Based on selection:

### Cash App

Show:

> You will complete payment via Cash App after order confirmation.

---

### PayPal

Show:

> You will be redirected to PayPal to complete payment securely.

---

## UX Rules

This page must:

- reduce hesitation
- reinforce trust
- confirm all choices clearly
- push user toward payment action

No distractions.

No marketing.

No clutter.

---

## UI Primitive Rules

Use:

- Card
- Button
- Separator
- Badge
- Alert (shadcn)

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must follow:

- luxury black + gold theme
- clean hierarchy
- strong CTA emphasis
- soft borders + spacing

No generic checkout UI patterns.

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

- keep review step final and decisive
- clearly show all selected data
- prepare for backend order creation later

Do NOT:

- create real orders
- trigger payments
- connect Supabase
- call PayPal or Cash App APIs

---

## Check When Done

- Review step renders correctly
- Cart summary works
- Address recap works
- Payment recap works
- Place order button works
- Loading state works
- Navigation between steps works
- Mobile works
- Desktop works
- UI feels premium and conversion-focused

---

## Next Step Preview

👉 Checkout Wiring (full multi-step flow orchestration)