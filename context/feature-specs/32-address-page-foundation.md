Read `AGENTS.md` before starting.

We are now building the **Address Management Page Foundation** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the standalone **Address Page UI foundation** where authenticated users will eventually manage their shipping addresses.

This is:

> Address UI only

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- Checkout flow

yet.

Use mock local data only.

---

## Route

Create:
/address


Use existing App Router structure.

---

## Future Data Model Context (DO NOT IMPLEMENT YET)

This UI must be designed to support the following future model:

- multiple saved addresses
- one default address
- shipping-focused address records

Future Prisma model will support:

- first name
- last name
- company
- address lines
- city
- state
- postal code
- country
- phone
- default selection

Design with this future structure in mind.

---

## Components To Create

Create:

---

### 1. Address Header

File:
`components/address/address-header.tsx`


If user has no addresses:

Show:

- elegant empty state
- short supportive copy
- Add Address CTA

Must feel premium, not generic.

---

## Page Behavior

Support two states using mock data:

---

### State A — Empty

Render:

- Empty Address State

---

### State B — Saved Addresses

Render:

- Header
- Address cards
- Add Address CTA

Use temporary mock addresses.

---

## Layout Rules

---

### Desktop

Use:

- centered container
- elegant vertical spacing
- cards stacked or 2-column depending on viewport

---

### Mobile

Use:

- single column
- full width cards
- touch-friendly spacing

No overflow.

---

## UI Primitive Rules

Use existing shadcn primitives where needed:

- Card
- Button
- Badge (if already installed)

Do NOT rebuild primitives.

Do NOT modify:
`components/ui/*`


---

## Styling Rules

Must use:

- theme tokens only
- luxury typography
- editorial spacing
- gold accent interactions

Do NOT use:

- raw colors
- default gray ecommerce styling

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

- build reusable address components
- design for future checkout integration
- keep business logic out of UI

Do NOT:

- connect database
- create server actions
- wire checkout yet
- implement edit logic yet

---

## Check When Done

- Address page compiles
- Empty state works
- Mock address state works
- Cards render correctly
- Default badge renders
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Premium design consistency maintained