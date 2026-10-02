Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Supabase Storage best practices
- image upload security patterns
- Next.js App Router file handling
- Prisma relational modeling skills

When storage APIs, upload handling, or SDK behavior may differ across versions:

Verify against latest official documentation:

- https://supabase.com/docs/guides/storage
- https://nextjs.org/docs

---

We are now building the **Product Media + Storage System** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Implement a **scalable product image system** that supports:

- product images
- variant images
- upload pipeline
- storage structure
- future CDN optimization

---

## Core Rule

All media assets must be stored in:

:contentReference[oaicite:0]{index=0} Storage

No local filesystem storage.

No external random image hosting.

---

## Required Work

---

## 1. Storage Bucket Setup

Create bucket:

`product-images`

Rules:

* public read access (for storefront)
* secure upload (admin only)
* organized folder structure

---

## 2. Folder Structure Convention

Use:

`products/{productId}/main/`
`products/{productId}/variants/{variantId}/`
`products/{productId}/gallery/`

---

## 3. Upload Service Layer

Create:

`lib/services/storage-service.ts`

---

### Responsibilities:

* upload images
* delete images
* generate public URLs
* validate file types
* enforce size limits

---

## 4. Server Action Upload Flow

Create:

`server/actions/media/upload-product-image.ts`

---

### Rules:

* only admin can upload
* validate file type (image only)
* compress if needed (optional later)
* return public URL

---

## 5. Product Image Integration

Update Prisma relation usage:

* Product → ProductImage
* ProductVariant → optional image override

---

## 6. Image Types Supported

Must support:

* main product image
* gallery images
* variant-specific images

---

## 7. UI Integration Rules (Future Hook)

Prepare structure for:

* drag & drop upload
* image reorder
* image preview grid

BUT do NOT implement UI yet.

---

## 8. Security Rules

Must enforce:

* admin-only uploads
* signed upload handling (if needed later)
* file validation (MIME + extension)
* size limits

---

## 9. Performance Rules

Ensure:

* CDN-ready URLs
* lazy loading compatible structure
* optimized image retrieval
* no base64 storage

---

## Important Rules

Do:

* use Supabase Storage correctly
* centralize upload logic in service layer
* keep backend secure
* structure media for scalability

Do NOT:

* store images in database
* use local uploads
* bypass admin validation
* expose storage keys client-side

---

## Check When Done

* storage bucket created
* upload service works
* images return public URLs
* product-media structure ready
* admin-only restriction enforced
* Prisma relations consistent

---

## Next Step Preview

👉 Wishlist Backend System (user personalization layer + persistence logic)


