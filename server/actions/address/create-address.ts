'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createAddressSchema, type CreateAddressInput } from '@/lib/validators/address'

export async function createAddress(input: CreateAddressInput) {
  try {
    // Validate input
    const validatedData = createAddressSchema.parse(input)

    // Create Supabase client and validate user session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be logged in to create an address'
      }
    }

    // If setting as default, unset any existing default address
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }

    // Create the address
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        company: validatedData.company,
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2,
        city: validatedData.city,
        state: validatedData.state,
        postalCode: validatedData.postalCode,
        country: validatedData.country,
        phone: validatedData.phone,
        isDefault: validatedData.isDefault
      }
    })

    // Revalidate address pages
    revalidatePath('/address')
    revalidatePath('/checkout')
    
    return {
      success: true,
      data: address,
      message: 'Address created successfully'
    }

  } catch (error) {
    console.error('Create address error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: 'Invalid address data provided'
      }
    }

    return {
      success: false,
      error: 'Failed to create address. Please try again.'
    }
  }
}
