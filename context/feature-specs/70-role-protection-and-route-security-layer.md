Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

* Supabase Auth session handling skills
* Next.js App Router middleware(proxy) best practices
* Edge runtime constraints knowledge
* Prisma role modeling

Always verify authentication and middleware(proxy) patterns against the latest official Next.js documentation.

Reference:

* https://nextjs.org/docs/app/api-reference/file-conventions/proxy
* https://supabase.com/docs/guides/auth
* https://supabase.com/docs/guides/auth/server-side/creating-a-client
---

We are now building the **Role Protection & Route Security Layer** for Lily Waist Line.

Follow strictly:

* `context/architecture-context.md`
* `context/code-standards.md`
* `context/ai-workflow-rules.md`
* `context/git-workflow.md`

This phase introduces application-wide access control.

---

## Goal

Implement secure **route-level protection + role-based access control (RBAC)** .

This ensures:

* customers only access customer routes
* admins only access admin routes
* checkout requires authentication
* sensitive pages are protected globally

---

## Core Security Model

Two layers:

---

### 1. Authentication Layer

Managed by Supabase Auth

Determines:

* logged in or not

---

### 2. Authorization Layer (RBAC)

Managed via Prisma User model:

* CUSTOMER
* ADMIN

---

## Required Work

---

## 1. Middleware Protection Layer

Create or update:

`proxy.ts` 

---

### Responsibilities:

Protect routes:

#### Admin Routes

 * /admin/* → ADMIN only

#### Customer Routes

* /checkout → authenticated users only
* /orders → authenticated users only
* /wishlist → authenticated users only

---

### Auth Redirect Rules

* If NOT logged in → redirect to `/login`
* If logged in → prevent `/login` and `/signup`

---

## 2. Session Validation Strategy

Use Supabase server session validation (cookie-based).

Must:

* avoid client-side trust
* validate on server/edge
* use secure cookies only

---

## 3. Role Guard Layer

Create reusable helper:

`lib/auth/guards.ts` 

---

### Responsibilities:

* check if user is ADMIN
* check if user is CUSTOMER
* return safe access boolean

---

## 4. Route-Level Safety Rules

Enforce:

* no admin access without role check
* no checkout without authentication
* no wishlist/cart without user session

---

## 5. Error Handling Behavior

If unauthorized:

* redirect to `/login`
* or `/403` (optional later)

Never expose raw auth errors.

---

## Important Rules

Do:

* use proxy (middleware) correctly
* use server-safe session validation
* enforce RBAC using Prisma role
* keep logic minimal in middleware

Do NOT:

* use outdated or non-existent `middleware.ts`
* trust client-side auth state
* expose session tokens
* bypass role checks
* duplicate auth logic in multiple places

---

## Check When Done

* admin routes protected
* customer routes protected
* auth redirects work
* role-based access enforced
* middleware compiles
* no edge runtime errors
* no insecure session handling

---

## Next Step Preview

👉 Product Catalog Backend Query Layer (real database-driven shop system)
