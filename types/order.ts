/**
 * Order-related types
 */

import type { PaymentStatus, FulfillmentStatus } from '@/lib/generated/prisma/enums'

// Order data structure used in order cards and lists
export interface OrderData {
  id: string
  orderNumber: string
  orderDate: string
  total: number
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  itemCount: number
  previewItem?: {
    product: {
      name: string
      slug: string
      image: { url: string } | null
    }
  } | null
  trackingInfo?: {
    carrier: string
    trackingNumber: string | null
    shippedAt: Date | null
    deliveredAt: Date | null
  } | null
}

// Order item data structure
export interface OrderItemData {
  id: string
  productName: string
  productImage: string | null
  size: string
  compression: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// Shipping timeline steps
export type ShippingStep =
  | 'label_created'
  | 'package_received'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'

// Shipment status types
export type ShipmentStatus =
  | 'label_created'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception'

// Shipment update structure
export interface ShipmentUpdate {
  id: string
  date: string
  time?: string
  message: string
  location?: string
  status: 'completed' | 'current' | 'pending'
}