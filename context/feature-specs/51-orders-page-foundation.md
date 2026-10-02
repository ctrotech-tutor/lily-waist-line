Read `AGENTS.md` before starting.

We are now building the **Customer Orders Page UI** for Lily Waist Line.

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

Build the **Orders Page Foundation**.

This page allows customers to:

- view previous orders
- check order statuses
- access order details
- continue payment if payment is still pending

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

/orders

Use existing routing structure.

---

## Core UX Purpose

This page must answer:

---

### 1

What orders have I placed?

---

### 2

What is the status of each order?

---

### 3

Do I need to take action?

---

If unclear:

Trust drops.

---

## Components To Create

---

### 1. Orders Page Layout

Create:

components/orders/orders-shell.tsx

Responsibilities:

- page spacing
- responsive layout
- empty state support

---

### 2. Orders Header

Create:

components/orders/orders-header.tsx

Contains:

Title:

My Orders

Supporting copy example:

Track your purchases, payments, and deliveries.

---

## Order List

Create:

components/orders/orders-list.tsx

Responsibilities:

- render customer orders
- support empty state
- support loading skeleton later

---

## Order Card

Create:

components/orders/order-card.tsx

Each order card shows:

---

### Order Number

Example:

LW-2026-001

---

### Order Date

Example:

May 11, 2026

---

### Total

Example:

$120.00

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

### Item Count

Example:

2 Items

---

## Mock Data

Use local mock orders.

No backend fetching.

Must be easy to replace later.

---

## Quick Actions

Each order card should support contextual actions:

---

### If Pending Payment

Button:

Complete Payment

Navigates:

/order/confirmation

---

### If Paid / Processing

Button:

View Details

Navigates:

/orders/[orderId]

---

### If Shipped

Button:

Track Order

Navigates:

/orders/[orderId]

---

## Empty State

If no orders:

Show premium empty state.

Example:

You haven't placed any orders yet.

CTA:

Start Shopping

Navigates:

/shop

---

## Status Styling

Status badges must be visually distinct.

Examples:

Pending → subtle warning style

Paid → success style

Shipped → premium highlight

Must still follow theme tokens.

---

## UI Primitive Rules

Use existing shadcn primitives:

- Card
- Button
- Badge
- Separator
- Skeleton (if needed)

Do NOT modify:

components/ui/*

---

## Styling Rules

Must use:

- theme tokens only
- luxury black + gold identity
- editorial spacing
- premium status hierarchy

No generic dashboard cards.

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

- make orders feel trustworthy
- surface actionable statuses
- prepare for backend integration later

Do NOT:

- fetch real orders
- mutate order state
- call APIs
- trigger emails

---

## Check When Done

- Orders page compiles
- Header renders
- Order cards render
- Status badges work
- Action buttons work
- Empty state works
- Mobile works
- Desktop works
- Premium consistency maintained

---

## Next Step Preview

👉 Single Order Details + Order Timeline UI