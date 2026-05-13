Read `AGENTS.md` before starting.

We are now building the **Admin System Foundation** for Lily Waist Line.

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

Build the foundational **Admin Dashboard Layout System**.

This is the structural shell all admin pages will use.

This is:

> UI only

Do NOT connect:

- Supabase Auth
- Admin verification
- Prisma
- Role checks
- Server Actions

yet.

---

## Route Group

Create:

```txt
app/(admin)/
``` id="lwadminroute55"

All admin pages must live here.

Do not mix admin routes with storefront routes.

---

## Core UX Purpose

Admin users need:

- fast navigation
- operational clarity
- low-friction workflows

This is not customer UI.

This is an operational workspace.

---

## Layout Structure

---

### Desktop

Use:

```txt
----------------------------------------
| Sidebar | Topbar                     |
|         |                            |
|         | Main Content               |
|         |                            |
----------------------------------------
``` id="lwadminlayout55"

---

### Mobile

Use:

- topbar
- hamburger menu
- slide-over admin sidebar

No horizontal overflow.

---

## Components To Create

---

### 1. Admin Layout Shell

Create:

components/admin/admin-shell.tsx

Responsibilities:

- responsive dashboard shell
- sidebar layout
- content area
- topbar integration

Accepts:

- children

---

### 2. Admin Sidebar

Create:

components/admin/admin-sidebar.tsx

Contains navigation:

---

### Dashboard

---

### Orders

---

### Products

---

### Customers

---

### Shipping

---

### Settings

---

Each item should support:

- active state
- hover state
- icons

Use lucide icons.

---

## Logo

Use brand logo from:

```txt
public/logo.png
``` id="lwlogo55"

Sidebar should feel premium and brand-aligned.

---

### 3. Admin Topbar

Create:

components/admin/admin-topbar.tsx

Contains:

---

### Left

Page title

---

### Right

For now:

- theme toggle
- admin avatar placeholder

No notifications yet.

---

### 4. Mobile Admin Navigation

Create:

components/admin/admin-mobile-nav.tsx

Responsibilities:

- mobile sidebar trigger
- slide-over menu

---

## Navigation Behavior

Sidebar must support:

---

### Active Route Highlighting

Current page clearly highlighted.

---

### Collapsible Mobile Behavior

Sidebar overlays content.

Must NOT push content.

---

## Default Admin Route

Create:

```txt
/admin
``` id="lwadminroot55"

This becomes:

Dashboard Home

for now.

---

## UI Primitive Rules

Use existing shadcn primitives:

- Sheet
- Button
- Avatar
- Separator
- ScrollArea
- Tooltip (optional)

Do NOT modify:

components/ui/*

---

## Styling Rules

Admin UI should still reflect Lily branding:

Use:

- black / white / gold system
- clean operational hierarchy
- strong readability

BUT:

Admin should feel more functional than editorial.

No storefront-style hero layouts.

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

- isolate admin routes
- keep layout reusable
- prepare for auth protection later

Do NOT:

- implement auth
- implement RBAC
- fetch admin data
- connect backend

---

## Check When Done

- Admin routes compile
- Layout shell works
- Sidebar works
- Topbar works
- Mobile navigation works
- Active route styling works
- Logo renders
- Mobile works
- Desktop works
- Premium consistency maintained

---

## Next Step Preview

👉 Admin Dashboard Overview (metrics + activity)