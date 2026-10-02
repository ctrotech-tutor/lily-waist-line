Read `AGENTS.md` before starting.

We are now building the **Admin Customer Profile UI** for Lily Waist Line.

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

Build the **Admin Single Customer Profile UI**.

This allows admins to:

- view full customer profile
- see order history (mock)
- analyze spending behavior
- understand customer value

This is:

> UI only (no backend integration)

Do NOT connect:

- Supabase
- Prisma
- auth system
- server actions

yet.

---

## Route

Create:

app/(admin)/customers/[customerId]/page.tsx

---

## Core UX Purpose

Admin must answer:

- Who is this customer?
- What have they purchased?
- How valuable are they?
- Are they active or inactive?

---

## Layout Structure

---

### 1. Customer Profile Header

Create:

components/admin/customers/profile/admin-customer-profile-header.tsx

Contains:

- customer name
- email (mock)
- status badge (VIP / Returning / New)

Example:

Jane Doe

VIP Customer

---

## 2. Customer Stats Cards

Create:

components/admin/customers/profile/admin-customer-stats.tsx

Show:

---

### Total Orders

Example:

8

---

### Total Spent

Example:

$720.00

---

### Last Order Date

Example:

May 11, 2026

---

## 3. Customer Order History

Create:

components/admin/customers/profile/admin-customer-orders.tsx

Each order shows:

- Order ID
- Date
- Status
- Total

Includes action:

- View Order → /admin/orders/[orderId]

---

## 4. Customer Activity Timeline

Create:

components/admin/customers/profile/admin-customer-activity.tsx

Show:

---

### Events (mock)

- Account created
- First purchase
- Payment completed
- Order shipped

---

## 5. Customer Notes Panel

Create:

components/admin/customers/profile/admin-customer-notes.tsx

Admin-only notes (UI only):

- “Prefers high compression waist trainers”
- “Frequent buyer”

---

## 6. Quick Actions

Create:

components/admin/customers/profile/admin-customer-actions.tsx

Buttons:

---

### View Orders

→ /admin/orders

---

### Contact Customer

(UI only placeholder)

---

### Flag Customer

(UI only)

---

## UI Primitive Rules

Use shadcn primitives:

- Card
- Badge
- Button
- Separator
- Tabs (optional)

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black / white / gold system
- structured profile layout
- strong hierarchy (identity → stats → activity)
- clean CRM-style UI

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

- treat this like CRM system UI
- prioritize clarity of customer value
- structure data logically

Do NOT:

- connect backend
- fetch real customer data
- mutate state
- integrate auth logic

---

## Check When Done

- customer profile page renders
- header displays correctly
- stats cards work
- order history renders
- activity timeline works
- notes panel works
- actions work
- mobile works
- desktop works
- admin shell integration works
- premium consistency maintained

---

## Next Step Preview

👉 Shipping Management System (carrier + fulfillment control layer)