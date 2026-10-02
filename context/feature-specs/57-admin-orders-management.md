Read `AGENTS.md` before starting.

We are now building the **Admin Orders Management UI** for Lily Waist Line.

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

Build the **Admin Orders Management System UI**.

This allows admins to:

- view all orders
- filter by status
- search orders
- update order statuses (UI only)
- identify payment issues

This is:

> UI only (mock data)

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- real database mutations

yet.

---

## Route

Create:

app/(admin)/orders/page.tsx

This is the orders management page.

---

## Core UX Purpose

Admins must immediately answer:

- Which orders need attention?
- Which are paid or unpaid?
- Which are pending shipment?
- Which are completed?

---

## Layout Structure

---

### 1. Orders Page Header

Create:

components/admin/orders/admin-orders-header.tsx

Contains:

- title: Orders
- subtitle: operational context

Example:

Manage all customer orders, payments, and fulfillment.

---

## 2. Orders Filter Bar

Create:

components/admin/orders/admin-orders-filters.tsx

Includes:

---

### Status Filter

- All
- Pending Payment
- Paid
- Processing
- Shipped
- Delivered
- Cancelled

---

### Search Input

Search by:

- Order ID
- Customer name

---

No backend logic yet.

---

## 3. Orders Table

Create:

components/admin/orders/admin-orders-table.tsx

Each row includes:

---

### Order ID

Example:

LW-2026-001

---

### Customer

Name placeholder

---

### Amount

Example:

$120.00

---

### Payment Status

Badge:

- Pending
- Paid

---

### Fulfillment Status

Badge:

- Processing
- Shipped
- Delivered

---

### Date

Order date

---

### Actions

Buttons:

---

#### View

→ /admin/orders/[orderId]

---

#### Update Status (UI only dropdown)

Options:

- Mark as Paid
- Mark as Processing
- Mark as Shipped
- Mark as Delivered

No real updates yet.

---

## 4. Empty State

Create:

components/admin/orders/admin-orders-empty.tsx

If no orders:

Show:

No orders found.

---

## 5. Status Badge System

Must visually differentiate:

---

### Payment Status

- Pending → amber tone
- Paid → green tone

---

### Fulfillment Status

- Processing → neutral
- Shipped → blue tone
- Delivered → green tone

Must still follow theme tokens.

---

## Mock Data Rules

Use shared mock dataset:

- consistent order IDs
- consistent statuses
- consistent customer names

No random generation per render.

---

## UI Primitive Rules

Use shadcn primitives:

- Table
- Badge
- Button
- Input
- Select
- Card

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black / white / gold identity
- clean admin data grid layout
- strong readability
- minimal visual noise

No ecommerce storefront styling.

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

- prioritize operational clarity
- keep table readable
- design for admin speed

Do NOT:

- connect backend
- mutate orders
- persist status changes
- call APIs

---

## Check When Done

- Orders page renders
- Filters render
- Table renders correctly
- Status badges work
- Actions UI works
- Empty state works
- Mobile layout works
- Desktop layout works
- Admin shell integration works
- Premium consistency maintained

---

## Next Step Preview

👉 Admin Single Order Management Page (deep operational control + payment proof review)