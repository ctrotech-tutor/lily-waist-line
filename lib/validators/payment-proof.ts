import { z } from 'zod'

// Payment proof upload validation schema
export const paymentProofUploadSchema = z.object({
  orderId: z.string()
    .min(1, 'Order ID is required')
    .uuid('Invalid order ID format'),
  file: z.instanceof(File)
    .refine(
      (file) => file.size > 0,
      'File cannot be empty'
    )
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'File size must be less than 10MB'
    )
    .refine(
      (file) => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
      'Invalid file type. Only PNG, JPEG, and WebP images are allowed.'
    ),
  transactionRef: z.string().optional(),
})

// Payment proof query validation schema
export const paymentProofQuerySchema = z.object({
  orderId: z.string()
    .min(1, 'Order ID is required')
    .uuid('Invalid order ID format'),
})

// Payment proof status update validation (for admin)
export const paymentProofStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  adminNote: z.string().optional()
})

export type PaymentProofUploadInput = z.infer<typeof paymentProofUploadSchema>
export type PaymentProofQueryInput = z.infer<typeof paymentProofQuerySchema>
export type PaymentProofStatusUpdateInput = z.infer<typeof paymentProofStatusUpdateSchema>
