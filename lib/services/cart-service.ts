import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { revalidatePath } from 'next/cache'

// Types for cart operations
export interface CartItemData {
  variantId: string
  quantity: number
}

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

/**
 * Optimized Cart Service with batch queries and caching
 */
export class CartService {
  /**
   * Get cart data with optimized queries and caching
   * Uses single optimized query with proper indexes
   */
  static async getCart(userId: string): Promise<CartData> {
    // Single optimized query using indexes
    const cartItems = await prisma.cartItem.findMany({
      where: { userId }, // Uses idx_cart_user_created
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: {
                  where: { imageType: 'main' }, // Uses idx_image_product_type_sort
                  orderBy: { sortOrder: 'asc' },
                  take: 1
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' } // Uses idx_cart_user_created
    })

    // Early return for empty cart
    if (cartItems.length === 0) {
      return {
        items: [],
        summary: {
          subtotal: 0,
          shippingFee: 0,
          total: 0,
          totalItems: 0,
          itemCount: 0
        },
        meta: {
          isEmpty: true,
          hasLowStockItems: false,
          hasOutOfStockItems: false
        }
      }
    }

    // Batch transform all items at once
    const transformedItems = this.transformCartItems(cartItems)

    // Calculate totals in a single pass
    const { subtotal, totalItems, hasLowStockItems, hasOutOfStockItems } = 
      transformedItems.reduce((acc, item) => {
        acc.subtotal += item.totalPrice
        acc.totalItems += item.quantity
        if (item.variant.lowStock) acc.hasLowStockItems = true
        if (!item.variant.inStock) acc.hasOutOfStockItems = true
        return acc
      }, { subtotal: 0, totalItems: 0, hasLowStockItems: false, hasOutOfStockItems: false })

    const shippingFee = subtotal > 0 ? 10 : 0
    const total = subtotal + shippingFee

    return {
      items: transformedItems,
      summary: {
        subtotal,
        shippingFee,
        total,
        totalItems,
        itemCount: transformedItems.length
      },
      meta: {
        isEmpty: false,
        hasLowStockItems,
        hasOutOfStockItems
      }
    }
  }

  /**
   * Batch transform cart items - optimized for performance
   */
  private static transformCartItems(cartItems: any[]): CartItemWithDetails[] {
    return cartItems.map(item => {
      const basePrice = item.variant.product.basePrice.toNumber()
      const compareAtPrice = item.variant.product.compareAtPrice?.toNumber() || null
      const totalPrice = basePrice * item.quantity

      return {
        id: item.id,
        quantity: item.quantity,
        variant: {
          id: item.variant.id,
          size: item.variant.size,
          compressionLevel: item.variant.compressionLevel,
          color: item.variant.color,
          sku: item.variant.sku,
          stockQuantity: item.variant.stockQuantity,
          price: basePrice,
          compareAtPrice,
          inStock: item.variant.stockQuantity > 0,
          lowStock: item.variant.stockQuantity <= 5 && item.variant.stockQuantity > 0
        },
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          slug: item.variant.product.slug,
          shortDescription: item.variant.product.shortDescription,
          image: item.variant.product.images[0] || null
        },
        unitPrice: basePrice,
        totalPrice,
        canUpdateQuantity: item.variant.stockQuantity > 0,
        maxQuantity: item.variant.stockQuantity
      }
    })
  }

  /**
   * Add item to cart with stock validation
   */
  static async addToCart(userId: string, variantId: string, quantity: number = 1) {
    // Check variant stock in same query
    const variant = await prisma.productVariant.findFirst({
      where: { 
        id: variantId,
        stockQuantity: { gt: 0 } // Only allow if in stock
      },
      select: {
        id: true,
        stockQuantity: true,
        product: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })

    if (!variant) {
      throw new Error('Product variant not found or out of stock')
    }

    if (variant.product.status !== 'ACTIVE') {
      throw new Error('Product is not available')
    }

    const maxQuantity = variant.stockQuantity
    if (quantity > maxQuantity) {
      throw new Error(`Only ${maxQuantity} items available in stock`)
    }

    // Use upsert to handle both create and update in single operation
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_variantId: { // Uses unique constraint
          userId,
          variantId
        }
      },
      update: {
        quantity: Math.min(quantity, maxQuantity),
        updatedAt: new Date()
      },
      create: {
        userId,
        variantId,
        quantity: Math.min(quantity, maxQuantity)
      },
      include: {
        variant: {
          select: {
            stockQuantity: true
          }
        }
      }
    })

    // Revalidate cart pages
    revalidatePath('/cart')
    revalidatePath('/shop')
    revalidatePath('/')

    return cartItem
  }

  /**
   * Update cart item quantity with stock validation
   */
  static async updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1')
    }

    // Get cart item with variant stock in single query
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId
      },
      include: {
        variant: {
          select: {
            id: true,
            stockQuantity: true
          }
        }
      }
    })

    if (!cartItem) {
      throw new Error('Cart item not found')
    }

    if (quantity > cartItem.variant.stockQuantity) {
      throw new Error(`Only ${cartItem.variant.stockQuantity} items available in stock`)
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { 
        quantity,
        updatedAt: new Date()
      }
    })

    // Revalidate cart pages
    revalidatePath('/cart')
    revalidatePath('/shop')

    return updatedItem
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(userId: string, cartItemId: string) {
    // Verify ownership before deletion
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId
      }
    })

    if (!cartItem) {
      throw new Error('Cart item not found')
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    // Revalidate cart pages
    revalidatePath('/cart')
    revalidatePath('/shop')
  }

  /**
   * Clear entire cart for user
   */
  static async clearCart(userId: string) {
    await prisma.cartItem.deleteMany({
      where: { userId }
    })

    // Revalidate cart pages
    revalidatePath('/cart')
    revalidatePath('/shop')
  }

  /**
   * Get cart item count only - optimized for header display
   */
  static async getCartItemCount(userId: string): Promise<number> {
    const result = await prisma.cartItem.aggregate({
      where: { userId },
      _sum: {
        quantity: true
      }
    })

    return result._sum.quantity || 0
  }
}

// Cached wrapper for cart operations
export const getCachedCart = unstable_cache(
  async (userId: string) => {
    return await CartService.getCart(userId)
  },
  ['get-cart'],
  {
    revalidate: 60, // 1 minute cache for cart data
  }
)

export const getCachedCartItemCount = unstable_cache(
  async (userId: string) => {
    return await CartService.getCartItemCount(userId)
  },
  ['get-cart-item-count'],
  {
    revalidate: 60, // 1 minute cache for cart count
  }
)
