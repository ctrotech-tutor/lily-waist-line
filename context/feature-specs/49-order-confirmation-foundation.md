Read `AGENTS.md` before starting.

We are now building the **Order Confirmation + Payment Instruction UI** for Lily Waist Line.

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

Build the **post-checkout confirmation screen**.

This page appears immediately after:

> Place Order

This page must:

- reassure the customer
- confirm order creation
- clearly explain next payment steps

This is:

> UI only

Do NOT connect:

- Supabase
- Prisma
- real order creation
- payment APIs
- email systems

yet.

---

## Route

Create:

/order/confirmation

Use existing routing structure.

Do not change route architecture.

---

## Core UX Purpose

This page must answer:

---

### 1

Did my order go through?

---

### 2

What do I do next?

---

### 3

How do I complete payment?

---

If these are unclear:

Conversion drops.

---

## Components To Create

---

### 1. Order Confirmation Layout

Create:

components/order/order-confirmation-shell.tsx

Responsibilities:

- centered success experience
- responsive layout
- premium spacing

---

### 2. Order Success Header

Create:

components/order/order-success-header.tsx

Contains:

- success icon
- confirmation title
- supporting copy

---

### Title Example

Order Received

---

### Supporting Copy Example

Your order has been created successfully. Complete payment to begin processing.

---

## Order Details Card

Create:

components/order/order-details-card.tsx

Show mock data:

- Order Number
- Order Date
- Payment Status

---

### Example

Payment Status:

Pending Payment

---

## Payment Instruction Panel

Create:

components/order/payment-next-step.tsx

Must dynamically support:

---

### Cash App

Show:

- Cash App handle placeholder
- payment instruction copy

Example:

Send your payment using the Cash App details below.

---

### PayPal

Show:

- PayPal email placeholder
- instruction copy

Example:

Complete your payment securely through PayPal.

---

Use local UI state only.

---

## CTA Buttons

Primary:

Complete Payment

Behavior:

Cash App:

show payment instructions

PayPal:

show redirect preparation state

UI only.

---

Secondary:

Continue Shopping

Navigates:

/shop

---

## Trust Messaging

Include:

- Secure order handling
- Manual payment verification
- Shipping begins after payment confirmation

This reinforces trust.

---

## UI Primitive Rules

Use existing shadcn primitives:

- Card
- Button
- Badge
- Alert

Do NOT modify:

components/ui/*

---

## Styling Rules

Must use:

- theme tokens only
- luxury black + gold identity
- editorial spacing
- premium trust-building hierarchy

No generic “Thank you for your order” page.

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

- make post-checkout flow feel trustworthy
- reduce payment confusion
- prepare for real order integration later

Do NOT:

- trigger real payments
- generate real order IDs
- send emails
- upload payment proofs

---

## Check When Done

- Confirmation page compiles
- Success state renders
- Order details render
- Payment instructions render
- CTA buttons work
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Premium consistency maintained

---

## Next Step Preview

👉 Payment Proof Upload UI