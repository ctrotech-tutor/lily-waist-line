# Code Standards — Lily Waist Line

## General

- Keep modules small, focused, and single-purpose.
- Fix root causes — never patch symptoms with temporary workarounds.
- Do not mix unrelated concerns in a single component, hook, or route handler.
- Respect system boundaries defined in `architecture-context.md`.

---

## TypeScript

- Strict mode is required across the entire project.
- Avoid `any`; use explicit types or well-scoped interfaces.
- Validate all external or untrusted input at system boundaries (server actions, route handlers).
- Prefer `interface` for object contracts and shared data shapes.
- Ensure shared types are reused across frontend and backend layers where possible.

---

## Next.js (App Router)

- Default to React Server Components.
- Use `"use client"` only when necessary for:
  - stateful UI
  - browser APIs
  - interactive components
- Server Actions should be preferred for mutations.
- Route Handlers (`/app/api`) must be used only for external integrations (payments, webhooks).
- Keep route handlers thin and focused on a single responsibility.
- Long-running or external workflows must not block requests.

---

## Styling System

- Use design system tokens only (no raw hex or arbitrary Tailwind colors).
- All colors must come from predefined theme tokens (light/dark mode supported).
- Maintain consistent spacing and radius scale:

  - `rounded-xl` → small UI elements
  - `rounded-2xl` → cards, containers
  - `rounded-3xl` → modals, overlays

- UI must remain consistent with the **Lily Waist Line luxury black + gold theme**.

---

## API / Server Actions

- Always validate and sanitize input before executing logic.
- Enforce authentication checks before any mutation.
- Enforce authorization rules (user vs admin separation).
- Return consistent response structures across all endpoints/actions.
- Keep logic minimal in route handlers — move business logic to services.

---

## Payments System (Stripe)

- The primary payment provider is **Stripe**.
- All checkout payments must be processed using Stripe Checkout or Stripe Payment Intents.
- Payment flow must be:

  1. Create order (pending state)
  2. Initialize Stripe session
  3. Redirect user to Stripe checkout
  4. Confirm payment via Stripe webhook
  5. Mark order as paid only after webhook verification

- Never trust frontend payment success state.
- All payment verification must happen server-side via Stripe webhooks.

- Stripe is the **source of truth for payment status**, not the client.

---

## Supabase Data Rules

- Supabase is the single source of truth for:
  - users
  - products
  - orders
  - wishlist
  - cart

- Use Row Level Security (RLS) for all tables.
- Never trust client-side data for authorization decisions.
- Ensure all writes are scoped to authenticated user context.

---

## Data & Storage

- Store structured relational data only in Supabase (Postgres).
- Do not duplicate state across frontend and backend unnecessarily.
- Avoid storing derived data unless required for performance.
- Ensure data consistency across:
  - cart → checkout → Stripe payment → order confirmation flow
  - wishlist → product relation flow

---

## File Organization (Next.js App Router)

- `app/` → routes, pages, layouts
- `components/` → reusable UI components only (no business logic)
- `lib/` → utilities, Supabase client, helpers, services
- `server/` → server actions and backend logic (if separated)
- `app/api/` → route handlers (Stripe webhooks, external integrations only)
- `types/` → shared TypeScript interfaces

---

## Naming Conventions

- Name files by **feature responsibility**, not technology.
  - `checkout-service.ts` not `api-handler.ts`
  - `product-card.tsx` not `ui-component.tsx`

- Use clear domain naming:
  - `order`
  - `product`
  - `cart`
  - `wishlist`
  - `auth`
  - `payment`

---

## Core Principle

> Code must reflect business intent, not framework structure.

Every implementation should map directly to real eCommerce behavior in Lily Waist Line.

---