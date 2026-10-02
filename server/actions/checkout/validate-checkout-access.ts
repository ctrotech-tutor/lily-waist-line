'use server'

import { createClient } from '@/lib/supabase/server'
import { CartService } from '@/lib/services/cart-service'

export async function validateCheckoutAccess() {
  try {
    // Create Supabase client and validate session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to checkout',
        redirect: '/login'
      }
    }

    // Fetch cart to validate it's not empty
    const cartData = await CartService.getCart(user.id)

    if (!cartData.items || cartData.items.length === 0) {
      return {
        success: false,
        error: 'Your cart is empty',
        redirect: '/cart'
      }
    }

    return {
      success: true,
      data: {
        userId: user.id,
        itemCount: cartData.items.length
      }
    }

  } catch (error) {
    console.error('Validate checkout access error:', error)
    
    return {
      success: false,
      error: 'Failed to validate checkout access. Please try again.',
      redirect: '/cart'
    }
  }
}
