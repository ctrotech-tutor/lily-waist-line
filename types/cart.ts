/**
 * Cart-related types
 */

// Input data for adding item to cart
export interface CartItemData {
  variantId: string
  quantity: number
}

// Cart item with full details from database
export interface CartItemWithDetails {
  id: string
  quantity: number
  variant: {
    id: string
    size: string
    compressionLevel: string
    color: string | null
    sku: string
    stockQuantity: number
    price: number
    compareAtPrice: number | null
    inStock: boolean
    lowStock: boolean
  }
  product: {
    id: string
    name: string
    slug: string
    shortDescription: string
    image: {
      id: string
      url: string
      altText: string | null
      imageType: string
      sortOrder: number
    } | null
  }
  unitPrice: number
  totalPrice: number
  canUpdateQuantity: boolean
  maxQuantity: number
}

// Complete cart data structure
export interface CartData {
  items: CartItemWithDetails[]
  summary: {
    subtotal: number
    shippingFee: number
    total: number
    totalItems: number
    itemCount: number
  }
  meta: {
    isEmpty: boolean
    hasLowStockItems: boolean
    hasOutOfStockItems: boolean
  }
}