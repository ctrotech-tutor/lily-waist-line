Read `AGENTS.md` before starting.

We are now building the **Customer Account Center System** for Lily Waist Line.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Next.js App Router routing patterns
- Server Components best practices
- Supabase Auth session handling
- Prisma relational querying
- secure account lifecycle patterns

When framework behavior differs across versions:

Verify against latest official documentation before implementing.

Use framework best practices only.

---

Follow strictly:

- `context/project-overview.md`
- `context/design.md`
- `context/ui-context.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`

Maintain strict consistency with Lily Waist Line’s luxury editorial identity.

---

## Goal

Build:

> `/account`

This page is the user's:

> identity + security + overview center

NOT a full commerce dashboard.

Dedicated commerce pages already exist elsewhere.

---

## Route

Use:
`app/(site)account/`

Must be protected.

Authenticated users only.

---

## Core Principle

Do NOT duplicate:

- wishlist pages
- address pages
- order pages

Those already have dedicated routes.

This page should focus on:

> user identity management.

---

## Required Sections

---

## 1. Account Header

Contains:

- name
- email
- member since
- optional avatar placeholder

Actions:

- edit profile

---

## 2. Profile Management

Allow users to update:

- full name
- email
- phone

Future-ready:

- avatar upload

Use server actions.

---

## 3. Account Overview Stats

Display lightweight stats only.

Examples:

- total orders
- saved addresses
- wishlist items

Each card links to its dedicated route.

No full data tables here.

---

## 4. Security Center

Allow:

- change password
- email verification status
- resend verification email

Use existing auth systems.

---

## 5. Account Actions

Sensitive actions:

- logout
- delete account

---

### Delete Account Rules

Must require:

- password confirmation
- server validation
- ownership validation

Account deletion must be secure.

---

## Data Fetching

Use:

Server Components where possible.

Fetch:

- user profile
- lightweight aggregate stats

Avoid heavy relational queries.

---

## Styling Rules

Use:

- editorial spacing
- theme tokens
- premium typography

No generic dashboard styles.

---

## Important Rules

Do:

- keep account page lightweight
- focus on identity management
- link to dedicated feature routes
- keep security server-side

Do NOT:

- duplicate wishlist UI
- duplicate orders UI
- duplicate address management
- expose sensitive account internals

---

## Check When Done

- account page loads
- profile editing works
- stats render correctly
- security actions work
- delete account works safely
- mobile layout works
- no TypeScript errors

---

## Next Step Preview

👉 Final Production Audit + Deployment Readiness