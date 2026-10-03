'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { PrismaClient } from '@/lib/generated/prisma/client'
import { releaseExpiredInventoryReservations } from '@/lib/services/inventory-reservations'

const updateCartQuantitySchema = z.object({
  cartItemId: z.string().min(1, 'Cart item ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
})

export async function updateCartQuantity(formData: { cartItemId: string; quantity: number }) {
  try {
    // Validate input
    const validatedData = updateCartQuantitySchema.parse(formData)

    // Create Supabase client and validate session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to update cart items'
      }
    }

    await releaseExpiredInventoryReservations()

    // Use transaction to ensure stock consistency
    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$use' | '$extends'>) => {
      // Find the cart item and verify ownership
      const cartItem = await tx.cartItem.findUnique({
        where: { id: validatedData.cartItemId },
        include: {
          variant: {
            include: { product: true }
          }
        }
      })

      if (!cartItem) {
        throw new Error('Cart item not found')
      }

      if (cartItem.userId !== user.id) {
        throw new Error('You can only update your own cart items')
      }

      // Check stock availability
      if (cartItem.variant.stockQuantity < validatedData.quantity) {
        throw new Error(`Insufficient stock. Only ${cartItem.variant.stockQuantity} items available.`)
      }

      // Update the cart item quantity
      const updatedCartItem = await tx.cartItem.update({
        where: { id: validatedData.cartItemId },
        data: { quantity: validatedData.quantity }
      })

      return {
        cartItem: updatedCartItem,
        variant: cartItem.variant,
        product: cartItem.variant.product,
        previousQuantity: cartItem.quantity,
        newQuantity: validatedData.quantity
      }
    })

    // Revalidate cart page to show updated data
    revalidatePath('/cart')

    return {
      success: true,
      message: 'Cart quantity updated',
      data: {
        cartItemId: result.cartItem.id,
        variantId: result.variant.id,
        productName: result.product.name,
        size: result.variant.size,
        compressionLevel: result.variant.compressionLevel,
        previousQuantity: result.previousQuantity,
        newQuantity: result.newQuantity,
        stockRemaining: result.variant.stockQuantity - result.newQuantity
      }
    }

  } catch (error) {
    console.error('Update cart quantity error:', error)
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: 'Failed to update cart quantity. Please try again.'
    }
  }
}
