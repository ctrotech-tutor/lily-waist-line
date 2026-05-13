Read `AGENTS.md` before starting.

We are now building the **Login Page UI** for Lily Waist Line using the shared auth foundation already created.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the customer **Login Page UI**.

Use the shared auth system already created.

This is:

> UI only

Do NOT connect:

- Supabase Auth
- Prisma
- Server Actions
- Session management

yet.

---

## Route

Create or Update:
`app/(auth)/login/page.tsx`

Use existing App Router structure.

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

> Welcome Back

Subtitle:

Example:

> Continue your transformation journey.

Luxury editorial tone.

---

## Login Form

Use shadcn form primitives.

Fields:

---

### Email

Required

Type:

email

---

### Password

Required

Type:

password

Must support:

---

### Password Visibility Toggle

Use:

- Eye
- EyeOff

from `lucide-react`

---

## Forgot Password

Render:

> Forgot your password?

Must navigate to:
`forgot-password/`


Must be visually subtle but accessible.

---

## Primary CTA

Button:

> Sign In

Use existing shadcn Button.

Full width.

---

## Divider

Render:

Elegant divider.

Example:

> OR

Must feel premium.

---

## Optional Social Area (UI only)

Render:

### Continue with Google

Use:

- brand-safe icon if available

UI only.

No real auth logic.

---

## Footer Links

Use:

auth-footer-links

Render:

> Don’t have an account? Sign Up

Navigate to:
`signup/`

---

## Interaction Rules

For now:

---

### Sign In

On submit:

Prevent default.

Show UI loading state only.

No real auth.

---

### Forgot Password

Must navigate.

---

### Sign Up

Must navigate.

---

## Layout Rules

Forms must fit within viewport.

No vertical heavy scrolling.

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
- design typography
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
- keep boundaries clean

Do NOT:

- connect backend
- connect Google auth
- create sessions
- create validation logic yet

---

## Check When Done

- Login page compiles
- Auth shell works
- Password toggle works
- Forgot password link works
- Signup link works
- Google button renders
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Premium consistency maintained

---

## Next Step Preview

Signup Page UI
