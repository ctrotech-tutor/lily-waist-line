Read `AGENTS.md` before starting.

We are now building the **Admin Shipping Management UI** for Lily Waist Line.

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

Build the **Admin Shipping & Fulfillment UI**.

This allows admins to:

- assign carriers
- add tracking numbers
- update shipping status
- monitor fulfillment pipeline

This is:

> UI only (no real logistics integration)

Do NOT connect:

- shipping APIs
- Supabase
- Prisma
- server actions

yet.

---

## Route

Create:

app/(admin)/shipping/page.tsx

---

## Core UX Purpose

Admin must answer:

- Which orders are ready to ship?
- Which orders are already shipped?
- What needs tracking info?

---

## Layout Structure

---

### 1. Shipping Header

Create:

components/admin/shipping/admin-shipping-header.tsx

Contains:

- Title: Shipping
- Subtitle: fulfillment operations

Example:

Manage order fulfillment, carriers, and tracking updates.

---

## 2. Shipping Pipeline Overview

Create:

components/admin/shipping/admin-shipping-stats.tsx

Show:

---

### Pending Shipment

Example:

12

---

### Shipped

Example:

34

---

### Delivered

Example:

78

---

## 3. Shipping Orders Table

Create:

components/admin/shipping/admin-shipping-table.tsx

Each row includes:

---

### Order ID

---

### Customer

---

### Status

- Processing
- Shipped
- Delivered

---

### Carrier

Example:

USPS / DHL / FedEx (mock)

---

### Tracking Number

Example:

Not assigned / 9400XXXX

---

### Actions

Buttons:

---

#### Add Tracking

UI modal placeholder

---

#### Mark as Shipped

UI only

---

#### Mark as Delivered

UI only

---

## 4. Shipping Update Modal (UI only)

Create:

components/admin/shipping/admin-shipping-modal.tsx

Fields:

---

### Carrier Name

---

### Tracking Number

---

### Shipping Date

---

## 5. Empty State

Create:

components/admin/shipping/admin-shipping-empty.tsx

Message:

No shipments available.

---

## UI Primitive Rules

Use shadcn primitives:

- Table
- Card
- Button
- Input
- Dialog (for modal)
- Badge

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black / white / gold system
- operational logistics layout
- clean table-first UI
- minimal visual noise

No storefront styling.

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

- make shipping workflow very clear
- prioritize operational speed
- design for real warehouse usage later

Do NOT:

- connect real shipping APIs
- persist tracking data
- mutate order state
- trigger notifications

---

## Check When Done

- shipping page renders
- stats display correctly
- table renders
- modal works
- actions UI works
- empty state works
- mobile works
- desktop works
- admin shell integration works
- premium consistency maintained

---

## Next Step Preview

👉 Admin Settings + Business Configuration Layer