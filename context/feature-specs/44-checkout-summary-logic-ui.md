Read `AGENTS.md` before starting.

We are now building the **Checkout Summary Logic UI** for Lily Waist Line.

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

Enhance the **Checkout Summary Panel** with realistic UI logic using mock data.

This includes:

> pricing structure + item preview + order breakdown UI

This is:

> UI only (no backend)

Do NOT connect:

- cart system
- database
- Stripe or Cash App logic
- address system

yet.

---

## Components To Use

Must extend:
`components/checkout/checkout-summary.tsx`


and related checkout shell components.

---

## Data Model (Mock Only)

Use local mock structure:

```ts
const mockCart = [
  {
    id: "1",
    name: "Elite Sculpt Waist Trainer",
    price: 120,
    quantity: 1,
    image: "/img-1.png"
  }
]
```
---

## Summary Sections

---

### 1. Item Preview

Show:

- product image
- name
- quantity
- price

Limit:

- max 2–3 visible items
- overflow → “+ more items”

---

### 2. Pricing Breakdown

Show:

- Subtotal
- Shipping (placeholder)
- Discount (optional UI only)
- Total

---

#### Rules

- Subtotal = sum(mockCart)
- Shipping = fixed UI placeholder (e.g. $10)
- Total = subtotal + shipping

No backend logic.

---

### 3. Promo Code UI (Optional)

Include UI only:

- input field
- apply button

No validation yet.

---

### 4. Total Emphasis Block

Must be visually stronger:

- larger font
- gold accent highlight for total
- separated section

---

## UI Behavior

---

### Desktop

Summary is:

- sticky
- always visible
- scroll-independent

---

### Mobile

Summary becomes:

- collapsible accordion OR bottom section

Must not block checkout flow.

---

## UX Rules

Checkout summary must:

- constantly reassure user
- reduce confusion
- show final price clearly
- feel “luxury receipt-like”

Not like generic ecommerce UI.

---

## UI Primitive Rules

Use:

- Card
- Separator
- Input
- Button
- Badge

Do NOT modify:
`components/ui/*`


---

## Styling Rules

Must use:

- design tokens only
- luxury black + gold identity
- clean spacing system
- editorial typography

No:

- noisy ecommerce pricing blocks
- default Shopify-like UI

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

- keep pricing logic simple and mock-based
- ensure UI clarity
- maintain consistency with checkout shell

Do NOT:

- connect real cart system
- fetch backend data
- calculate server-side totals

---

## Check When Done

- Summary renders correctly
- Item preview works
- Pricing breakdown visible
- Total highlighted properly
- Mobile works
- Desktop sticky works
- No backend integration exists
- UI feels premium and clear

---

## Next Step Preview

👉 Shipping Address Integration (connect `/address` UI flow into checkout)
