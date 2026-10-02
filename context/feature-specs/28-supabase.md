Read `AGENTS.md` before starting.

We are now setting up **Supabase as the backend infrastructure layer** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- Prisma integration rules
- Security-first database design principles

---

# 🎯 Goal

Initialize and configure Supabase as the core backend system for:

- Authentication
- PostgreSQL database
- Row Level Security (RLS)
- File storage (product images, payment proof uploads)
- API access layer

---

# ⚙️ SUPABASE PROJECT SETUP

## Step 1 — Create Project

Create a Supabase project:

- Name: `lily-waist-line`
- Region: Closest to target users (EU/US recommended)
- Database password: secure + stored in `.env`

---

## Step 2 — Environment Variables

Add to `.env`:

```
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

# 🧱 DATABASE STRATEGY

Supabase will be used for:

- PostgreSQL database (source of truth)
- Auth system
- Storage system
- RLS security layer

Prisma will connect directly to Supabase PostgreSQL.

---

# 🔐 AUTH SYSTEM

Use Supabase Auth.

## Allowed Auth Methods:

- Email + Password only (Phase 1)

## Rules:

- Supabase handles identity
- Prisma stores extended user profile data
- Auth users map to `User` table via `id`

---

# 🧑 USER MODEL LINKING RULE

- Supabase Auth user ID MUST match Prisma User ID
- No duplicate authentication system
- User creation must sync to Prisma automatically

---

# 🛡️ ROW LEVEL SECURITY (RLS)

## MUST ENABLE RLS ON ALL TABLES

Enable for:

- users
- orders
- cart
- wishlist
- addresses

---

## RLS RULES

### Users
- Users can only access their own record

### Orders
- Users can only see their own orders
- Admin can see all orders

### Cart & Wishlist
- Fully user-scoped

### Addresses
- User-only access

---

# 📦 STORAGE BUCKETS

Create Supabase Storage buckets:

## 1. product-images

- Public read access
- Used for product gallery

## 2. payment-proofs

- Private bucket
- Only admin can access
- Used for Cash App proof uploads

## 3. user-avatars (optional future)

---

# 🔁 PRISMA INTEGRATION RULE

Supabase provides:

- PostgreSQL database → Prisma connects here
- Auth system → Supabase Auth only
- Storage → Supabase Storage

Prisma MUST NOT replace Supabase.

---

# ⚙️ ROLE SYSTEM

Two roles only:

- CUSTOMER
- ADMIN

Admin is controlled via:
- database flag OR
- Supabase custom claim (preferred later stage)

---

# 🧠 SYSTEM FLOW RULE

## Authentication Flow:

1. User signs in via Supabase Auth
2. User ID is passed to Prisma layer
3. Prisma handles business data (orders, cart, etc.)

---

## Order Flow:

1. Supabase Auth identifies user
2. Prisma creates order
3. Payment is manual (Cash App)
4. Admin verifies payment
5. Order updated in DB

---

## Storage Flow:

- Product images → public bucket
- Payment proof → private bucket
- URLs stored in Prisma models

---

# 🚫 OUT OF SCOPE

- No frontend UI
- No business logic implementation
- No server actions
- No Prisma schema changes here
- No payment integration logic

---

# 📌 CHECK WHEN DONE

- Supabase project created successfully
- Auth enabled (email/password)
- Database connected to Prisma
- RLS enabled on all tables
- Storage buckets created
- Environment variables configured
- No security gaps in access rules