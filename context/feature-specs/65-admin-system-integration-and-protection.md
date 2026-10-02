Read `AGENTS.md` before starting.

We are now building the **Admin System Integration & Protection Layer** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Wire together the entire **admin system into a coherent, protected architecture**.

This includes:

- route protection structure
- layout consistency validation
- navigation integrity
- mock-to-real readiness cleanup
- system boundaries enforcement

This is:

> structural integration only

Do NOT connect:

- Supabase roles
- Prisma queries
- authentication logic
- real permissions system

yet.

---

## Key Objective

At this stage:

> Admin system should behave like a real production dashboard, even if data is still mocked.

---

## 1. Route Group Protection Structure

Ensure all admin routes are inside:

`app/(admin)/`

Verify structure:

- /admin
- /admin/orders
- /admin/products
- /admin/customers
- /admin/shipping
- /admin/settings

AND nested routes:

- /admin/orders/[orderId]
- /admin/customers/[customerId]

---

## 2. Admin Layout Enforcement

Confirm:

- all pages use `admin-shell`
- sidebar is persistent
- topbar is consistent
- mobile nav works across all pages

No admin page should exist outside layout.

---

## 3. Navigation Integrity Layer

Update sidebar navigation behavior:

Ensure:

- active route highlighting works across nested routes
- deep routes still highlight parent section
- no broken links

Example:

/admin/orders/123 → highlights "Orders"

---

## 4. Mock Data Centralization

Create a single mock source:
`lib/mock/admin-data.ts`

Contains:

- orders
- products
- customers
- shipping data

---

## Rule:

All admin pages must use THIS source only.

No duplicate mock datasets.

---

## 5. UI Consistency Enforcement

Audit admin UI for:

- consistent card usage
- consistent badge styles
- consistent table layouts
- consistent spacing system

Fix inconsistencies by standardizing:

- admin-card patterns
- admin-table patterns
- admin-section headers

---

## 6. Permission Simulation Layer (UI ONLY)

Create conceptual role boundary:

- Admin (full access)
- Viewer (read-only UI state only)

This is:

> visual simulation only

Do NOT enforce real auth yet.

---

## 7. Action Simulation System

All admin actions must behave like:

- loading state
- success toast (UI only)
- no real mutation

Examples:

- "Mark as Shipped"
- "Verify Payment"
- "Save Product"

All must be mocked.

---

## 8. Route Consistency Audit

Ensure:

- all admin routes follow naming conventions
- no inconsistent nesting
- no duplicate route purposes

Fix structure if needed.

---

## 9. Performance Readiness

Ensure:

- no unnecessary re-renders in admin layout
- no heavy client components unless needed
- server components used where possible (UI only)

---

## 10. Final System State Validation

Admin system must feel:

- stable
- connected
- production-ready
- operational
- logically complete

Even without backend integration.

---

## UI Primitive Rules

Use:

- shadcn/ui only
- existing admin components only

Do NOT modify:

components/ui/*

---

## Styling Rules

Must remain:

- luxury black / white / gold identity
- clean admin structure
- operational UI clarity

No storefront styling leaks.

---

## Important Rules

Do:

- unify all admin modules
- ensure consistency across system
- prepare for real backend integration later

Do NOT:

- implement authentication
- connect Supabase roles
- write real API logic
- mutate data permanently

---

## Check When Done

- admin routes fully aligned
- layout fully consistent
- navigation fully stable
- mock data centralized
- UI patterns unified
- system feels production-ready
- no orphan routes
- no inconsistent components

---

## Final Outcome

At this point:

👉 Lily Waist Line Admin System behaves like a real ecommerce control panel

Even though backend is still mocked, the architecture is now fully scalable.

---

## Next Phase Preview

👉 Backend Integration Phase:
- Supabase real data wiring
- Prisma query implementation
- Auth + role protection
- Stripe/Cash App real flow binding
- Email system activation