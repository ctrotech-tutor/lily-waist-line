'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function getUserAddresses() {
  try {
    // Create Supabase client and validate user session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to view addresses'
      }
    }

    // Fetch user addresses with default address first, then newest first
    const addresses = await prisma.address.findMany({
      where: {
        userId: user.id
      },
      orderBy: [
        { isDefault: 'desc' }, // Default addresses first
        { createdAt: 'desc' }  // Newest first
      ]
    })

    return {
      success: true,
      data: addresses
    }

  } catch (error) {
    console.error('Get user addresses error:', error)
    
    return {
      success: false,
      error: 'Failed to fetch addresses. Please try again.'
    }
  }
}
