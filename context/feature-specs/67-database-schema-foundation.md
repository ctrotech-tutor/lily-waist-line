Read `AGENTS.md` before starting.

We are now building the **Database Schema Foundation** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`

This schema defines the core commerce data model.

All future backend features depend on this.

---

## Goal

Build the initial Prisma schema for Lily Waist Line.

This includes:

- users
- roles
- products
- variants
- wishlist
- cart
- addresses
- orders
- payments
- shipping

This is:

> schema only

Do NOT:

- write business logic
- write server actions
- connect frontend forms
- write API handlers

yet.

---

## Database Rule

Prisma connects to:

Supabase PostgreSQL

Prisma is the ONLY ORM used for server-side DB access.

---

## File

Use:

```txt
prisma/schema.prisma
``` id="lwschema67"

---

## Required Models

Build the following models.

---

## 1. User

Must support:

- customer identity
- admin identity
- profile metadata

Required fields:

- id
- email
- fullName
- role
- emailVerified
- createdAt
- updatedAt

Role values:

- CUSTOMER
- ADMIN

---

## 2. Product

Required:

- id
- name
- slug
- shortDescription
- description
- basePrice
- compareAtPrice
- status
- createdAt
- updatedAt

Status:

- DRAFT
- ACTIVE
- ARCHIVED

---

## 3. ProductVariant

Required:

- id
- productId
- size
- compressionLevel
- color (optional)
- sku
- stockQuantity
- createdAt
- updatedAt

---

## 4. ProductImage

Required:

- id
- productId
- url
- altText
- sortOrder

---

## 5. WishlistItem

Required:

- id
- userId
- productId
- createdAt

Rules:

One product per user.

Prevent duplicates.

---

## 6. CartItem

Required:

- id
- userId
- variantId
- quantity
- createdAt
- updatedAt

Rules:

One variant per user.

Quantity mutable.

---

## 7. Address

Use the agreed address structure.

Must support:

- shipping addresses
- default address

Include:

- firstName
- lastName
- company
- addressLine1
- addressLine2
- city
- state
- postalCode
- country
- phone
- isDefault

---

## 8. Order

Required:

- id
- userId
- addressId
- subtotal
- shippingFee
- total
- paymentMethod
- paymentStatus
- fulfillmentStatus
- createdAt
- updatedAt

---

### Payment Methods

Support:

- CASH_APP
- PAYPAL

---

### Payment Status

Support:

- PENDING
- PAID
- REJECTED

---

### Fulfillment Status

Support:

- PENDING
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

---

## 9. OrderItem

Required:

- id
- orderId
- productId
- variantId
- quantity
- unitPrice

Must snapshot purchase data.

---

## 10. PaymentProof

Required:

- id
- orderId
- imageUrl
- status
- uploadedAt

Status:

- PENDING
- VERIFIED
- REJECTED

---

## 11. Shipment

Required:

- id
- orderId
- carrier
- trackingNumber
- shippedAt
- deliveredAt

---

## Required Relationships

Define clean relations across:

- user → cart
- user → wishlist
- user → addresses
- user → orders

- product → variants
- product → images

- order → order items
- order → payment proof
- order → shipment

---

## Required Constraints

Enforce:

---

### Unique

User email

---

### Unique

Product slug

---

### Composite Unique

Wishlist:

(userId, productId)

---

### Composite Unique

Cart:

(userId, variantId)

---

### Indexes

Add indexes for:

- userId
- productId
- orderId
- slug
- sku

Optimize for commerce queries.

---

## Enum Rules

Use Prisma enums for:

- Role
- ProductStatus
- PaymentMethod
- PaymentStatus
- FulfillmentStatus
- PaymentProofStatus

---

## Important Rules

Do:

- model business reality
- keep schema scalable
- use strong naming consistency

Do NOT:

- create unnecessary tables
- over-engineer phase one
- add analytics models yet

---

## Check When Done

- schema validates
- enums compile
- relations compile
- indexes compile
- no duplicate fields
- no circular relation issues

---

## Next Step Preview

👉 Database Migration + Seed Layer