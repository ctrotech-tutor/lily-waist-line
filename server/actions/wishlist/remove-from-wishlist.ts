'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function removeFromWishlist(productId: string) {
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
        error: 'You must be logged in to remove items from your wishlist'
      }
    }

    // Find and delete the wishlist item
    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        productId: productId
      }
    })

    if (deletedItem.count === 0) {
      return {
        success: false,
        error: 'Item not found in your wishlist'
      }
    }

    // Revalidate wishlist page
    revalidatePath('/wishlist')
    
    return {
      success: true,
      message: 'Item removed from wishlist'
    }

  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return {
      success: false,
      error: 'Failed to remove item from wishlist. Please try again.'
    }
  }
}
