Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- input validation best practices
- server-side security modeling
- Prisma constraint enforcement skills
- Next.js App Router security patterns

When security behavior, validation strategies, or framework constraints may differ across versions:

Verify against latest official documentation:

- https://nextjs.org/docs
- https://www.prisma.io/docs
- https://supabase.com/docs

---

We are now building the **Backend Security & Validation Layer** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Harden the entire backend system by adding:

- validation consistency
- security enforcement
- request safety rules
- rate limiting foundations
- data integrity protection

---

## Core Rule

Security is:

> server-first and always enforced

Never trust:

- client inputs
- frontend validation
- request metadata
- user-provided IDs

---

## Required Work

---

## 1. Global Validation Layer

Create:

`lib/validators/`

Standardize all schemas:

* auth
* cart
* orders
* address
* payment
* admin actions

Use strict schema validation rules.

---

## 2. Input Sanitization Rules

Enforce:

* trim strings
* remove empty payloads
* reject unknown fields
* strict typing only

No loose validation allowed.

---

## 3. Server Action Security Layer

Every server action must:

* validate session
* validate role
* validate ownership
* validate input schema

In this order.

---

## 4. Prisma Safety Rules

Enforce:

* no unfiltered updates
* no blind deletes
* no mass updates without filters
* always use where clauses

---

## 5. ID Security Rules

Never trust:

* raw IDs from client

Always verify:

* ownership via userId
* relational integrity

---

## 6. Rate Limiting Foundation (Light Phase 1)

Implement basic protection:

* prevent spam orders
* prevent login brute force attempts (basic level)
* prevent repeated uploads abuse

(No external rate limiter library required yet)

---

## 7. Error Handling Standardization

All backend errors must:

* be user-safe
* not expose DB internals
* not expose stack traces
* return consistent structure

---

## 8. Logging Strategy (Minimal Phase 1)

Log:

* failed login attempts
* failed payment verification attempts
* invalid order creation attempts

Do NOT log sensitive data.

---

## 9. Business Rule Enforcement Layer

Enforce globally:

* no order creation without stock validation
* no payment approval without admin role
* no address access cross-user
* no cart manipulation without session

---

## 10. Security Boundaries

Strict separation:

* client → never trusted
* server actions → validated entry point
* API routes → isolated external boundary

---

## Important Rules

Do:

* validate everything server-side
* enforce ownership everywhere
* standardize validation layer
* protect Prisma operations

Do NOT:

* trust frontend validation
* skip schema validation
* expose internal errors
* allow unsafe DB operations

---

## Check When Done

* validation unified across system
* no unsafe Prisma queries
* ownership enforced everywhere
* role checks consistent
* error responses safe
* backend hardened for production

---

## Next Step Preview

👉 Performance Optimization + Caching Layer (final backend tuning before launch readiness)