Read `AGENTS.md` before starting.

We are now composing the full **Address Management Flow** for Lily Waist Line using the components already built.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Wire the completed address components into the real application routes.

This creates:

> A complete customer address management experience

for future checkout integration.

---

## Routes To Wire

Use the existing App Router structure.

---

### Address List
`/address`


---

### Add Address
`address/new`


---

### Edit Address
`/address/[id]`


Use mock address data for now.

Do NOT connect:

- Supabase
- Prisma
- Server Actions

yet.

---

## Components To Use

Use the components already created.

---

### Navigation

Use existing:

- navbar
- mobile navigation

---

### Address Components

Use:

- address-header
- address-card
- add-address-button
- empty-address-state
- address-form

---

### Footer

Use existing footer component.

---

## Page Flow

The flow must feel natural and premium.

---

# `/address`

Use this structure:

---

### 1. Navigation

Use existing global navigation.

---

### 2. Address Header

Introduce the address system.

---

### 3. Address State

Support both:

---

## Empty State

If no addresses exist:

Render:

- empty-address-state

---

## Saved State

If addresses exist:

Render:

- address cards
- add address CTA

Use mock address data.

---

### 4. Footer

Use existing footer.

---

# `/address/new`

Use this structure:

---

### 1. Navigation

---

### 2. Address Form

Use:

- address-form in create mode

---

### 3. Footer

---

# `/address/[id]`

Use this structure:

---

### 1. Navigation

---

### 2. Address Form

Use:

- address-form in edit mode

Pass mock address data.

---

### 3. Footer

---

## Navigation Behavior

---

### Add Address CTA

When clicked:

Navigate to:
`/address/new`


---

### Edit Address

When clicked:

Navigate to:
`/address/[id]`


Use mock ID.

---

### Cancel

Returns user to:
`/address`

---

## UX Rules

Must feel:

- premium
- calm
- trustworthy
- like a real ecommerce account area

---

## UI Primitive Rules

Use existing shadcn primitives only.

Do NOT rebuild primitives.

Do NOT modify:
`components/ui/*`


---

## Styling Rules

Must use:

- theme tokens only
- design typography
- editorial spacing
- gold-accent interactions

No:

- raw colors
- generic dashboard styling

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

- maintain route consistency
- use reusable components
- preserve clean separation

Do NOT:

- connect backend yet
- persist data yet
- wire checkout yet

---

## Check When Done

- All routes compile
- Navigation works
- Add flow works
- Edit flow works
- Cancel flow works
- Empty state works
- Saved state works
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Premium consistency maintained