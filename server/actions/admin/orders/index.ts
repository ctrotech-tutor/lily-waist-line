/**
 * Admin Order Management System
 * 
 * Complete server actions for admin order management with:
 * - Role-based security (ADMIN only)
 * - Input validation with Zod schemas
 * - Transaction safety
 * - State transition validation
 * - Proper error handling
 */

export { getAllOrders } from './get-all-orders'
export { getOrderById } from './get-order-by-id'
export { verifyPayment } from './verify-payment'
export { updateFulfillmentStatus } from './update-fulfillment-status'
export { addTrackingNumber } from './add-tracking-number'

// Types for admin order management
export type GetAllOrdersInput = {
  page?: number
  limit?: number
  search?: string
  paymentStatus?: 'PENDING' | 'PAID' | 'REJECTED'
  fulfillmentStatus?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

export type GetOrderByIdInput = {
  orderId: string
}

export type VerifyPaymentInput = {
  orderId: string
  action: 'APPROVE' | 'REJECT'
  reason?: string
}

export type UpdateFulfillmentStatusInput = {
  orderId: string
  newStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

export type AddTrackingNumberInput = {
  orderId: string
  carrier: string
  trackingNumber: string
}

// Valid fulfillment status transitions
export const VALID_FULFILLMENT_TRANSITIONS = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [], // Terminal state
  CANCELLED: [], // Terminal state
} as const

// Payment status transitions
export const PAYMENT_STATUS_MAP = {
  APPROVE: 'PAID' as const,
  REJECT: 'REJECTED' as const,
} as const

// Payment proof status transitions
export const PAYMENT_PROOF_STATUS_MAP = {
  APPROVE: 'VERIFIED' as const,
  REJECT: 'REJECTED' as const,
} as const
