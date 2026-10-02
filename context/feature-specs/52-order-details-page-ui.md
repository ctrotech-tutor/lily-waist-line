Read `AGENTS.md` before starting.

We are now building the **Single Order Details UI** for Lily Waist Line.

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

Build the **Single Order Details Page UI**.

This page allows customers to:

- inspect a specific order
- view payment status
- view fulfillment progress
- see purchased items
- access shipment info later

This is:

> UI only

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- Real order queries

yet.

---

## Route

Create:

/orders/[orderId]

Use existing App Router structure.

Do not change route architecture.

---

## Core UX Purpose

This page must answer:

---

### 1

What did I order?

---

### 2

Has my payment been confirmed?

---

### 3

What stage is my order currently in?

---

### 4

Has it shipped yet?

---

## Components To Create

---

### 1. Order Details Layout

Create:

components/orders/order-details-shell.tsx

Responsibilities:

- responsive page spacing
- section organization
- clean hierarchy

---

### 2. Order Header

Create:

components/orders/order-details-header.tsx

Contains:

- Order Number
- Order Date
- Total Amount

Example:

LW-2026-001

May 11, 2026

$120.00

---

## Order Status Overview

Create:

components/orders/order-status-overview.tsx

Show:

---

### Payment Status

Examples:

- Pending Payment
- Paid

---

### Fulfillment Status

Examples:

- Processing
- Shipped
- Delivered
- Cancelled

---

Both must use premium badge styling.

---

## Order Timeline

Create:

components/orders/order-timeline.tsx

This is VERY important.

Show milestone progression:

---

### Timeline Steps

1. Order Created

2. Payment Verified

3. Processing

4. Shipped

5. Delivered

---

## Timeline Rules

- Completed steps highlighted
- Current step emphasized
- Future steps dimmed

Mock only.

No backend logic.

---

## Purchased Items

Create:

components/orders/order-items-list.tsx

Each item shows:

- product image
- product name
- quantity
- unit price
- selected variant

Example:

Size: M

Compression: High

---

Use:
`/img-1.png` 
as placeholder.

---

## Action Section

Contextual actions:

---

### If Payment Pending

Button:

Upload Payment Proof

Navigates:

/order/payment-proof

---

### If Shipped

Button:

Track Shipment

Navigates:

tracking section (future)

---

### Always

Button:

Continue Shopping

Navigates:

/shop

---

## Mock Data

Use local mock order.

No backend fetching.

Easy to replace later.

---

## UI Primitive Rules

Use existing shadcn primitives:

- Card
- Button
- Badge
- Separator
- ScrollArea (optional)

Do NOT modify:

components/ui/*

---

## Styling Rules

Must use:

- theme tokens only
- luxury black + gold identity
- editorial spacing
- premium timeline styling

No generic dashboard layouts.

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

- build strong post-purchase trust
- make order progression crystal clear
- prepare for real backend integration later

Do NOT:

- fetch real orders
- update statuses
- call APIs
- mutate data

---

## Check When Done

- Order details page compiles
- Header renders
- Status overview works
- Timeline renders
- Purchased items render
- Action buttons work
- Mobile works
- Desktop works
- Premium consistency maintained

---

## Next Step Preview

👉 Shipment Tracking UI