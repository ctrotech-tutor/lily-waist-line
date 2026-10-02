# Architecture Context — Lily Waist Line

## Stack

| Layer            | Technology                      | Role                                                                 |
|------------------|--------------------------------|----------------------------------------------------------------------|
| Framework        | Next.js (App Router) + TypeScript | Full-stack eCommerce application with server/client boundaries |
| UI               | Tailwind + shadcn/ui           | Component system and UI composition                                  |
| Auth             | Supabase Auth                  | User authentication, sessions, and RLS enforcement                  |
| Database         | Supabase PostgreSQL + Prisma   | Supabase = DB layer, Prisma = ORM for structured server access      |
| Payments | Cash App (Manual) | Client-provided payment link for manual customer payments |
| Email Service | Nodemailer (SMTP-based) | Order notifications, payment instructions, admin alerts |
| Storage | Supabase Storage | Product images, media assets, and payment proof uploads |

---

## System Boundaries

### `app/` 

* Next.js App Router pages and layouts
* Server Components by default
* Client Components only when interactivity is required

---

### `app/api/` 

* Email triggers (if needed)
* Future external integrations
* Must remain thin and stateless

---

### Server Actions

* Primary mutation layer
* Cart, wishlist, order creation
* Must use Prisma for structured DB writes

---

### `lib/` 

* Prisma client
* Supabase client
* Payment helpers (Cash App link generation / payment utilities)
* Nodemailer email service
* Shared utilities

---

### `components/` 

* Pure UI components only
* No business logic
* Reusable product/cart/auth components

---

### `types/` 

* Shared TypeScript interfaces
* Product, Order, User, Cart, Payment types

---

## Data Architecture

### Supabase (Core Infrastructure Layer)

Handles:
* Authentication
* Row Level Security (RLS)
* Storage (images)
* Base PostgreSQL instance

---

### Prisma (ORM Layer)

Handles:
* Structured database access
* Server-side queries
* Complex relational operations
* Type-safe DB operations

👉 Prisma connects directly to Supabase Postgres

---

### Cash App (Payment Layer)

Handles:
* Manual customer payments via Client Provided Cash App link
* Post-checkout payment instructions 
* Admin-side payment verification

Supabase stores:
* Order records
* Payment status (updated by admin after verification)
* Payment proof (image/file)

Payment flow:
* Customer places order
* Order created with status: pending_payment
* Customer redirected to Cash App payment page
* Customer completes payment
* Customer uploads payment proof
* Admin verifies payment proof
* Admin updates payment status in DB

---

## Shipping Layer

### Manual Fulfillment (Phase One)

Handles:

* Manual shipment through post office carriers
* Carrier assignment by admin
* Tracking number entry by admin

Supported flow:

1. Payment confirmed
2. Admin packages product
3. Admin ships via selected carrier
4. Admin enters:
   - Carrier name
   - Tracking number
5. Customer can track shipment

Future upgrade path:

* Shipping aggregators
* Carrier APIs
* Automated rate calculation

---

### Nodemailer (Email Layer)

Handles transactional emails:

* Order confirmation emails
* Payment success emails
* Admin order notifications
* Shipping updates (future phase)

Email flow:

1. Customer places order
2. Order is created in DB
3. Payment instructions may be emailed to customer
4. Admin verifies payment manually
5. Payment confirmation email may be sent

---

## Auth & Role Model

### Roles

* Customer
* Admin

---

### Rules

* Supabase Auth manages identity
* RLS enforces row-level access
* Server Actions enforce business rules
* Admin routes are fully protected

---

## Core Business Flows

### Product Flow

* Products stored in Supabase
* Queried via Prisma in server layer
* Rendered via Next.js Server Components

---

### Cart Flow

* User adds items → stored in DB
* Synced per authenticated session
* Used during checkout

---

### Order Flow (CRITICAL)

1. User creates order
2. Prisma creates order with status → "pending_payment"
3. User is redirected to Cash App payment link
4. Customer completes payment manually
5. Admin verifies payment
6. Prisma updates payment status → "paid"
7. Admin begins fulfillment process
8. Tracking info is added after shipment
9. Customer receives tracking notification

---

## Email System Rules

* All emails must be triggered server-side only
* No email logic in frontend components
* Emails must be idempotent (no duplicates on retry)
* Use templates for:
  + Order confirmation
  + Payment success
  + Admin alerts

---

## System Rules

1. Supabase handles auth + storage + base DB
2. Prisma handles structured DB queries
3. Cash App payment confirmation is admin-controlled in phase one
4. Payment verification is manual until automated gateway integration is introduced
5. Nodemailer handles all transactional emails
6. No business logic in UI components
7. Server Actions are primary mutation layer

---

## Invariants

1. Orders are ONLY marked paid after admin payment verification
2. Emails are ONLY sent after DB confirmation
3. Prisma is the only ORM layer used in server logic
4. Supabase RLS is always enforced
5. No direct client writes to database tables

---

## Future Payment Evolution

Phase two may introduce:

* :contentReference[oaicite:2]{index=2} for automated payments
* Cash App Pay via Stripe
* International card support
* Webhook-based payment verification
