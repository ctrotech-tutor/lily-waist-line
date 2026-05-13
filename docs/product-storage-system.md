# Product Media + Storage System

## Overview

The Product Media + Storage System provides a complete image management solution for Lily Waist Line products using Supabase Storage. It supports product images, variant images, and gallery images with secure admin-only upload functionality.

## Architecture

### Storage Layer
- **Provider**: Supabase Storage
- **Bucket**: `product-images`
- **Access**: Public read, admin-only upload
- **File Size Limit**: 5MB
- **Supported Formats**: JPEG, PNG, WebP, GIF

### Folder Structure
```
product-images/
├── products/{productId}/main/           # Main product images
├── products/{productId}/variants/{variantId}/  # Variant-specific images
└── products/{productId}/gallery/        # Gallery images
```

### Database Schema
The `ProductImage` model includes:
- `storagePath`: Storage path in Supabase
- `imageType`: "main", "variant", or "gallery"
- `variantId`: Optional association with ProductVariant
- `url`: Public URL for the image

## Components

### 1. Storage Service (`lib/services/storage-service.ts`)

**Responsibilities:**
- Upload images to Supabase Storage
- Delete images from storage
- Generate public URLs
- Validate file types and sizes
- Create storage bucket if needed

**Key Methods:**
```typescript
uploadProductImage({ file, productId, variantId?, type })
deleteProductImage(path)
getPublicUrl(path)
createBucketIfNotExists()
```

### 2. Server Actions (`server/actions/media/upload-product-image.ts`)

**Security:**
- Admin-only access verification
- File type validation
- File size validation
- Proper error handling

**Available Actions:**
```typescript
uploadProductImage(formData)  // Upload new image
deleteProductImage(path)     // Delete existing image
createStorageBucket()        // Setup storage bucket
```

### 3. Database Model

```prisma
model ProductImage {
  id         String  @id @default(cuid())
  productId  String
  url        String
  storagePath String
  altText    String?
  imageType  String  @default("gallery")
  variantId  String?
  sortOrder  Int     @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  product  Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)
}
```

## Usage Examples

### Upload Main Product Image
```typescript
const formData = new FormData()
formData.append('file', imageFile)
formData.append('productId', 'product-123')
formData.append('type', 'main')

const result = await uploadProductImage(formData)
if (result.success) {
  console.log('Image uploaded:', result.url)
}
```

### Upload Variant Image
```typescript
const formData = new FormData()
formData.append('file', imageFile)
formData.append('productId', 'product-123')
formData.append('variantId', 'variant-456')
formData.append('type', 'variant')

const result = await uploadProductImage(formData)
```

### Upload Gallery Image
```typescript
const formData = new FormData()
formData.append('file', imageFile)
formData.append('productId', 'product-123')
formData.append('type', 'gallery')

const result = await uploadProductImage(formData)
```

## Setup Instructions

### 1. Database Migration
Run the migration to update the ProductImage model:
```sql
-- Apply migration: 001_add_product_image_storage_fields.sql
```

### 2. Storage Bucket Setup
Run the SQL script in Supabase SQL Editor:
```sql
-- scripts/setup-product-storage.sql
```

Or use the Node.js script:
```bash
npx ts-node scripts/setup-storage-bucket.ts
```

### 3. Testing
Run the test suite to verify functionality:
```bash
npx ts-node scripts/test-storage-upload.ts
```

## Security Features

### Access Control
- **Upload**: Admin users only (verified via Supabase auth metadata)
- **Read**: Public access for all images
- **Delete**: Admin users only

### File Validation
- **Types**: Only image files (JPEG, PNG, WebP, GIF)
- **Size**: Maximum 5MB per file
- **MIME Type**: Server-side validation

### Storage Policies
RLS policies enforce:
- Public read access for storefront
- Admin-only upload/delete operations
- Proper bucket isolation

## Integration Points

### Admin Product Forms
Use the server actions in admin product creation/editing forms:
```typescript
import { uploadProductImage } from '@/server/actions/media/upload-product-image'
```

### Product Display
Generate public URLs for frontend display:
```typescript
import { storageService } from '@/lib/services/storage-service'

const imageUrl = storageService.getPublicUrl(productImage.storagePath)
```

### Database Queries
Query images by type and product:
```typescript
// Main images
const mainImages = await prisma.productImage.findMany({
  where: { productId, imageType: 'main' },
  orderBy: { sortOrder: 'asc' }
})

// Variant images
const variantImages = await prisma.productImage.findMany({
  where: { variantId },
  orderBy: { sortOrder: 'asc' }
})
```

## Performance Considerations

### CDN Integration
- Supabase Storage provides CDN-ready URLs
- Images are served via global CDN
- Cache headers set to 1 hour

### Image Optimization
- Original images stored (no compression)
- Future: Add image optimization service
- Lazy loading compatible URLs

### Database Indexing
- Indexes on `productId`, `variantId`, and `imageType`
- Optimized for common query patterns

## Error Handling

### Upload Errors
- File type validation
- File size limits
- Storage quota exceeded
- Network failures

### Security Errors
- Unauthorized access attempts
- Invalid admin role
- Malicious file uploads

## Future Enhancements

### Image Processing
- Automatic image resizing
- Multiple format generation
- Compression optimization
- Watermarking

### Advanced Features
- Image alt text AI generation
- Bulk upload operations
- Image analytics
- CDN optimization

## Monitoring

### Storage Usage
Monitor bucket usage via Supabase Dashboard:
- File count
- Storage size
- Bandwidth usage

### Security Logs
Track admin upload activities:
- Upload attempts
- Failed validations
- Access violations

## Troubleshooting

### Common Issues
1. **Upload fails**: Check admin role and file size
2. **Images not showing**: Verify bucket policies
3. **Path errors**: Ensure correct folder structure
4. **Permission errors**: Run storage setup script

### Debug Steps
1. Check Supabase auth role
2. Verify bucket exists
3. Test with small images first
4. Review storage policies
5. Check database connections
