/**
 * Wishlist-related types
 */

import type { StockState } from './common'

// Wishlist item card props
export interface WishlistItemCardProps {
  id: string
  slug: string
  image: string
  name: string
  tagline?: string
  price: number
  originalPrice?: number
  stockState?: StockState
  variantId?: string
  inCart?: boolean
  className?: string
  onAddToCart?: (variantId: string) => void
  onRemove?: (id: string) => void
}