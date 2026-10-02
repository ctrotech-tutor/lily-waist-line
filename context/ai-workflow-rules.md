# Development Workflow — Lily Waist Line

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs — do not infer or invent behavior from scratch.

This project uses **Next.js (App Router)** with **Supabase PostgreSQL + Prisma** for backend infrastructure and structured server-side data access.

---

## Scoping Rules

* Work on one feature unit or subsystem at a time.
* Prefer small, verifiable increments over large speculative changes.
* Do not combine unrelated system boundaries in a single implementation step.
* Prioritize phase-one business workflows over future automation features.
---

## When To Split Work

Split an implementation step if it combines:

* UI changes and server actions in the same step
* Frontend logic and database schema changes together
* Multiple unrelated route handlers
* Checkout flow + manual payment handling + order creation
* Payment verification + shipping fulfillment + tracking updates
* Admin and customer systems in the same unit

If a change cannot be verified end to end quickly, the scope is too broad — split it.

---

## Handling Missing Requirements

* Do not invent product behavior that is not defined in the context files.
* If a requirement is ambiguous, resolve it in the relevant context file before implementing.
* If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.
* Payment behavior must always follow the current phase architecture. Phase one uses manual Cash App payment and admin verification only.
* Shipping behavior must follow the current fulfillment model. Phase one uses manual carrier fulfillment and manual tracking updates.
* Product discovery state (search, filters, sorting, pagination) must follow URL-driven state architecture unless explicitly changed in context files.

---

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed.

This includes:

* `components/ui/` (UI library components)
* third-party library internals
* framework internals (Next.js, Supabase SDK)

Project-specific styling, layout changes, and feature logic must be implemented in app-level components only.

Only modify foundation components when explicitly required.

---

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:

* System architecture or boundaries
* Database schema decisions
* Feature scope or behavior changes
* Code conventions or standards
* Payment workflow changes
* Shipping or fulfillment process changes
* Order status lifecycle changes

Progress state must reflect the actual system state, not intended state.

---

## Before Moving To The Next Unit

1. The current unit works end to end within its defined scope.
2. No architecture rule in `architecture-context.md` is violated.
3. Database and server/client behavior is consistent.
4. `progress-tracker.md` reflects completed work.
5. Payment and fulfillment states reflect current business rules.
---
