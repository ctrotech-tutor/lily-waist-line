'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteAddress(addressId: string) {
  try {
    // Validate addressId
    if (!addressId) {
      return {
        success: false,
        error: 'Address ID is required'
      }
    }

    // Create Supabase client and validate user session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to delete an address'
      }
    }

    // Verify address ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId }
    })

    if (!existingAddress) {
      return {
        success: false,
        error: 'Address not found'
      }
    }

    if (existingAddress.userId !== user.id) {
      return {
        success: false,
        error: 'You do not have permission to delete this address'
      }
    }

    // Check if address is being used by any orders
    const activeOrders = await prisma.order.findFirst({
      where: {
        addressId: addressId,
        fulfillmentStatus: {
          notIn: ['DELIVERED', 'CANCELLED']
        }
      }
    })

    if (activeOrders) {
      return {
        success: false,
        error: 'Cannot delete address that is being used by active orders'
      }
    }

    // Delete the address
    await prisma.address.delete({
      where: { id: addressId }
    })

    // Revalidate address pages
    revalidatePath('/address')
    revalidatePath('/checkout')
    
    return {
      success: true,
      message: 'Address deleted successfully'
    }

  } catch (error) {
    console.error('Delete address error:', error)
    
    return {
      success: false,
      error: 'Failed to delete address. Please try again.'
    }
  }
}
