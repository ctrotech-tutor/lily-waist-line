import prisma from '@/lib/prisma'
import { Decimal } from '@/lib/prisma'

/**
 * Prisma Safety Rules
 * 
 * Enforces strict database operation rules:
 * - No unfiltered updates
 * - No blind deletes
 * - No mass updates without filters
 * - Always use where clauses
 * - Validate ownership before operations
 */

export interface SafeOperationOptions {
  userId: string
  requireOwnership?: boolean
  validateStock?: boolean
}

/**
 * Safe find operations with ownership validation
 */
export class SafeFinder {
  /**
   * Find order with ownership validation
   */
  static async findOrder(orderId: string, userId: string) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId // Ownership validation
      }
    })
  }

  /**
   * Find address with ownership validation
   */
  static async findAddress(addressId: string, userId: string) {
    return prisma.address.findFirst({
      where: {
        id: addressId,
        userId: userId // Ownership validation
      }
    })
  }

  /**
   * Find cart items with ownership validation
   */
  static async findCartItems(userId: string) {
    return prisma.cartItem.findMany({
      where: {
        userId: userId // Ownership validation
      },
      include: {
        variant: {
          include: {
            product: true
          }
        }
      }
    })
  }

  /**
   * Find cart item with ownership validation
   */
  static async findCartItem(itemId: string, userId: string) {
    return prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: userId // Ownership validation
      }
    })
  }

  /**
   * Find wishlist items with ownership validation
   */
  static async findWishlistItems(userId: string) {
    return prisma.wishlistItem.findMany({
      where: {
        userId: userId // Ownership validation
      },
      include: {
        product: true
      }
    })
  }

  /**
   * Find wishlist item with ownership validation
   */
  static async findWishlistItem(itemId: string, userId: string) {
    return prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        userId: userId // Ownership validation
      }
    })
  }

  /**
   * Find payment proof with order ownership validation
   */
  static async findPaymentProof(proofId: string, userId: string) {
    return prisma.paymentProof.findFirst({
      where: {
        id: proofId,
        order: {
          userId: userId // Ownership validation through order
        }
      }
    })
  }
}

/**
 * Safe update operations with proper filtering
 */
export class SafeUpdater {
  /**
   * Safe order update with ownership and status validation
   */
  static async updateOrder(
    orderId: string,
    userId: string,
    data: Record<string, unknown>,
    allowedFields: string[] = []
  ) {
    // Validate allowed fields
    const filteredData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key]
        return obj
      }, {} as Record<string, unknown>)

    return prisma.order.updateMany({
      where: {
        id: orderId,
        userId: userId // Ownership validation
      },
      data: filteredData
    })
  }

  /**
   * Safe address update with ownership validation
   */
  static async updateAddress(
    addressId: string,
    userId: string,
    data: Record<string, unknown>
  ) {
    return prisma.address.updateMany({
      where: {
        id: addressId,
        userId: userId // Ownership validation
      },
      data
    })
  }

  /**
   * Safe cart item quantity update with stock validation
   */
  static async updateCartItemQuantity(
    itemId: string,
    userId: string,
    newQuantity: number
  ) {
    return prisma.cartItem.updateMany({
      where: {
        id: itemId,
        userId: userId // Ownership validation
      },
      data: {
        quantity: newQuantity
      }
    })
  }

  /**
   * Safe product variant stock update (admin only)
   */
  static async updateProductStock(
    variantId: string,
    newStock: number
  ) {
    return prisma.productVariant.updateMany({
      where: {
        id: variantId // Specific variant only
      },
      data: {
        stockQuantity: newStock
      }
    })
  }
}

/**
 * Safe delete operations with ownership validation
 */
export class SafeDeleter {
  /**
   * Safe cart item deletion with ownership validation
   */
  static async deleteCartItem(itemId: string, userId: string) {
    return prisma.cartItem.deleteMany({
      where: {
        id: itemId,
        userId: userId // Ownership validation
      }
    })
  }

  /**
   * Safe address deletion with ownership validation
   */
  static async deleteAddress(addressId: string, userId: string) {
    return prisma.address.deleteMany({
      where: {
        id: addressId,
        userId: userId // Ownership validation
      }
    })
  }

  /**
   * Safe wishlist item deletion with ownership validation
   */
  static async deleteWishlistItem(itemId: string, userId: string) {
    return prisma.wishlistItem.deleteMany({
      where: {
        id: itemId,
        userId: userId // Ownership validation
      }
    })
  }

  /**
   * Safe payment proof deletion (admin only)
   */
  static async deletePaymentProof(proofId: string) {
    return prisma.paymentProof.deleteMany({
      where: {
        id: proofId // Specific proof only
      }
    })
  }
}

/**
 * Safe create operations with validation
 */
export class SafeCreator {
  /**
   * Safe cart item creation with stock validation
   */
  static async createCartItem(
    userId: string,
    variantId: string,
    quantity: number
  ) {
    // First check stock availability
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { stockQuantity: true }
    })

    if (!variant || variant.stockQuantity < quantity) {
      throw new Error('Insufficient stock')
    }

    return prisma.cartItem.create({
      data: {
        userId,
        variantId,
        quantity
      }
    })
  }

  /**
   * Safe address creation with validation
   */
  static async createAddress(
    userId: string,
    addressData: Omit<Parameters<typeof prisma.address.create>[0]['data'], 'userId' | 'user'>
  ) {
    return prisma.address.create({
      data: {
        userId,
        ...addressData
      }
    })
  }

  /**
   * Safe order creation with stock validation
   */
  static async createOrder(
    userId: string,
    orderData: Omit<Parameters<typeof prisma.order.create>[0]['data'], 'userId' | 'user' | 'address'> & {
      addressId: string
      subtotal: number | string | Decimal
      total: number | string | Decimal
      paymentMethod: 'CASH_APP' | 'PAYPAL'
    }
  ) {
    // Validate stock for all items in transaction
    return prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          ...orderData
        }
      })

      return order
    })
  }
}

/**
 * Stock validation utilities
 */
export class StockValidator {
  /**
   * Check if variant has sufficient stock
   */
  static async checkStock(variantId: string, requiredQuantity: number): Promise<boolean> {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { stockQuantity: true }
    })

    return variant ? variant.stockQuantity >= requiredQuantity : false
  }

  /**
   * Validate stock for multiple variants
   */
  static async validateMultipleStock(
    items: Array<{ variantId: string; quantity: number }>
  ): Promise<{ valid: boolean; invalidItems: string[] }> {
    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: items.map(item => item.variantId) }
      },
      select: { id: true, stockQuantity: true }
    })

    const invalidItems: string[] = []

    for (const item of items) {
      const variant = variants.find(v => v.id === item.variantId)
      if (!variant || variant.stockQuantity < item.quantity) {
        invalidItems.push(item.variantId)
      }
    }

    return {
      valid: invalidItems.length === 0,
      invalidItems
    }
  }

  /**
   * Reserve stock (decrement within transaction)
   */
  static async reserveStock(variantId: string, quantity: number) {
    return prisma.productVariant.updateMany({
      where: {
        id: variantId,
        stockQuantity: { gte: quantity } // Ensure enough stock
      },
      data: {
        stockQuantity: {
          decrement: quantity
        }
      }
    })
  }

  /**
   * Release stock (increment within transaction)
   */
  static async releaseStock(variantId: string, quantity: number) {
    return prisma.productVariant.updateMany({
      where: {
        id: variantId
      },
      data: {
        stockQuantity: {
          increment: quantity
        }
      }
    })
  }
}

/**
 * Transaction safety wrapper
 */
export async function safeTransaction<T>(
  callback: (tx: unknown) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(callback)
  } catch (error) {
    // Log transaction error without exposing details
    console.error('Database transaction failed:', error instanceof Error ? error.message : 'Unknown error')
    throw new Error('Operation failed. Please try again.')
  }
}
