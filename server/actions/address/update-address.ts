'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { updateAddressSchema, type UpdateAddressInput } from '@/lib/validators/address'
import type { Prisma } from '@/lib/generated/prisma/client'

export async function updateAddress(input: UpdateAddressInput) {
  try {
    // Validate input
    const validatedData = updateAddressSchema.parse(input)

    // Create Supabase client and validate user session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to update an address'
      }
    }

    // Verify address ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: validatedData.id }
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
        error: 'You do not have permission to update this address'
      }
    }

    // If setting as default, unset any existing default address
    if (validatedData.isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          id: { not: validatedData.id }
        },
        data: {
          isDefault: false
        }
      })
    }

    // Update only the provided fields
    const updateData: Prisma.AddressUpdateInput = {}
    
    if (validatedData.firstName !== undefined) updateData.firstName = validatedData.firstName
    if (validatedData.lastName !== undefined) updateData.lastName = validatedData.lastName
    if (validatedData.company !== undefined) updateData.company = validatedData.company
    if (validatedData.addressLine1 !== undefined) updateData.addressLine1 = validatedData.addressLine1
    if (validatedData.addressLine2 !== undefined) updateData.addressLine2 = validatedData.addressLine2
    if (validatedData.city !== undefined) updateData.city = validatedData.city
    if (validatedData.state !== undefined) updateData.state = validatedData.state
    if (validatedData.postalCode !== undefined) updateData.postalCode = validatedData.postalCode
    if (validatedData.country !== undefined) updateData.country = validatedData.country
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone
    if (validatedData.isDefault !== undefined) updateData.isDefault = validatedData.isDefault

    const address = await prisma.address.update({
      where: { id: validatedData.id },
      data: updateData
    })

    // Revalidate address pages
    revalidatePath('/address')
    revalidatePath('/checkout')
    revalidatePath(`/address/${validatedData.id}`)
    
    return {
      success: true,
      data: address,
      message: 'Address updated successfully'
    }

  } catch (error) {
    console.error('Update address error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: 'Invalid address data provided'
      }
    }

    return {
      success: false,
      error: 'Failed to update address. Please try again.'
    }
  }
}
