Read `AGENTS.md` before starting.

We are now building the **Admin Dashboard Overview UI** for Lily Waist Line.

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

Build the **Admin Dashboard Home (Overview Page)**.

This is the first screen admins see after login.

It should answer:

- How is the business performing?
- What needs attention?
- What just happened recently?

This is:

> UI only (mock data)

Do NOT connect:

- Supabase
- Prisma
- real analytics
- server actions

yet.

---

## Route

Create:

app/(admin)/page.tsx

This is the admin dashboard home.

---

## Core UX Purpose

Admin should immediately see:

- business health
- order activity
- revenue snapshot (mock)
- urgent tasks

---

## Layout Structure

---

### 1. Admin Header Section

Create:

components/admin/overview/admin-overview-header.tsx

Contains:

- “Dashboard” title
- short welcome message

Example:

Welcome back, Admin

Here’s what’s happening with Lily Waist Line today.

---

## 2. KPI Cards Section

Create:

components/admin/overview/admin-kpi-cards.tsx

Show 4 core metrics:

---

### Total Orders

Example:

128

---

### Revenue

Example:

$12,540

---

### Pending Orders

Example:

8

---

### Shipped Orders

Example:

34

---

All values are mock only.

Use clean card UI.

---

## 3. Recent Orders Section

Create:

components/admin/overview/recent-orders.tsx

Show list of latest orders:

Each row shows:

- Order ID
- Customer name
- Amount
- Status badge
- Date

Example statuses:

- Pending Payment
- Paid
- Shipped

---

## 4. Quick Actions Panel

Create:

components/admin/overview/admin-quick-actions.tsx

Buttons:

---

### Add Product

→ /admin/products/new

---

### View Orders

→ /admin/orders

---

### Manage Shipping

→ /admin/shipping

---

No backend logic yet.

---

## 5. Alerts Section

Create:

components/admin/overview/admin-alerts.tsx

Show system alerts like:

- Pending payments
- Low stock (mock)
- Unshipped orders

Example:

⚠️ 5 orders are awaiting payment confirmation

---

## UI Behavior

Dashboard must feel:

- operational
- fast
- clean
- data-driven

NOT marketing UI.

---

## Mock Data Rules

All values must be:

- static mock data
- consistent across refresh
- easy to replace later with API data

---

## UI Primitive Rules

Use existing shadcn primitives:

- Card
- Badge
- Button
- Separator
- Table (if needed)
- Skeleton (optional)

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- black / white / gold identity
- clean admin hierarchy
- readable data layout
- no decorative UI clutter

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

- keep admin dashboard actionable
- surface business clarity
- prioritize operations over visuals

Do NOT:

- fetch real analytics
- connect backend
- mutate data
- add authentication logic

---

## Check When Done

- Admin dashboard renders
- KPI cards display correctly
- Recent orders render
- Quick actions work
- Alerts show
- Mobile works
- Desktop works
- Layout integrates with admin shell
- Premium consistency maintained

---

## Next Step Preview

👉 Admin Orders Management System (core operational table)