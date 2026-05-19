'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { PaymentMethod } from '@/lib/generated/prisma/enums'

// Validation schema for payment configuration update
const updatePaymentConfigSchema = z.object({
  paymentMethod: z.enum(['CASH_APP', 'PAYPAL']),
  enabled: z.boolean(),
  cashAppHandle: z.string().optional(),
  paypalEmail: z.string().email().optional()
})

export interface UpdatePaymentConfigInput {
  paymentMethod: PaymentMethod
  enabled: boolean
  cashAppHandle?: string
  paypalEmail?: string
}

/**
 * Admin action to update payment configuration
 */
export async function updatePaymentConfiguration(input: UpdatePaymentConfigInput): Promise<{
  success: boolean
  data?: any
  error?: string
}> {
  try {
    // Validate input
    const validatedData = updatePaymentConfigSchema.parse(input)

    // Create Supabase client and validate admin session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Get user role from database
    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || userData.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Access denied. Admin access required.'
      }
    }

    // Validate payment method specific fields
    if (validatedData.paymentMethod === 'CASH_APP') {
      if (validatedData.enabled && !validatedData.cashAppHandle) {
        return {
          success: false,
          error: 'Cash App handle is required when Cash App is enabled'
        }
      }
      // Validate Cash App handle format (should start with $)
      if (validatedData.cashAppHandle && !validatedData.cashAppHandle.startsWith('$')) {
        return {
          success: false,
          error: 'Cash App handle must start with $'
        }
      }
    }

    if (validatedData.paymentMethod === 'PAYPAL') {
      if (validatedData.enabled && !validatedData.paypalEmail) {
        return {
          success: false,
          error: 'PayPal email is required when PayPal is enabled'
        }
      }
    }

    // Update or create payment configuration
    const configuration = await prisma.paymentConfiguration.upsert({
      where: {
        paymentMethod: validatedData.paymentMethod
      },
      update: {
        enabled: validatedData.enabled,
        cashAppHandle: validatedData.paymentMethod === 'CASH_APP' ? validatedData.cashAppHandle : null,
        paypalEmail: validatedData.paymentMethod === 'PAYPAL' ? validatedData.paypalEmail : null,
        updatedAt: new Date()
      },
      create: {
        paymentMethod: validatedData.paymentMethod,
        enabled: validatedData.enabled,
        cashAppHandle: validatedData.paymentMethod === 'CASH_APP' ? validatedData.cashAppHandle : null,
        paypalEmail: validatedData.paymentMethod === 'PAYPAL' ? validatedData.paypalEmail : null
      }
    })

    // Revalidate admin settings page
    revalidatePath('/admin/settings')

    return {
      success: true,
      data: configuration
    }
  } catch (error) {
    console.error('Error updating payment configuration:', error)
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message
      }
    }

    return {
      success: false,
      error: 'Failed to update payment configuration'
    }
  }
}
