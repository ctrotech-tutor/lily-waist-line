/**
 * Checkout-related types
 */

import type { PaymentMethod as PrismaPaymentMethod } from '@/lib/generated/prisma/enums'

// Re-export PaymentMethod from Prisma for type safety
export type PaymentMethod = PrismaPaymentMethod

// UI-friendly payment method display values (for backward compatibility)
export type UIPaymentMethod = 'cashapp' | 'paypal'

// Mapping between UI and Prisma payment methods
export const PAYMENT_METHOD_MAP: Record<UIPaymentMethod, PaymentMethod> = {
  cashapp: 'CASH_APP',
  paypal: 'PAYPAL'
} as const

export const REVERSE_PAYMENT_METHOD_MAP: Record<PaymentMethod, UIPaymentMethod> = {
  CASH_APP: 'cashapp',
  PAYPAL: 'paypal'
} as const

// Helper function to convert UI payment method to Prisma payment method
export function toPrismaPaymentMethod(uiMethod: UIPaymentMethod): PaymentMethod {
  return PAYMENT_METHOD_MAP[uiMethod]
}

// Helper function to convert Prisma payment method to UI payment method
export function toUIPaymentMethod(prismaMethod: PaymentMethod): UIPaymentMethod {
  return REVERSE_PAYMENT_METHOD_MAP[prismaMethod]
}