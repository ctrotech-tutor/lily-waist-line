Read `AGENTS.md` before starting.

We are now building the **Verify Email UI** for Lily Waist Line using the shared auth foundation already created.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the **Email Verification Page UI**.

This is the screen users see after signup when they must confirm their email.

This is:

> UI only

Do NOT connect:

- Supabase email verification
- Token validation
- Server Actions
- Prisma
- Email service

yet.

---

## Route

Create or update:
`app/(auth)/verify-email/page.tsx`

This page is typically shown after signup.

---

## Components To Use

Use the auth components already created.

---

### Required

Use:

- auth-shell
- auth-header
- auth-footer-links

Optional:

- auth-input (only if needed for resend email input, but not required)

---

## Page Content

Render:

---

### Header

Use:

Title:

> Verify Your Email

Subtitle example:

> We’ve sent a confirmation link to your email address.

Luxury editorial tone.

---

## Visual Verification State

This page should feel like a **status screen**, not a form-heavy page.

Include:

---

### Email Icon / Status Indicator

Use lucide icon:

- MailCheck or Mail

---

### Instruction Text

Example:

> Check your inbox and click the link to activate your account.

---

## Resend Email Section

Include optional UI-only action:

---

### Resend Link

Button:

> Resend Email

Behavior:

- UI loading state only
- No real resend logic yet

---

## Change Email Option (Optional UI)

Text:

> Wrong email?

Link:

> Update Email

No real navigation required yet (can point to `/signup`).

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

### Resend Email

On click:

- show loading state
- then show “email resent” UI message

No backend integration.

---

### Back To Sign In

Must navigate.

---

## Layout Rules

Must remain:

- clean
- centered
- non-scroll heavy
- status-focused

---

### Desktop

Centered inside auth-shell.

---

### Mobile

Single-column.

Minimal content stacking.

No overflow.

---

## UI Primitive Rules

Use existing shadcn primitives:

- Button
- Card (optional)
- Input (only if needed)

Do NOT rebuild primitives.

Do NOT modify:
`components/ui/*`

---

## Styling Rules

Must use:

- theme tokens only
- luxury typography
- editorial spacing
- gold-accent highlights for success states

No:

- generic SaaS verification UI
- harsh alert styling

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

- treat this as a status screen
- keep UI minimal and elegant

Do NOT:

- verify emails
- connect Supabase
- handle tokens
- implement backend logic

---

## Check When Done

- Verify email page compiles
- Icon renders correctly
- Instruction text visible
- Resend button works (UI only)
- Loading state works
- Success message works
- Back to login works
- Mobile works
- Desktop works
- Light mode works
- Dark mode works
- Premium consistency maintained

---

## Next Step Preview

👉 Auth System Wiring (Routing + Final Integration)