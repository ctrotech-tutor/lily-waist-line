Read `AGENTS.md` before starting.

We are now building the **Forgot Password UI** for Lily Waist Line using the shared auth foundation already created.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the customer **Forgot Password Page UI**.

Use the shared auth system already created.

This is:

> UI only

Do NOT connect:

- Supabase Auth
- Password reset emails
- Prisma
- Server Actions

yet.

---

## Route

Create or update:
`app/(auth)/forgot-password/page.tsx`


Use the existing App Router structure.

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

> Forgot Your Password?

Subtitle example:

> Enter your email and we’ll help you get back in.

Luxury editorial tone.

---

## Form

Use shadcn primitives.

Fields:

---

### Email Address

Required

Type:

email

Use:

- auth-input

---

## Primary CTA

Button:

> Send Reset Link

Use existing shadcn Button.

Full width.

---

## Success UI State

Support a UI-only success state.

After submit, replace the form with:

---

### Success Message

Example:

> Reset instructions have been prepared.

Supporting copy:

> Check your inbox to continue.

This is:

UI state only.

Do NOT send real emails.

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

### Send Reset Link

On submit:

- prevent default
- show loading state
- then show success UI state

No real email sending.

---

### Back To Sign In

Must navigate.

---

## Layout Rules

No heavy scrolling.

Must fit viewport.

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

- generic SaaS auth styling
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
- send emails
- create tokens
- persist reset requests

---

## Check When Done

- Forgot password page compiles
- Email input works
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

👉 Reset Password UI