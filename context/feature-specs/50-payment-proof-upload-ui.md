Read `AGENTS.md` before starting.

We are now building the **Payment Proof Upload UI** for Lily Waist Line.

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

Build the **Payment Proof Upload Flow UI**.

This page allows customers to upload proof after making payment through:

- Cash App
- PayPal

This is:

> UI only

Do NOT connect:

- Supabase Storage
- Prisma
- Database
- Server Actions
- Email notifications

yet.

---

## Route

Create:

/order/payment-proof

Use existing route structure.

---

## Core UX Purpose

This page must answer:

---

### 1

I paid… now what?

---

### 2

How do I prove my payment?

---

### 3

When will my order be processed?

---

This screen must reduce confusion.

---

## Components To Create

---

### 1. Payment Proof Layout

Create:

components/order/payment-proof-shell.tsx

Responsibilities:

- centered upload flow
- premium spacing
- mobile-first

---

### 2. Payment Proof Header

Create:

components/order/payment-proof-header.tsx

Contains:

Title example:

Upload Payment Proof

Supporting copy:

Upload your payment screenshot so we can verify and begin processing your order.

---

## Upload Section

Create:

components/order/payment-proof-dropzone.tsx

Supports:

---

### Upload Types

Allow UI support for:

- images
- screenshots
- receipt images

Examples:

- png
- jpg
- jpeg
- webp

UI only.

No real uploads yet.

---

## Upload Behavior

Support:

---

### Drag and Drop

AND

---

### Click To Upload

Use local UI preview state only.

---

## File Preview

After selecting file:

Show:

- image preview
- file name
- remove option

---

## Additional Payment Details

Below upload area:

---

### Transaction Reference

Optional input.

Example:

Cash App transaction ID or PayPal transaction reference.

Use shared input styling.

---

### Payment Method Used

Readonly display:

- Cash App
OR
- PayPal

Mock only.

---

## Trust Messaging

Include:

Example:

Your order will be verified manually before shipping begins.

---

## CTA

Primary Button:

Submit Proof

Behavior:

UI only:

- loading state
- success state

After success:

Show:

Payment proof submitted successfully.

Our team will verify your payment shortly.

---

Secondary:

Back To Orders

Navigates:

/orders

---

## UI Primitive Rules

Use existing shadcn primitives:

- Card
- Button
- Input
- Alert
- Label

Do NOT modify:

components/ui/*

---

## Styling Rules

Must use:

- theme tokens only
- luxury black + gold identity
- editorial spacing
- premium upload experience

No generic dashboard uploader.

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

- make upload flow feel safe
- reassure customer
- prepare for storage integration later

Do NOT:

- upload real files
- call storage APIs
- persist proof
- send emails

---

## Check When Done

- Payment proof page compiles
- Upload UI works
- Preview works
- Remove file works
- Transaction input works
- Submit works
- Success state works
- Mobile works
- Desktop works
- Premium consistency maintained

---

## Next Step Preview

👉 Customer Orders + Order Tracking UI