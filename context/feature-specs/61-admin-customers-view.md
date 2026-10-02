Read `AGENTS.md` before starting.

We are now building the **Admin Customers View UI** for Lily Waist Line.

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

Build the **Admin Customers Management UI**.

This allows admins to:

- view all customers
- inspect customer activity
- see order history per customer (UI only)
- identify high-value customers (mock logic)

This is:

> UI only (no backend integration)

Do NOT connect:

- Supabase
- Prisma
- authentication system
- server actions

yet.

---

## Route

Create:

app/(admin)/customers/page.tsx

This is the customers page.

---

## Core UX Purpose

Admins must quickly understand:

- who is buying
- how often they buy
- what they are buying
- customer value levels

---

## Layout Structure

---

### 1. Customers Header

Create:

components/admin/customers/admin-customers-header.tsx

Contains:

- Title: Customers
- Subtitle: customer insight context

Example:

Track and understand your customer base and purchasing behavior.

---

## 2. Customers Stats Bar

Create:

components/admin/customers/admin-customers-stats.tsx

Show:

---

### Total Customers

Example:

1,240

---

### Active Customers

Example:

320

---

### Returning Customers

Example:

180

---

## 3. Customers Table

Create:

components/admin/customers/admin-customers-table.tsx

Each row includes:

---

### Customer Name

---

### Email (mock)

---

### Total Orders

Example:

5 orders

---

### Total Spent

Example:

$450.00

---

### Status

Badge:

- New
- Returning
- VIP (mock logic)

---

### Last Order Date

Example:

May 11, 2026

---

### Actions

Buttons:

- View Profile

→ /admin/customers/[customerId]

---

## 4. Customer Empty State

Create:

components/admin/customers/admin-customers-empty.tsx

Message:

No customers found yet.

---

## 5. Customer Segmentation Rules

---

### VIP

High total spent (mock threshold)

---

### Returning

More than 1 order

---

### New

Only 1 order

---

UI only logic.

No backend computation.

---

## UI Primitive Rules

Use shadcn primitives:

- Table
- Card
- Badge
- Button
- Input
- Separator

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black / white / gold system
- structured admin data layout
- clean analytics feel
- no decorative UI

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

- keep customer data readable
- prioritize admin insight
- design for scaling into analytics later

Do NOT:

- connect backend
- fetch real users
- modify auth system
- persist data

---

## Check When Done

- Customers page renders
- Stats display correctly
- Table renders
- Badges work
- Actions UI works
- Empty state works
- Mobile works
- Desktop works
- Admin shell integration works
- Premium consistency maintained

---

## Next Step Preview

👉 Customer Profile Page (deep customer insight + order history view)