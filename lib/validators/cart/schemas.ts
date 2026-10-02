import { z } from 'zod'
import { 
  strictObject, 
  baseIdSchema, 
  basePositiveNumberSchema,
} from '../base'

/**
 * Cart validation schemas with strict security rules
 * 
 * Security principles:
 * - Validate product ownership via variantId
 * - Enforce quantity limits
 * - Prevent duplicate entries
 * - Validate stock availability
 */

// Add item to cart schema
export const cartAddItemSchema = strictObject({
  variantId: baseIdSchema,
  quantity: basePositiveNumberSchema
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Maximum quantity per item is 10'),
})

// Update cart item quantity schema
export const cartUpdateQuantitySchema = strictObject({
  itemId: baseIdSchema,
  quantity: basePositiveNumberSchema
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Maximum quantity per item is 10'),
})

// Remove item from cart schema
export const cartRemoveItemSchema = strictObject({
  itemId: baseIdSchema,
})

// Get cart query schema (for validation)
export const cartGetSchema = strictObject({
  // No parameters needed - uses session
})

// Cart item validation for internal use
export const cartItemValidationSchema = strictObject({
  id: baseIdSchema,
  userId: baseIdSchema,
  variantId: baseIdSchema,
  quantity: basePositiveNumberSchema.int(),
})

// Export types
export type CartItemInput = z.infer<typeof cartAddItemSchema>
export type CartUpdateInput = z.infer<typeof cartUpdateQuantitySchema>
export type CartRemoveInput = z.infer<typeof cartRemoveItemSchema>

// Export all schemas as a collection
export const cartSchemas = {
  addItem: cartAddItemSchema,
  updateQuantity: cartUpdateQuantitySchema,
  removeItem: cartRemoveItemSchema,
  getCart: cartGetSchema,
  internal: cartItemValidationSchema,
} as const
