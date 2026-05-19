'use server'

import prisma from '@/lib/prisma'
import type { PaymentMethod } from '@/lib/generated/prisma/enums'

export interface PaymentConfig {
  paymentMethod: PaymentMethod
  enabled: boolean
  cashAppHandle?: string | null
  paypalEmail?: string | null
}

/**
 * Get payment configuration for all enabled payment methods
 */
export async function getPaymentConfiguration(): Promise<{
  success: boolean
  data?: PaymentConfig[]
  error?: string
}> {
  try {
    const configurations = await prisma.paymentConfiguration.findMany({
      where: {
        enabled: true
      },
      select: {
        paymentMethod: true,
        enabled: true,
        cashAppHandle: true,
        paypalEmail: true
      },
      orderBy: {
        paymentMethod: 'asc'
      }
    })

    return {
      success: true,
      data: configurations
    }
  } catch (error) {
    console.error('Error fetching payment configuration:', error)
    return {
      success: false,
      error: 'Failed to fetch payment configuration'
    }
  }
}

/**
 * Get payment configuration for a specific payment method
 */
export async function getPaymentConfigByMethod(paymentMethod: PaymentMethod): Promise<{
  success: boolean
  data?: PaymentConfig
  error?: string
}> {
  try {
    const configuration = await prisma.paymentConfiguration.findUnique({
      where: {
        paymentMethod
      },
      select: {
        paymentMethod: true,
        enabled: true,
        cashAppHandle: true,
        paypalEmail: true
      }
    })

    if (!configuration) {
      return {
        success: false,
        error: 'Payment configuration not found'
      }
    }

    return {
      success: true,
      data: configuration
    }
  } catch (error) {
    console.error('Error fetching payment configuration:', error)
    return {
      success: false,
      error: 'Failed to fetch payment configuration'
    }
  }
}
