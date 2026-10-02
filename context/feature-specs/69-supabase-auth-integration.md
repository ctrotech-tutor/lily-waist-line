Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Supabase Auth skills
- Next.js App Router auth patterns
- Prisma identity modeling skills
- session handling best practices

When auth APIs, helpers, session handling, cookies, middleware, or framework behavior may have changed:

Verify against latest official documentation before implementing.

Preferred references:

- Supabase Auth docs
- Next.js docs
- Prisma docs

Follow modern best practices only.

Do NOT use deprecated auth helpers, outdated examples, or legacy patterns.

---

We are now building the **Supabase Auth Integration Layer** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

This phase activates real user authentication.

---

## Goal

Connect the existing `(auth)` UI system to real authentication.

Support:

- signup
- login
- logout
- forgot password
- reset password
- email verification

Use:

Supabase Auth

---

## Core Architecture Rule

Use:

---

### Server Actions

For:

all auth mutations.

Examples:

- signup
- login
- logout
- forgot password
- password reset

Do NOT implement auth mutations in client components.

---

### Route Handlers (`app/api`)

Use ONLY if external callbacks or framework-required auth flows demand it.

Do NOT create unnecessary API routes.

---

## Identity Architecture

Two identity layers must stay aligned:

---

### Supabase Auth Identity

Source of authentication truth.

---

### Prisma User Model

Source of business identity.

Stores:

- role
- profile metadata
- business relationships

---

## Critical Rule

After successful signup:

Must safely sync:

Supabase user → Prisma User

No duplicate users.

No orphan identities.

Must be idempotent.

---

## Required Work

---

## 1. Signup Flow

Wire:

`app/(auth)/signup`

Use:

existing UI only.

On success:

---

### Step 1

Create Supabase Auth user

---

### Step 2

Create or upsert Prisma User

Role:

CUSTOMER

---

### Step 3

Trigger email verification flow

Use Supabase best practices.

---

## 2. Login Flow

Wire:

`app/(auth)/login`

Use:

email + password

On success:

- create secure session
- redirect correctly

---

## 3. Logout Flow

Must:

- clear session
- clear cookies properly
- redirect safely

Use server action.

---

## 4. Forgot Password

Wire:

`app/(auth)/forgot-password`

Must:

- send secure reset email

Use Supabase recommended flow.

---

## 5. Reset Password

Wire:

`app/(auth)/reset-password`

Must:

- validate reset session
- update password securely

---

## 6. Email Verification

Wire:

`app/(auth)/verify-email`

Must:

- handle verified state correctly
- sync Prisma state if needed

---

## Session Architecture

Must follow latest Supabase + Next.js recommendations.

Session must work across:

- Server Components
- Server Actions
- Proxy (Middleware) (future)

Cookies must be secure.

No manual insecure token storage.

---

## Error Handling

Must handle safely:

- duplicate email
- invalid credentials
- expired reset links
- invalid verification links

No raw backend errors shown to users.

Use safe user-facing messages.

---

## Security Best Practices

Must follow:

- secure cookie handling
- CSRF-safe auth flows
- no client secret exposure
- no service role usage in auth UI flows

Never expose:

- service role keys
- raw tokens
- auth internals

---

## Required Folder Usage

Use:

---

### Server Actions

`server/actions/auth/`

Examples:

- signup.ts
- login.ts
- logout.ts
- forgot-password.ts
- reset-password.ts

---

### Validation

`lib/validators/auth/`

Use shared schemas.

Examples:

- login schema
- signup schema

---

## Important Rules

Do:

- use latest official auth patterns
- use server actions
- keep identity sync safe
- follow framework best practices

Do NOT:

- bypass Supabase auth
- create client-side auth hacks
- duplicate identity logic
- use deprecated helpers

---

## Check When Done

- signup works
- login works
- logout works
- forgot password works
- reset password works
- verification works
- Prisma user sync works
- sessions work in server components
- no auth leaks
- no TypeScript errors

---

## Next Step Preview

👉 Role Protection + Route Security Layer