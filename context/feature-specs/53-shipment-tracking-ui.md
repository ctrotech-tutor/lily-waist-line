Read `AGENTS.md` before starting.

We are now building the **Shipment Tracking UI** for Lily Waist Line.

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

Build the **Shipment Tracking UI**.

This page allows customers to:

- see carrier information
- view tracking number
- monitor shipping progress
- know delivery stage

This is:

> UI only

Do NOT connect:

- carrier APIs
- Supabase
- Prisma
- server actions

yet.

---

## Route

Create:

/orders/[orderId]/tracking

Use existing App Router structure.

Do not change routing structure.

---

## Core UX Purpose

This page must answer:

---

### 1

Has my package shipped?

---

### 2

Which carrier is handling it?

---

### 3

Where is my package right now?

---

### 4

When can I expect delivery?

---

If unclear:

Support tickets increase.

---

## Components To Create

---

### 1. Tracking Layout

Create:

components/orders/tracking-shell.tsx

Responsibilities:

- responsive page layout
- premium content spacing
- organized information flow

---

### 2. Tracking Header

Create:

components/orders/tracking-header.tsx

Contains:

- Order Number
- Carrier Name
- Tracking Number

Example:

LW-2026-001

Carrier:

USPS

Tracking:

9400XXXXXXXX

---

## Shipment Status Card

Create:

components/orders/shipment-status-card.tsx

Show:

---

### Current Status

Examples:

- Label Created
- In Transit
- Out For Delivery
- Delivered

---

### Estimated Delivery

Example:

May 15, 2026

---

## Shipping Timeline

Create:

components/orders/shipping-timeline.tsx

This is critical.

---

### Timeline Steps

1. Label Created

2. Package Received

3. In Transit

4. Out For Delivery

5. Delivered

---

## Timeline Rules

- Completed stages highlighted
- Current stage emphasized
- Future stages dimmed

Mock only.

---

## Shipment Updates Feed

Create:

components/orders/shipment-updates.tsx

Show example updates:

---

May 11, 2026

Package accepted at facility

---

May 12, 2026

Departed regional center

---

May 13, 2026

Arrived at destination hub

---

Mock only.

---

## Actions

---

### Copy Tracking Number

Button:

Copy Tracking Number

Use client-side clipboard UI only.

---

### Continue Shopping

Button:

/shop

---

## Optional External Carrier Action

Button:

Track On Carrier Site

This is:

UI only

Do NOT use real carrier URLs yet.

Can use placeholder.

---

## Mock Data

Use local shipment data only.

Easy to replace later.

---

## UI Primitive Rules

Use existing shadcn primitives:

- Card
- Button
- Badge
- Separator
- Tooltip (optional)

Do NOT modify:

components/ui/*

---

## Styling Rules

Must use:

- theme tokens only
- luxury black + gold identity
- editorial spacing
- premium tracking visualization

No generic logistics UI.

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

- make tracking clear
- reduce support confusion
- build trust after purchase

Do NOT:

- connect carrier APIs
- fetch live tracking
- update shipment data
- persist anything

---

## Check When Done

- Tracking page compiles
- Header renders
- Status card renders
- Timeline works
- Updates feed works
- Copy button works
- Navigation works
- Mobile works
- Desktop works
- Premium consistency maintained

---

## Next Step Preview

👉 Orders System Wiring (connect Orders → Details → Tracking)