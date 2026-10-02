Read `AGENTS.md` before starting.

We are now building the **Admin Product Management UI** for Lily Waist Line.

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

Build the **Admin Product Management System UI**.

This allows admins to:

- view all products
- create products (UI only)
- edit products (UI only)
- delete products (UI only)
- manage stock visibility (UI only)

This is:

> UI only (no backend integration)

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- file uploads
- database mutations

yet.

---

## Route

Create:

app/(admin)/products/page.tsx

This is the product management page.

---

## Core UX Purpose

Admin must quickly answer:

- What products are live?
- What is in stock?
- What needs updating?
- What should be removed?

---

## Layout Structure

---

### 1. Products Header

Create:

components/admin/products/admin-products-header.tsx

Contains:

- Title: Products
- Subtitle: catalog management context

Example:

Manage your waist trainer catalog, pricing, and availability.

---

## 2. Product Controls Bar

Create:

components/admin/products/admin-products-controls.tsx

Includes:

---

### Add Product Button

→ /admin/products/new

---

### Search Input

Search by:

- product name
- SKU (mock)

---

### Filter Dropdown

- All
- In Stock
- Low Stock
- Out of Stock

---

## 3. Product Grid / Table

Create:

components/admin/products/admin-products-table.tsx

Each row includes:

---

### Product Image

Thumbnail placeholder

---

### Product Name

Example:

Elite Sculpt Waist Trainer

---

### Price

Example:

$89.99

---

### Stock Status

Badge:

- In Stock
- Low Stock
- Out of Stock

---

### Category

Example:

Waist Trainers

---

### Actions

Buttons:

- Edit
- Delete
- View

All UI only.

---

## 4. Empty State

Create:

components/admin/products/admin-products-empty.tsx

Message:

No products found.

Add your first product to begin building your catalog.

---

## 5. Product Status Rules

---

### Stock Badges

- In Stock → green tone
- Low Stock → amber tone
- Out of Stock → red tone

Must use theme tokens only.

---

## Mock Data Rules

Use consistent product dataset across:

- storefront shop
- admin dashboard
- product pages (future)

No random per-page variation.

---

## UI Primitive Rules

Use shadcn primitives:

- Table
- Card
- Button
- Input
- Select
- Badge

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black / white / gold identity
- structured admin catalog layout
- clean commerce data grid
- minimal visual noise

No storefront hero styling.

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

- keep catalog management fast
- prioritize clarity and structure
- design for scalability

Do NOT:

- connect backend
- mutate product data
- implement uploads
- integrate storage
- call APIs

---

## Check When Done

- Products page renders
- Controls bar works
- Product table renders
- Actions UI works
- Empty state works
- Stock badges display correctly
- Mobile works
- Desktop works
- Admin shell integration works
- Premium consistency maintained

---

## Next Step Preview

👉 Admin Product Create/Edit Form (high complexity UI layer)