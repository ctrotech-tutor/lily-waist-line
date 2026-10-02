'use server'

import { createClient } from '@/lib/supabase/server'
import { CartService } from '@/lib/services/cart-service'

export async function getCart() {
  try {
    // Create Supabase client and validate session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to view your cart'
      }
    }

    // Use optimized cart service
    const cartData = await CartService.getCart(user.id)

    return {
      success: true,
      data: cartData
    }

  } catch (error) {
    console.error('Get cart error:', error)
    
    return {
      success: false,
      error: 'Failed to fetch cart. Please try again.'
    }
  }
}
