Read `AGENTS.md` before starting.

We are now building the **Authentication UI Foundation** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the shared authentication UI foundation for all auth routes.

This includes:

- shared auth layout
- shared auth shell
- shared auth form components
- shared auth input patterns

This is:

> UI foundation only

Do NOT connect:

- Supabase Auth
- Prisma
- Server Actions
- Email verification logic
- Password reset logic

yet.

---

## Route Group

Use App Router route groups.

Create or Update:
`app/(auth)/`

Do NOT wire all pages yet.

Only build shared UI foundation.

---

## Layout Goal

All auth pages must use:

> Premium 50 / 50 split layout

This means:

---

### Left Panel

Brand / editorial panel.

Purpose:

Create trust and emotional connection.

Must include:

- brand logo

Use:
`public/logo.png`


Include:

- luxury editorial heading
- short emotional supporting copy

Example tone:

> Sculpt confidence. Wear transformation.

Optional:

- subtle background image or brand texture
- gradient overlays using theme tokens only

---

### Right Panel

Form panel.

Purpose:

Render auth forms.

Must feel:

- clean
- premium
- distraction-free

---

## Layout Behavior

---

### Desktop

Use:

- 2-column split
- left = branding
- right = form content

No oversized empty space.

No vertical scrolling.

Forms must fit within viewport.

---

### Mobile

Brand panel should collapse elegantly.

Only form content should be visible first.

Brand identity should still be present.

Examples:

- small logo
- editorial heading

No overflow.

---

## Components To Create

Create:

---

### 1. Auth Layout Shell

File:
`components/auth/auth-shell.tsx`


Purpose:

Shared wrapper for all auth pages.

Responsibilities:

- 50/50 layout
- responsive behavior
- branding panel
- content panel

Must accept:

- children

---

### 2. Auth Header

File:
`components/auth/auth-header.tsx`

Purpose:

Reusable form header.

Must support:

- title
- subtitle

Examples:

- Welcome Back
- Create Your Account
- Reset Your Password

---

### 3. Auth Input

File:
`components/auth/auth-input.tsx`

Purpose:

Shared styled input wrapper.

Must use:

existing shadcn:

- Input

May support:

- label
- icon
- error state
- helper text

This will be reused across all auth forms.

---

### 4. Auth Footer Links

File:
`components/auth/auth-footer-links.tsx`


Purpose:

Reusable auth navigation links.

Examples:

- Already have an account?
- Forgot password?
- Back to sign in

Must support custom links via props.

---

## UI Primitive Rules

Use existing shadcn primitives:

- Card (if needed)
- Input
- Label
- Button

Do NOT rebuild primitives.

Do NOT modify:
`components/ui/*`


---

## Styling Rules

Must use:

- theme tokens only
- luxury typography
- editorial spacing
- gold-accent focus states

No:

- raw Tailwind colors
- generic SaaS auth styling
- rounded cartoonish forms

Must align with:

Lily Waist Line luxury black + gold identity.

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

- build reusable auth foundation
- prepare for future auth integration
- keep components isolated

Do NOT:

- build actual auth pages yet
- connect backend
- add real validation yet

---

## Check When Done

- Auth shell compiles
- 50/50 layout works
- Desktop works
- Mobile works
- No overflow
- No heavy scrolling
- Branding panel works
- Shared auth inputs work
- Shared footer links work
- Light mode works
- Dark mode works
- Premium consistency maintained