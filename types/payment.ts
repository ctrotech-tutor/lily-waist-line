/**
 * Payment-related types
 */

import type { PaymentMethod } from '@/lib/generated/prisma/enums'

// Payment configuration
export interface PaymentConfig {
  paymentMethod: PaymentMethod
  enabled: boolean
  cashAppHandle?: string | null
  paypalEmail?: string | null
}