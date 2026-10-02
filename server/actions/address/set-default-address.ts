'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function setDefaultAddress(addressId: string) {
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
        error: 'You must be logged in to set a default address'
      }
    }

    // Use transaction to ensure only one default address exists
    const result = await prisma.$transaction(async (tx) => {
      // Verify address ownership
      const existingAddress = await tx.address.findUnique({
        where: { id: addressId }
      })

      if (!existingAddress) {
        throw new Error('Address not found')
      }

      if (existingAddress.userId !== user.id) {
        throw new Error('You do not have permission to update this address')
      }

      // If the address is already default, no action needed
      if (existingAddress.isDefault) {
        return existingAddress
      }

      // Unset all other default addresses for this user
      await tx.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          id: { not: addressId }
        },
        data: {
          isDefault: false
        }
      })

      // Set the new default address
      const updatedAddress = await tx.address.update({
        where: { id: addressId },
        data: {
          isDefault: true
        }
      })

      return updatedAddress
    })

    // Revalidate address pages
    revalidatePath('/address')
    revalidatePath('/checkout')
    
    return {
      success: true,
      data: result,
      message: 'Default address updated successfully'
    }

  } catch (error) {
    console.error('Set default address error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to set default address. Please try again.'
    
    return {
      success: false,
      error: errorMessage
    }
  }
}
