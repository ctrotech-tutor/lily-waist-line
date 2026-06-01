'use server'

import prisma from '@/lib/prisma'
import type { PaymentConfig } from '@/types/payment'

export async function getPaymentConfiguration(): Promise<{
  success: boolean
  data?: PaymentConfig[]
  error?: string
}> {
  try {
    const configs = await prisma.paymentConfiguration.findMany()

    const data: PaymentConfig[] = configs.map((c) => ({
      paymentMethod: c.paymentMethod as PaymentConfig['paymentMethod'],
      enabled: c.enabled,
      cashAppHandle: c.cashAppHandle,
      paypalEmail: c.paypalEmail,
    }))

    return { success: true, data }
  } catch (error) {
    console.error('Error fetching payment configuration:', error)
    return { success: false, error: 'Failed to load payment configuration' }
  }
}