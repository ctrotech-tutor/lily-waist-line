/**
 * Services Layer Foundation
 *
 * Shared business helpers.
 */

// Product Service
export { ProductService } from './product-service'
export type {
  ProductWithDetails,
  ProductResult
} from './product-service'

// Product types from types/product
export type { ProductQueryOptions } from '@/types/product'

// Cart types from types/cart
export type { CartItemData, CartItemWithDetails, CartData } from '@/types/cart'

// Admin Service types
export type { AdminOrderSerializable, AdminOrderResult } from './admin-service'
export const paymentServices = {
  // TODO: Implement payment processing services
}

// Placeholder for future email services
export const emailServices = {
  // TODO: Implement email notification services
}

// Placeholder for future storage services
export const storageServices = {
  // TODO: Implement file storage services
}

// Placeholder for future notification services
export const notificationServices = {
  // TODO: Implement notification services
}
