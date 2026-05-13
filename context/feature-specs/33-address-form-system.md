Read `AGENTS.md` before starting.

We are now building the **Address Form System** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the reusable **Address Form UI** that will later support:

- adding a new address
- editing an existing address
- checkout address creation flow

This is:

> UI + form interaction only

Do NOT connect:

- Supabase
- Prisma
- Server Actions
- Checkout flow

yet.

Use local mock state only if needed.

---

## Route

Create:

### Add Address
`/address/new`

---

### Edit Address (future-ready)
`/address/[id]`


You do NOT need real dynamic data yet.

Just design the component so it supports both modes.

---

## Component To Create

Create:

---

### Address Form

File:
`/components/address/address-form.tsx`


This must be reusable.

Support:

- create mode
- edit mode

via props.

Example:

- `mode="create"`
- `mode="edit"`

---

## Form Fields

Use shadcn form primitives where needed.

Required fields:

---

### Personal Info

#### First Name
Required

#### Last Name
Required

#### Company
Optional

---

### Address Info

#### Address Line 1
Required

#### Address Line 2
Optional

#### City
Required

#### State / Province
Optional

#### Postal Code
Required

#### Country
Required

---

### Contact

#### Phone Number
Optional

---

### Default Address

Use:

- Checkbox or Switch

Label:

> Set as default shipping address

---

## UI Structure

Page should feel premium and intentional.

Recommended structure:

---

### 1. Page Header

Heading:

> Add New Address

or

> Edit Address

depending on mode.

Include supporting copy.

---

### 2. Form Card

Use shadcn Card.

Inside:

- grouped inputs
- proper spacing
- editorial layout

---

### 3. Footer Actions

Buttons:

#### Primary
Save Address

#### Secondary
Cancel

---

## Layout Rules

---

### Desktop

Use:

- elegant centered form
- max width container
- two-column layout where appropriate

Examples:

- First + Last Name side by side
- City + Postal side by side

---

### Mobile

Use:

- single column
- touch-friendly spacing
- no horizontal overflow

---

## UI Primitive Rules

Use existing shadcn primitives:

- Card
- Input
- Label
- Button
- Checkbox or Switch

Do NOT rebuild primitives.

Do NOT modify:
`components/ui/*`


---

## Interaction Rules

For now:

---

### Save Address

On submit:

- prevent default
- show success UI feedback only

No real persistence yet.

---

### Cancel

Should navigate back.

Use existing routing architecture.

---

## Mock Edit Mode

Create mock data example so edit mode can be visually tested.

Example:

- Jane Doe
- Dallas, Texas
- Default address

Do not hardcode into component logic.

Pass as props.

---

## Styling Rules

Must use:

- theme tokens only
- luxury typography
- editorial spacing
- gold-accent focus states

Do NOT use:

- raw Tailwind colors
- generic form styling

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

- build reusable form
- prepare for future checkout integration
- keep component boundaries clean

Do NOT:

- connect database
- connect auth
- create server actions
- integrate checkout yet

---

## Check When Done

- Form compiles
- Create mode works
- Edit mode works
- Cancel works
- Default toggle works
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Luxury consistency maintained