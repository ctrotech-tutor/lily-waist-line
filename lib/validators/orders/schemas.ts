import { z } from 'zod'
import { 
  strictObject, 
  baseIdSchema, 
  baseStringSchema,
  basePositiveNumberSchema,
  baseCurrencySchema,
  baseStatusSchema,
  basePaginationSchema,
  VALIDATION_ERRORS 
} from '../base'

/**
 * Order validation schemas with strict security rules
 * 
 * Security principles:
 * - Validate order ownership
 * - Enforce business rules
 * - Prevent unauthorized status changes
 * - Validate payment constraints
 */

// Create order schema
export const createOrderSchema = strictObject({
  addressId: baseIdSchema,
  paymentMethod: z.enum(['CASH_APP', 'PAYPAL']),
  // Note: cart items are derived from user's cart, not provided by client
})

// Order query schema
export const orderQuerySchema = strictObject({
  orderId: baseIdSchema,
})

// Order list query schema with pagination and filtering
export const orderListQuerySchema = strictObject({
  ...basePaginationSchema.shape,
  status: z.enum(['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  search: z.string().trim().max(100, 'Search query too long').optional(),
})

// Update order status schema (admin only)
export const updateOrderStatusSchema = strictObject({
  orderId: baseIdSchema,
  status: z.enum(['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  adminNote: z.string().trim().max(500, 'Note too long').optional(),
})

// Add tracking number schema (admin only)
export const addTrackingNumberSchema = strictObject({
  orderId: baseIdSchema,
  carrier: z.enum(['UPS', 'FedEx', 'USPS', 'DHL', 'OTHER']),
  trackingNumber: z.string().trim().min(1, 'Tracking number is required').max(100, 'Tracking number too long'),
  estimatedDelivery: z.string().datetime().optional(),
})

// Payment verification schema (admin only)
export const verifyPaymentSchema = strictObject({
  orderId: baseIdSchema,
  action: z.enum(['APPROVE', 'REJECT']),
  adminNote: z.string().trim().max(500, 'Note too long').optional(),
})

// Order item validation for internal use
export const orderItemValidationSchema = strictObject({
  id: baseIdSchema,
  orderId: baseIdSchema,
  variantId: baseIdSchema,
  quantity: basePositiveNumberSchema.int(),
  price: baseCurrencySchema,
})

// Full order validation for internal use
export const orderValidationSchema = strictObject({
  id: baseIdSchema,
  userId: baseIdSchema,
  status: z.enum(['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  totalAmount: baseCurrencySchema,
  addressId: baseIdSchema,
  paymentMethod: z.enum(['CASH_APP', 'PAYPAL']),
})

// Export types
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderQueryInput = z.infer<typeof orderQuerySchema>
export type OrderListQueryInput = z.infer<typeof orderListQuerySchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type AddTrackingNumberInput = z.infer<typeof addTrackingNumberSchema>
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>

// Export all schemas as a collection
export const orderSchemas = {
  create: createOrderSchema,
  query: orderQuerySchema,
  list: orderListQuerySchema,
  updateStatus: updateOrderStatusSchema,
  addTracking: addTrackingNumberSchema,
  verifyPayment: verifyPaymentSchema,
  internal: {
    item: orderItemValidationSchema,
    order: orderValidationSchema,
  },
} as const
