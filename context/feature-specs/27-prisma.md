Read `AGENTS.md` before starting.

We are now defining the **Prisma data layer for Lily Waist Line**.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- Supabase PostgreSQL constraints
- Prisma ORM rules

This file defines the **full database schema structure only**.

---

# 🎯 Goal

Define and implement the complete Prisma schema for Lily Waist Line.

This includes:

- Users & roles
- Products & variants
- Cart system
- Wishlist system
- Orders system
- Manual payment system (Cash App flow)
- Shipping tracking system
- Address management system

---

# ⚠️ SCOPE RULE

This task is ONLY for:

- Prisma schema definition
- Prisma client setup
- Initial migration setup

DO NOT implement UI or backend logic.

---

# 🧱 DATABASE FOUNDATION

## Database Provider

- PostgreSQL via Supabase
- Prisma used as ORM layer
- Supabase handles auth + storage

---

# 📦 MODELS TO CREATE

## 1. User

- id (cuid)
- email (unique)
- fullName (optional)
- role enum: CUSTOMER | ADMIN
- timestamps

Relations:
- Cart (1)
- Wishlist (1)
- Orders (many)
- Addresses (many)

---

## 2. Product

- id
- name
- slug (unique)
- description
- basePrice
- isActive
- timestamps

Relations:
- ProductImages
- ProductVariants

---

## 3. ProductImage

- id
- url
- productId

Cascade delete enabled

---

## 4. ProductVariant

Represents product options:

- size
- color
- stock
- optional price override

Relations:
- CartItems
- OrderItems

---

## 5. Address (NEW — REQUIRED)

User shipping addresses system.

- id
- userId
- fullName
- phone
- addressLine
- city
- state
- country
- postalCode (optional)
- isDefault (boolean)

Rules:

- One user can have many addresses
- One default address per user

Indexes:

- userId
- isDefault

---

## 6. Cart

- id
- userId (unique)

Relations:
- CartItems

---

## 7. CartItem

- id
- cartId
- variantId
- quantity

---

## 8. Wishlist

- id
- userId (unique)

---

## 9. WishlistItem

- id
- wishlistId
- productId

---

## 10. Order

Core commerce entity.

- id
- userId
- status enum:
  - PENDING_PAYMENT
  - PAID
  - PROCESSING
  - SHIPPED
  - DELIVERED
  - CANCELLED

Pricing:
- subtotal
- shippingFee
- totalAmount

Shipping snapshot fields:
- fullName
- phone
- email
- addressLine
- city
- state
- country
- postalCode

Relations:
- OrderItems
- Payment
- Shipment

---

## 11. OrderItem

- id
- orderId
- variantId
- quantity
- unitPrice

---

## 12. Payment (Manual System)

Payment method is **Cash App manual flow only**.

- id
- orderId (unique)
- method: CASH_APP
- status: PENDING | VERIFIED | FAILED
- proofUrl (optional)
- verifiedAt (optional)

---

## 13. Shipment

Manual shipping tracking system.

- id
- orderId (unique)
- carrier
- trackingNumber (optional)
- status:
  - PENDING
  - SHIPPED
  - IN_TRANSIT
  - DELIVERED
- shippedAt
- deliveredAt

---

# 🔐 ENUMS

Define strictly:

- Role
- OrderStatus
- PaymentStatus
- PaymentMethod
- ShipmentStatus

---

# ⚙️ PRISMA CLIENT SETUP

Create:

`lib/prisma.ts`

Rules:

- Singleton pattern (global cache)
- Prevent multiple instances in dev
- Support Supabase PostgreSQL connection
- Must be safe for hot reload

---

# 🧪 MIGRATION REQUIREMENTS

Run:

```bash
npx prisma migrate dev --name lily_waistline_init
npx prisma generate
```

---

# 📌 CHECK WHEN DONE

- All models created successfully
- Address system included and linked to User
- Payment system supports manual Cash App flow
- Shipment system supports manual tracking
- Relations correctly wired
- Migration runs without errors
- Prisma client exports singleton instance
- No UI or API logic included

---

# 🚫 OUT OF SCOPE

- No frontend UI
- No API routes
- No server actions
- No business logic
- No authentication implementation