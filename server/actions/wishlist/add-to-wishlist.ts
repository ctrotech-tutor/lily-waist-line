'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addToWishlist(productId: string) {
  try {
    // Validate productId
    if (!productId) {
      return {
        success: false,
        error: 'Product ID is required'
      }
    }

    // Create Supabase client and validate user session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to add items to your wishlist'
      }
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      }
    }

    // Check if item already exists in wishlist (composite unique constraint will handle this)
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    if (existingItem) {
      return {
        success: false,
        error: 'This item is already in your wishlist'
      }
    }

    // Add to wishlist
    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId: productId
      }
    })

    // Revalidate wishlist page
    revalidatePath('/wishlist')
    
    return {
      success: true,
      message: 'Item added to wishlist'
    }

  } catch (error) {
    console.error('Add to wishlist error:', error)
    return {
      success: false,
      error: 'Failed to add item to wishlist. Please try again.'
    }
  }
}
