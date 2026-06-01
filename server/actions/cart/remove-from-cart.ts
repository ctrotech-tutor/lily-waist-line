'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const removeFromCartSchema = z.object({
  cartItemId: z.string().min(1, 'Cart item ID is required')
})

export async function removeFromCart(formData: { cartItemId: string }) {
  try {
    // Validate input
    const validatedData = removeFromCartSchema.parse(formData)

    // Create Supabase client and validate session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to remove items from cart'
      }
    }

    // Find the cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: validatedData.cartItemId },
      select: {
        id: true, variantId: true, userId: true, quantity: true,
        variant: {
          select: {
            id: true, size: true, compressionLevel: true, sku: true,
            product: { select: { name: true } },
          },
        },
      },
    })

    if (!cartItem) {
      return {
        success: false,
        error: 'Cart item not found'
      }
    }

    if (cartItem.userId !== user.id) {
      return {
        success: false,
        error: 'You can only remove your own cart items'
      }
    }

    // Remove the cart item
    await prisma.cartItem.delete({
      where: { id: validatedData.cartItemId }
    })

    // Revalidate cart page to show updated data
    revalidatePath('/cart')

    return {
      success: true,
      message: 'Item removed from cart',
      data: {
        cartItemId: cartItem.id,
        variantId: cartItem.variantId,
        productName: cartItem.variant.product.name,
        size: cartItem.variant.size,
        compressionLevel: cartItem.variant.compressionLevel,
        removedQuantity: cartItem.quantity
      }
    }

  } catch (error) {
    console.error('Remove from cart error:', error)
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: 'Failed to remove item from cart. Please try again.'
    }
  }
}
