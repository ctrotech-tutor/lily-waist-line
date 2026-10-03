'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { PaymentConfig } from '@/types/payment'

const updatePaymentConfigsSchema = z.object({
  cashAppEnabled: z.boolean(),
  cashAppHandle: z.string().trim().regex(/^\$[A-Za-z0-9_]{1,30}$/).or(z.literal('')).optional(),
  paypalEnabled: z.boolean(),
  paypalEmail: z.string().trim().email().or(z.literal('')).optional(),
  paypalHandle: z.string().trim().regex(/^[A-Za-z0-9._-]{1,50}$/).or(z.literal('')).optional(),
})

export interface UpdatePaymentConfigsInput {
  cashAppEnabled: boolean
  cashAppHandle?: string
  paypalEnabled: boolean
  paypalEmail?: string
  paypalHandle?: string
}

export async function updatePaymentConfigurations(input: UpdatePaymentConfigsInput): Promise<{
  success: boolean
  data?: PaymentConfig[]
  error?: string
}> {
  try {
    const validatedData = updatePaymentConfigsSchema.parse(input)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false, error: 'Access denied. Admin access required.' }
    }

    if (validatedData.cashAppEnabled && !validatedData.cashAppHandle) {
      return { success: false, error: 'Cash App handle is required when Cash App is enabled' }
    }

    if (validatedData.paypalEnabled && !validatedData.paypalEmail && !validatedData.paypalHandle) {
      return { success: false, error: 'PayPal email or handle is required when PayPal is enabled' }
    }

    const [cashAppConfig, paypalConfig] = await prisma.$transaction([
      prisma.paymentConfiguration.upsert({
        where: { paymentMethod: 'CASH_APP' },
        update: {
          enabled: validatedData.cashAppEnabled,
          cashAppHandle: validatedData.cashAppEnabled ? validatedData.cashAppHandle : null,
          paypalEmail: null,
          paypalHandle: null,
          updatedAt: new Date(),
        },
        create: {
          paymentMethod: 'CASH_APP',
          enabled: validatedData.cashAppEnabled,
          cashAppHandle: validatedData.cashAppEnabled ? validatedData.cashAppHandle : null,
        },
      }),
      prisma.paymentConfiguration.upsert({
        where: { paymentMethod: 'PAYPAL' },
        update: {
          enabled: validatedData.paypalEnabled,
          paypalEmail: validatedData.paypalEnabled ? validatedData.paypalEmail : null,
          paypalHandle: validatedData.paypalEnabled ? validatedData.paypalHandle : null,
          cashAppHandle: null,
          updatedAt: new Date(),
        },
        create: {
          paymentMethod: 'PAYPAL',
          enabled: validatedData.paypalEnabled,
          paypalEmail: validatedData.paypalEnabled ? validatedData.paypalEmail : null,
          paypalHandle: validatedData.paypalEnabled ? validatedData.paypalHandle : null,
        },
      }),
    ])

    revalidatePath('/admin/settings')

    return { success: true, data: [cashAppConfig, paypalConfig] }
  } catch (error) {
    console.error('Error updating payment configuration:', error)

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }

    return { success: false, error: 'Failed to update payment configuration' }
  }
}
