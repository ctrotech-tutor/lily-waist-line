Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Supabase setup skills
- Prisma schema + migration skills
- PostgreSQL relationship modeling skills
- Next.js App Router backend patterns

When framework behavior, APIs, migrations, auth behavior, or CLI behavior may have changed:

Verify against latest official documentation before implementing.

Preferred references:

- Supabase official docs
- Prisma official docs
- Next.js official docs

Do NOT guess version-sensitive behavior.

---

We are now building the **Database Migration + Seed Layer** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

This phase activates the database schema for real development.

---

## Goal

Turn the Prisma schema into a working database foundation.

This includes:

- migrations
- schema synchronization
- development seed data
- admin bootstrap data

This is:

> infrastructure activation only

Do NOT:

- connect frontend pages
- write server actions
- implement auth
- implement cart logic

yet.

---

## Core Rule

Schema already exists.

This phase:

> validates and activates the schema.

---

## Required Work

---

## 1. Migration Setup

Use Prisma migration workflow.

Create initial migration for:

All phase-one business models.

Migration must target:

Supabase PostgreSQL

Use current Prisma best practices.

Verify against latest Prisma docs if CLI behavior differs.

---

## 2. Database Push Validation

Confirm:

- enums created correctly
- indexes created correctly
- foreign keys valid
- cascades valid

No silent failures.

---

## 3. Seed System

Create:

`prisma/seed.ts`

Use Prisma seed workflow.

If Prisma seed conventions changed:

Verify with latest official docs.

---

## 4. Seed Products

Seed real-looking mock products.

At least:

5–8 premium waist trainers.

Fields must match real schema.

Examples:

- sculpt waist trainers
- workout waist trainers
- latex trainers

Include:

- variants
- stock
- images
- pricing

Seed data should reflect real Lily Waist Line branding.

---

## 5. Seed Admin User

Create one admin user.

Role:

ADMIN

Purpose:

Admin dashboard testing.

Use safe placeholder data.

Never commit real credentials.

---

## 6. Seed Customer Users

Create:

2–3 customer accounts.

Purpose:

cart, wishlist, orders testing.

---

## 7. Seed Orders

Create mock order relationships.

Include:

- customer
- order items
- payment states
- shipping states

This helps admin dashboards render with real relational data.

---

## 8. Seed Addresses

Seed:

customer shipping addresses.

---

## 9. Seed Payment Proofs

Attach:

mock payment proof records to some orders.

---

## 10. Seed Shipments

Attach:

mock shipment data.

Examples:

- USPS
- FedEx
- DHL

Mock only.

---

## Folder Structure

Use:

`prisma/`

Includes:

- `schema.Prisma`
- `seed.ts`
- `migrations/`

---

## Important Rules

Do:

- use realistic business data
- seed relationally complete records
- use official docs if migration or seeding behavior differs

Do NOT:

- hardcode secrets
- use fake schema fields
- skip relational integrity
- guess CLI behavior

---

## Check When Done

- migrations run successfully
- database syncs
- seed script runs
- admin user exists
- products exist
- customers exist
- orders exist
- relationships validate
- Prisma Studio shows clean data

---

## Next Step Preview

👉 Supabase Auth Integration + Identity Binding