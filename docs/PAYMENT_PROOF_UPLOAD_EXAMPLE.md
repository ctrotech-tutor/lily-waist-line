# Payment Proof Upload - Post-Migration Example

## Overview

After the UUID migration, the payment proof upload system works seamlessly with Supabase Auth because:

```
auth.uid() (UUID) == User.id (UUID) == Order.userId (UUID)
```

## API Endpoint

**POST** `/api/uploads/payment-proof`

## Request

```typescript
// FormData
{
  file: File,           // Payment proof image (PNG, JPEG, WebP)
  orderId: string       // Order UUID
}
```

## Response

```typescript
{
  success: true,
  message: "Payment proof uploaded successfully",
  data: {
    id: string,         // PaymentProof UUID
    status: "PENDING",
    uploadedAt: string, // ISO timestamp
    adminViewUrl: string | null // Signed URL for admin viewing
  }
}
```

## Implementation Details

### 1. Authentication Check

```typescript
// app/api/uploads/payment-proof/route.ts
const { data: { user }, error: authError } = await supabase.auth.getUser()

if (authError || !user) {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}

// user.id is now a UUID that matches User.id in database
```

### 2. Order Ownership Verification

```typescript
const order = await prisma.order.findUnique({
  where: { id: orderId },
  select: { 
    id: true, 
    userId: true,  // Now a UUID
    paymentProofs: {
      select: { status: true }
    }
  }
})

// This comparison now works correctly!
if (order.userId !== user.id) {  // UUID === UUID ✓
  return NextResponse.json(
    { error: 'Access denied' },
    { status: 403 }
  )
}
```

### 3. Storage Path Generation

```typescript
// Storage path: orders/{orderId}/payment-proof/{fileName}
const storagePath = `orders/${orderId}/payment-proof/${fileName}`

// Upload to Supabase Storage
const { error: uploadError } = await supabase.storage
  .from('payment-proofs')
  .upload(storagePath, buffer, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false
  })
```

### 4. RLS Policy Enforcement

The storage bucket policy ensures users can only upload to their own orders:

```sql
-- Storage Policy (post-migration)
CREATE POLICY "Customers can upload payment proofs for their orders" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND (storage.foldername(name))[1] = 'orders'
  AND (storage.foldername(name))[2] IN (
    SELECT o.id 
    FROM "Order" o 
    WHERE o."userId" = auth.uid()  -- UUID = UUID ✓
  )
);
```

### 5. Database Record Creation

```typescript
const paymentProof = await prisma.paymentProof.create({
  data: {
    orderId: orderId,
    imageUrl: storagePath,
    status: 'PENDING'
  }
})
```

## Client-Side Usage

```typescript
// components/order/payment-proof-dropzone.tsx
const handleUpload = async (file: File, orderId: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('orderId', orderId)

  const response = await fetch('/api/uploads/payment-proof', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Upload failed')
  }

  // Invalidate cache to show new payment proof
  queryClient.invalidateQueries(orderKeys.detail(orderId))
  
  return result.data
}
```

## Security Features

### 1. Authentication Required
- Only authenticated users can upload
- `auth.uid()` returns the user's UUID

### 2. Ownership Verification
- Backend checks `Order.userId === user.id`
- RLS policy enforces same check at database level

### 3. File Validation
- MIME type validation (PNG, JPEG, WebP only)
- File size limit (10MB max)
- Empty file detection

### 4. Duplicate Prevention
- Checks for existing pending payment proofs
- Prevents multiple submissions

### 5. Admin Access Control
- Only admins can view all payment proofs
- Customer access limited to own orders

## Error Handling

### Common Errors

1. **Unauthorized (401)**
   - User not logged in
   - Session expired

2. **Forbidden (403)**
   - User doesn't own the order
   - RLS policy violation

3. **Bad Request (400)**
   - Invalid file type
   - File too large
   - Missing order ID

4. **Conflict (409)**
   - Pending payment proof already exists

5. **Not Found (404)**
   - Order doesn't exist

## Testing the Migration

### Test Case 1: Successful Upload

```typescript
// Arrange
const user = await createTestUser() // Creates user with UUID
const order = await createTestOrder(user.id) // Creates order with user's UUID
const file = new File(['test'], 'payment.png', { type: 'image/png' })

// Act
const result = await uploadPaymentProof(file, order.id)

// Assert
expect(result.success).toBe(true)
expect(result.data.status).toBe('PENDING')
expect(result.data.uploadedAt).toBeDefined()
```

### Test Case 2: Unauthorized User

```typescript
// Arrange
const file = new File(['test'], 'payment.png', { type: 'image/png' })
const orderId = 'some-uuid'

// Act
const response = await fetch('/api/uploads/payment-proof', {
  method: 'POST',
  body: createFormData(file, orderId)
  // No auth headers
})

// Assert
expect(response.status).toBe(401)
```

### Test Case 3: Wrong User

```typescript
// Arrange
const user1 = await createTestUser()
const user2 = await createTestUser()
const order = await createTestOrder(user2.id) // Owned by user2
const file = new File(['test'], 'payment.png', { type: 'image/png' })

// Act - Try to upload as user1
const response = await uploadAsUser(user1, file, order.id)

// Assert
expect(response.status).toBe(403)
expect(response.error).toBe('Access denied')
```

## Migration Impact

### Before Migration (Broken)
```typescript
// auth.uid() returns UUID
// User.id was CUID
// Comparison always failed
if (order.userId !== user.id) {  // CUID !== UUID ✗
  // Always returns true - access denied
}
```

### After Migration (Working)
```typescript
// auth.uid() returns UUID
// User.id is now UUID
// Comparison works correctly
if (order.userId !== user.id) {  // UUID === UUID ✓
  // Only returns true if different users
}
```

## Performance Considerations

### Database Indexes
The migration ensures proper indexes exist:

```sql
-- User table
CREATE INDEX "User.id_unique" ON "User"(id);

-- Order table
CREATE INDEX "Order.userId" ON "Order"("userId");
CREATE INDEX "Order.userId_createdAt" ON "Order"("userId", "createdAt" DESC);
```

### Query Optimization
```typescript
// Efficient query using UUID index
const order = await prisma.order.findUnique({
  where: { id: orderId }, // Uses primary key index
  select: { userId: true } // Uses userId index for verification
})
```

## Monitoring

After deployment, monitor:

1. **Upload Success Rate**
   - Track successful vs failed uploads
   - Alert on high failure rates

2. **Authentication Failures**
   - Monitor 401/403 responses
   - Check for session issues

3. **Storage Usage**
   - Monitor bucket size growth
   - Set up alerts for quota limits

4. **Database Performance**
   - Monitor query times
   - Check index usage

## Conclusion

The UUID migration ensures that the entire authentication and authorization flow works seamlessly:

- ✅ Supabase Auth UID matches Database User ID
- ✅ RLS policies enforce correct access
- ✅ Storage policies work with user IDs
- ✅ Payment proof uploads are secure
- ✅ All foreign key relationships are consistent

**Result**: A robust, secure, and maintainable authentication system that follows industry best practices.