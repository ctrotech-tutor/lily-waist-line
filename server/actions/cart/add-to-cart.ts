'use server'

import { createClient } from '@/lib/supabase/server'
import { CartService } from '@/lib/services/cart-service'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const addToCartSchema = z.object({
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
})

export async function addToCart(formData: { variantId: string; quantity: number }) {
  try {
    // Validate input
    const validatedData = addToCartSchema.parse(formData)

    // Create Supabase client and validate session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to add items to cart'
      }
    }

    // Use optimized cart service with built-in stock validation
    const cartItem = await CartService.addToCart(
      user.id, 
      validatedData.variantId, 
      validatedData.quantity
    )

    // Get variant details for response
    const variant = await prisma.productVariant.findUnique({
      where: { id: validatedData.variantId },
      select: {
        id: true, size: true, compressionLevel: true, stockQuantity: true,
        product: { select: { name: true } },
      },
    })

    if (!variant) {
      throw new Error('Variant not found')
    }

    return {
      success: true,
      message: 'Item added to cart',
      data: {
        cartItemId: cartItem.id,
        variantId: variant.id,
        productName: variant.product.name,
        size: variant.size,
        compressionLevel: variant.compressionLevel,
        quantity: cartItem.quantity,
        stockRemaining: variant.stockQuantity - cartItem.quantity
      }
    }

  } catch (error) {
    console.error('Add to cart error:', error)
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: 'Failed to add item to cart. Please try again.'
    }
  }
}
