/**
 * Global Validation Layer - Backend Security & Validation
 * 
 * Complete validation schemas with strict security rules:
 * - Input sanitization (trim strings, remove empty payloads)
 * - Reject unknown fields (strict typing only)
 * - Server-first validation approach
 * - Business rule enforcement
 */

// Export base validation utilities
export * from './base'

// Export auth validation schemas
export * from './auth'

// Export cart validation schemas
export * from './cart'

// Export order validation schemas
export * from './orders'

// Export admin validation schemas
export * from './admin'

// Export payment validation schemas
export * from './payment'

// Export payment proof validation schemas
export { 
  paymentProofUploadSchema,
  paymentProofQuerySchema,
  paymentProofStatusUpdateSchema,
  type PaymentProofUploadInput,
  type PaymentProofQueryInput,
  type PaymentProofStatusUpdateInput
} from './payment-proof'

// Address schemas will be exported when implemented
// TODO: Implement address validation schemas
