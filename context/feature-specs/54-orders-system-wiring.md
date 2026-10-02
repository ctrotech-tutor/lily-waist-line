Read `AGENTS.md` before starting.

We are now wiring the **Customer Orders System** for Lily Waist Line.

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

Wire all previously created customer order UI screens into one complete flow.

This includes:

- orders list
- order details
- shipment tracking
- payment proof uploads
- order confirmation routing

This is:

> UI orchestration only

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- Emails
- Real payments
- Real orders

yet.

---

## Flow To Build

The full customer order journey should now be:

---

### Checkout
`/checkout`

After UI "Place Order":

Navigate to:
`/order/confirmation`

---

### Payment Proof

If payment is pending:

Navigate to:
`/order/payment-proof`

After submit:

Navigate to:
`/order`

---

### Orders Page

Route:
`/orders`

---

Customer sees all orders.

Actions:

---

#### Pending Payment

Navigate:
`/order/confirmation`
or
`/order/payment-proof`


depending on current UI state.

---

#### Paid / Processing

Navigate:
`orders/[orderId]`

---

#### Shipped

Navigate:
`/orders/[orderId]/tracking`

---

## Order Details Flow

Inside:
`/orders/[orderId]`

Buttons:

---

### Payment Pending

Upload Payment Proof

→
`/order/payment-proof`


---

### Shipped

Track Shipment

→
`/orders/[orderId]/tracking`

---

## Navigation Consistency

All pages must support:

---

### Back Navigation

Examples:

Tracking →

Order Details →

Orders

---

## State Handling

Use:

local mock state only.

No persistence.

No backend.

No cookies.

No server actions.

---

## Shared Mock Data

All order pages must share consistent mock order IDs.

Example:

```ts
LWL-2026-001
```

Do not generate different fake orders per page.

Consistency matters.

---

## UX Rules

This entire flow must feel:

- trustworthy
- premium
- linear
- easy to understand

Users should never feel lost.

---

## UI Transition Rules

Use subtle transitions where appropriate:

- route transitions
- hover states
- loading states

Keep luxury feel.

No heavy animations.

---

## UI Primitive Rules

Use existing shadcn primitives only.

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black + gold theme
- editorial spacing
- premium hierarchy
- consistent badges and statuses

No generic ecommerce dashboards.

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

- ensure every route connects correctly
- maintain consistent mock order state
- keep navigation intuitive

Do NOT:

- connect backend
- persist orders
- trigger emails
- verify payments
- fetch data

---

## Check When Done

- Orders page routes work
- Order details routes work
- Tracking routes work
- Payment proof routes work
- Confirmation routes work
- Back navigation works
- Mock order data is consistent
- Mobile works
- Desktop works
- Premium consistency maintained

---

## Next Step Preview

👉 Admin Dashboard Foundation