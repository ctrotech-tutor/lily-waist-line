Read `AGENTS.md` before starting.

We are now building the **Reset Password UI** for Lily Waist Line using the shared auth foundation already created.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the customer **Reset Password Page UI**.

Use the shared auth system already created.

This is:

> UI only

Do NOT connect:

- Supabase Auth
- Reset tokens
- Prisma
- Server Actions

yet.

---

## Route

Create or update:
`app/(auth)/reset-password/page.tsx`

Use the existing App Router structure.

Later this may receive:

- token
- recovery parameters

via URL.

Do NOT implement token logic yet.

---

## Components To Use

Use the auth components already created.

---

### Required

Use:

- auth-shell
- auth-header
- auth-input
- auth-footer-links

---

## Page Content

Render:

---

### Header

Use:

Title:

> Create a New Password

Subtitle example:

> Choose a secure password to continue your journey.

Luxury editorial tone.

---

## Form

Use shadcn primitives.

Fields:

---

### New Password

Required

Type:

password

Must support:

- password visibility toggle

Use:

- Eye
- EyeOff

from `lucide-react`

---

### Confirm New Password

Required

Type:

password

Must support:

- password visibility toggle

---

## Password Guidance

Render supportive helper copy.

Example:

> Use at least 8 characters for stronger protection.

UI only.

No validation logic yet.

---

## Primary CTA

Button:

> Update Password

Use existing shadcn Button.

Full width.

---

## Success UI State

Support UI-only success state.

After submit:

Replace form with:

---

### Success Message

Example:

> Your password has been updated.

Supporting copy:

> You may now sign in with your new password.

No real password update yet.

---

## Footer Links

Use:

auth-footer-links

Render:

> Back to Sign In

Navigate to:
`/login`


---

## Interaction Rules

For now:

---

### Update Password

On submit:

- prevent default
- show loading state
- then show success UI state

No real password reset.

---

### Back To Sign In

Must navigate.

---

## Layout Rules

Must fit viewport.

No heavy scrolling.

---

### Desktop

Centered inside auth-shell.

---

### Mobile

Single-column.

Touch-friendly.

No overflow.

---

## UI Primitive Rules

Use existing shadcn primitives:

- Button
- Input
- Label

Do NOT rebuild primitives.

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must use:

- theme tokens only
- luxury typography
- editorial spacing
- gold-accent interactions

No:

- generic auth styling
- raw Tailwind colors

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

- reuse shared auth foundation
- support clean success state

Do NOT:

- connect backend
- verify tokens
- persist passwords
- create auth sessions

---

## Check When Done

- Reset password page compiles
- Password toggles work
- Submit works
- Loading state works
- Success state works
- Back to login works
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Premium consistency maintained

---

## Next Step Preview

👉 Verify Email UI