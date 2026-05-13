/**
 * Server Actions Foundation
 * 
 * All business mutations live here.
 * 
 * Examples to be implemented later:
 * - auth actions
 * - cart actions  
 * - wishlist actions
 * - address actions
 * - order actions
 * - admin actions
 */

// Export structure for future actions
export type ServerAction<T = void> = (...args: unknown[]) => Promise<T>

// Placeholder for future auth actions
export const authActions = {
  // TODO: Implement auth actions
}

// Cart actions
export * from './cart'

// Wishlist actions
export * from './wishlist'

// Address actions
export * from './address'

// Order actions
export * from './orders'

// Placeholder for future admin actions
export const adminActions = {
  // TODO: Implement admin actions
}
