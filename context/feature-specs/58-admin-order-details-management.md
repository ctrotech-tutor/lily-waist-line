Read `AGENTS.md` before starting.

We are now building the **Admin Single Order Management UI** for Lily Waist Line.

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

Build the **Admin Order Details Page UI**.

This allows admins to:

- inspect full order details
- verify payment proof
- update payment status (UI only)
- manage fulfillment status
- prepare shipping data

This is:

> UI only (no backend updates)

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- real payment verification
- email systems

yet.

---

## Route

Create:

app/(admin)/orders/[orderId]/page.tsx

This is the admin order detail page.

---

## Core UX Purpose

Admin must answer:

- Did this customer actually pay?
- What did they buy?
- Has it been shipped?
- What action is needed next?

---

## Layout Structure

---

### 1. Order Header

Create:

components/admin/order/admin-order-header.tsx

Contains:

- Order ID
- Date
- Customer name
- Order status badges

---

## 2. Payment Review Panel

Create:

components/admin/order/admin-payment-review.tsx

This is CRITICAL.

Show:

---

### Payment Method

- Cash App OR PayPal

---

### Payment Status

- Pending
- Verified
- Rejected (UI only)

---

### Payment Proof Section

If uploaded (mock):

- image preview
- zoom placeholder
- file name

---

### Admin Actions

Buttons:

- Verify Payment
- Reject Payment

UI only.

---

## 3. Order Items Panel

Create:

components/admin/order/admin-order-items.tsx

Shows:

- product image
- product name
- quantity
- variant info
- price

---

## 4. Customer Info Panel

Create:

components/admin/order/admin-customer-info.tsx

Shows:

- name
- email (mock)
- shipping address
- phone number

---

## 5. Fulfillment Panel

Create:

components/admin/order/admin-fulfillment-panel.tsx

Shows:

---

### Fulfillment Status

- Processing
- Shipped
- Delivered

---

### Shipping Actions (UI only)

- Mark as Processing
- Mark as Shipped
- Mark as Delivered

---

### Carrier Info Fields (UI only)

- Carrier Name
- Tracking Number

---

## 6. Risk / Alert Panel

Create:

components/admin/order/admin-order-alerts.tsx

Show:

- unpaid order warning
- missing proof warning
- high value order highlight

---

## Mock Data Rules

Use consistent mock order data shared with:

- admin orders table
- customer order pages

No random per-page variation.

---

## UI Primitive Rules

Use:

- Card
- Badge
- Button
- Tabs (optional)
- Separator
- Image

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black / white / gold system
- structured admin layout
- strong hierarchy for action panels
- no decorative ecommerce styling

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

- prioritize admin decision-making
- clearly separate payment vs fulfillment
- keep actions obvious and structured

Do NOT:

- connect backend
- mutate order state
- trigger real verification logic
- send emails
- update database

---

## Check When Done

- Order detail page renders
- Payment review panel works
- Order items render correctly
- Customer info renders
- Fulfillment panel renders
- Alerts display correctly
- Mobile works
- Desktop works
- Admin shell integrates properly
- Premium consistency maintained

---

## Next Step Preview

👉 Admin Product Management System (catalog control layer)