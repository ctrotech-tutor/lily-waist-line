Read `AGENTS.md` before starting.

We are now building the **Signup Page UI** for Lily Waist Line using the shared auth foundation already created.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the customer **Signup Page UI**.

Use the shared auth system already created.

This is:

> UI only

Do NOT connect:

- Supabase Auth
- Prisma
- Server Actions
- Email verification
- Session creation

yet.

---

## Route

Create or Update:
`app/signup/page.tsx`

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

> Create Your Account

Subtitle:

Example:

> Begin your confidence and transformation journey.

Luxury editorial tone.

---

## Signup Form

Use shadcn form primitives.

Fields:

---

### First Name

Required

---

### Last Name

Required

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

- password visibility toggle

Use:

- Eye
- EyeOff

from `lucide-react`

---

### Confirm Password

Required

Type:

password

Must support:

- password visibility toggle

---

## Optional Terms Agreement

Use:

- Checkbox

Label example:

> I agree to the terms and privacy policy.

UI only.

No validation logic yet.

---

## Primary CTA

Button:

> Create Account

Use existing shadcn Button.

Full width.

---

## Divider

Render elegant divider.

Example:

> OR

---

## Optional Social Area (UI only)

Render:

### Continue with Google

UI only.

No real auth logic.

---

## Footer Links

Use:

auth-footer-links

Render:

> Already have an account? Sign In

Navigate to:
`/login`


---

## Interaction Rules

For now:

---

### Create Account

On submit:

Prevent default.

Show loading state only.

No real auth.

---

### Sign In

Must navigate.

---

## Layout Rules

Forms must fit within viewport.

No heavy vertical scrolling.

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
- Checkbox

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
- keep component boundaries clean

Do NOT:

- connect backend
- create sessions
- verify email yet
- persist users yet

---

## Check When Done

- Signup page compiles
- Auth shell works
- Password toggles work
- Terms checkbox works
- Login link works
- Google button renders
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Premium consistency maintained

---

## Next Step Preview

👉 Forgot Password UI
