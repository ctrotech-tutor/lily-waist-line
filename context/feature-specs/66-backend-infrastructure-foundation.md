Read `AGENTS.md` before starting.

We are now beginning the **Backend Integration Phase** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

This phase establishes the backend foundation for all future commerce features.

---

## Goal

Build the **Backend Infrastructure Foundation**.

This is the base layer for:

- authentication
- database access
- server actions
- file uploads
- payments
- email systems

Nothing else should be integrated until this layer is stable.

---

## Core Architecture Rule

Use:

---

### Server Actions

For:

internal application mutations.

Examples:

- auth
- cart
- wishlist
- addresses
- orders
- admin actions

---

### Route Handlers (`app/api`)

For:

external systems or file-based workflows.

Examples:

- uploads
- payment callbacks
- webhooks
- external notifications

---

Never mix responsibilities.

---

## Infrastructure To Build

---

## 1. Environment Validation Layer

Create:

`lib/env/`

Build:

---

### env.server.ts

Contains:

server-only environment validation.

Must validate:

- DATABASE_URL
- DIRECT_URL
- SUPABASE_SERVICE_ROLE_KEY
- SMTP credentials
- PayPal credentials (placeholder)

---

### env.client.ts

Contains:

safe client-side envs only.

Examples:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Never expose server secrets.

---

## 2. Prisma Foundation

Create:

`lib/prisma.ts`

Requirements:

- singleton client
- dev hot reload safe
- server-only

---

## 3. Supabase Foundation

Create:

`lib/supabase/`

Build:

---

### client.ts

Browser client

---

### server.ts

Server client

---

### admin.ts

Service role client

Must be server-only.

---

## 4. Server Actions Foundation

Create:

`server/actions/`

Purpose:

all business mutations live here.

Examples later:

- auth
- cart
- wishlist
- orders

---

No actions yet.

Only structure.

---

## 5. API Route Foundation

Create:

`app/api/`

Prepare folders for:

---

### uploads

---

### payments

---

### webhooks

---

No integrations yet.

Only structure.

---

## 6. Services Layer

Create:

`lib/services/`

Purpose:

shared business helpers.

Examples later:

- payment services
- email services
- storage services

---

## 7. Validation Layer

Create:

`lib/validators/`

Purpose:

shared input schemas.

Likely later:

- auth
- cart
- address
- checkout

---

## Important Rules

Do:

- keep server/client boundaries strict
- protect secrets
- keep structure scalable

Do NOT:

- implement auth yet
- connect payments
- write business logic
- create DB models yet

---

## Check When Done

- env layer works
- prisma client compiles
- supabase clients compile
- folder boundaries are clean
- no secret leaks
- server-only boundaries respected

---

## Next Step Preview

👉 Database Schema Foundation (Prisma models + business entities)