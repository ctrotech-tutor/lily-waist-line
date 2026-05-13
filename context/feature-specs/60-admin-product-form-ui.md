Read `AGENTS.md` before starting.

We are now building the **Admin Product Create/Edit Form UI** for Lily Waist Line.

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

Build a **Product Create + Edit Form UI**.

This allows admins to:

- create new products
- edit existing products
- define pricing, stock, variants (UI only)

This is:

> UI only (no persistence yet)

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- file upload storage
- database writes

yet.

---

## Routes

Create:

### New Product

```txt
/admin/products/new
``` id="lwprodnew60"

---

### Edit Product

```txt
/admin/products/[productId]/edit
``` id="lwprodedit60"

---

## Core UX Purpose

Admin must be able to:

- quickly create a product
- update product details safely
- manage variants clearly
- avoid confusion or missing fields

---

## Layout Structure

---

### 1. Product Form Shell

Create:

components/admin/products/form/admin-product-form-shell.tsx

Responsibilities:

- form layout container
- responsive spacing
- section grouping

---

## 2. Basic Product Info

Create:

components/admin/products/form/product-basic-info.tsx

Fields:

---

### Product Name

---

### Short Description

---

### Full Description

Textarea

---

## 3. Pricing Section

Create:

components/admin/products/form/product-pricing.tsx

Fields:

---

### Price

---

### Compare At Price (optional)

---

## 4. Inventory Section

Create:

components/admin/products/form/product-inventory.tsx

Fields:

---

### Stock Quantity

---

### Stock Status (computed UI only)

- In Stock
- Low Stock
- Out of Stock

---

## 5. Variants Section

Create:

components/admin/products/form/product-variants.tsx

Supports:

---

### Size Options

- XS
- S
- M
- L
- XL

---

### Compression Level

- Light
- Medium
- High

---

UI only (no logic persistence yet)

---

## 6. Product Media Section

Create:

components/admin/products/form/product-media.tsx

Supports:

- image upload UI (mock only)
- preview grid
- drag reorder UI (visual only)

No real upload.

---

## 7. Product Status Section

Create:

components/admin/products/form/product-status.tsx

Options:

- Draft
- Active
- Archived

---

## 8. Actions Section

Create:

components/admin/products/form/product-form-actions.tsx

Buttons:

---

### Save Product

UI only loading state

---

### Cancel

Navigate back:

/admin/products

---

## Form Behavior

---

### Validation Rules (UI only)

- product name required
- price required
- at least 1 variant required

No backend validation yet.

---

## UI Primitive Rules

Use shadcn primitives:

- Input
- Textarea
- Button
- Card
- Select
- Tabs (optional)
- Checkbox

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black / white / gold system
- structured admin form layout
- strong section separation
- minimal clutter
- high readability

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

- keep form modular
- separate concerns by section
- design for future backend binding

Do NOT:

- connect database
- upload files
- persist data
- call APIs
- mutate state globally

---

## Check When Done

- product form renders
- all sections load correctly
- layout is clean and structured
- mock interactions work
- navigation works
- mobile works
- desktop works
- admin shell integration works
- premium consistency maintained

---

## Next Step Preview

👉 Admin Customers View (user + order insight layer)