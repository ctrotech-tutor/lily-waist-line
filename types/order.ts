import type {
  PaymentStatus as PrismaPaymentStatus,
  FulfillmentStatus as PrismaFulfillmentStatus,
  PaymentProofStatus as PrismaPaymentProofStatus,
  PaymentMethod as PrismaPaymentMethod,
} from '@/lib/generated/prisma/enums'

// ---------------------------------------------------------------------------
// UI status types (lowercase, used by components)
// ---------------------------------------------------------------------------

export type PaymentStatusUI = 'pending' | 'paid' | 'failed'

export type FulfillmentStatusUI =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type ShipmentStatusUI =
  | 'label_created'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception'

export type ShippingStepUI =
  | 'label_created'
  | 'package_received'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'

// ---------------------------------------------------------------------------
// Mapping helpers – backend (UPPERCASE) → UI (lowercase)
// ---------------------------------------------------------------------------

export function mapPaymentStatus(status: PrismaPaymentStatus): PaymentStatusUI {
  const map: Record<PrismaPaymentStatus, PaymentStatusUI> = {
    PENDING: 'pending',
    PAID: 'paid',
    REJECTED: 'failed',
  }
  return map[status]
}

export function mapFulfillmentStatus(status: PrismaFulfillmentStatus): FulfillmentStatusUI {
  const map: Record<PrismaFulfillmentStatus, FulfillmentStatusUI> = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  }
  return map[status]
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

export function formatOrderDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Shipment status derivation (Phase 1 – manual shipping)
// ---------------------------------------------------------------------------

export function deriveShipmentStatus(
  fulfillmentStatus: PrismaFulfillmentStatus,
  shipment: { shippedAt: Date | null; deliveredAt: Date | null } | null,
): ShipmentStatusUI {
  if (fulfillmentStatus === 'DELIVERED' || shipment?.deliveredAt) {
    return 'delivered'
  }
  if (fulfillmentStatus === 'SHIPPED' && shipment?.shippedAt) {
    return 'in_transit'
  }
  return 'label_created'
}

export function deriveShippingStep(
  fulfillmentStatus: PrismaFulfillmentStatus,
  shipment: { shippedAt: Date | null; deliveredAt: Date | null } | null,
): ShippingStepUI {
  if (fulfillmentStatus === 'DELIVERED' || shipment?.deliveredAt) {
    return 'delivered'
  }
  if (fulfillmentStatus === 'SHIPPED' && shipment?.shippedAt) {
    return 'in_transit'
  }
  return 'label_created'
}

// ---------------------------------------------------------------------------
// Carrier URL helper
// ---------------------------------------------------------------------------

const CARRIER_TRACKING_URLS: Record<string, string> = {
  usps: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
  ups: 'https://www.ups.com/track?loc=en_US&tracknum=',
  fedex: 'https://www.fedex.com/fedextrack/?trknbr=',
  dhl: 'https://www.dhl.com/en/express/tracking.html?AWB=',
}

export function getCarrierTrackingUrl(carrier: string, trackingNumber: string | null): string {
  if (!trackingNumber) return '#'
  const key = carrier.toLowerCase().replace(/\s+/g, '')
  const baseUrl = CARRIER_TRACKING_URLS[key]
  if (baseUrl) return `${baseUrl}${trackingNumber}`
  return '#'
}

// ---------------------------------------------------------------------------
// Transformed types matching server action outputs
// ---------------------------------------------------------------------------

export interface OrderListItem {
  id: string
  orderNumber: string
  orderDate: string
  total: number
  paymentStatus: PaymentStatusUI
  fulfillmentStatus: FulfillmentStatusUI
  itemCount: number
  paymentProofStatus: string | null
  hasPendingPaymentProof: boolean
  trackingInfo: {
    carrier: string
    trackingNumber: string | null
    shippedAt: Date | null
    deliveredAt: Date | null
  } | null
  previewItem: {
    id: string
    quantity: number
    unitPrice: number
    product: {
      id: string
      name: string
      slug: string
      image: { url: string; altText: string | null } | null
    }
    variant: {
      size: string
      compressionLevel: string
      color: string | null
    }
  } | null
}

export interface OrderDetailData {
  id: string
  orderNumber: string
  createdAt: Date
  updatedAt: Date
  subtotal: number
  shippingFee: number
  total: number
  paymentMethod: PrismaPaymentMethod
  paymentStatus: PaymentStatusUI
  fulfillmentStatus: FulfillmentStatusUI
  shippingAddress: {
    id: string
    firstName: string
    lastName: string
    company: string | null
    addressLine1: string
    addressLine2: string | null
    city: string
    state: string
    postalCode: string
    country: string
    phone: string | null
  }
  items: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    product: {
      id: string
      name: string
      slug: string
      image: { url: string; altText: string | null } | null
    }
    variant: {
      id: string
      size: string
      compressionLevel: string
      color: string | null
      sku: string
    }
  }>
  paymentProofs: Array<{
    id: string
    status: PrismaPaymentProofStatus
    uploadedAt: Date
    imageUrl: string
  }>
  shipments: Array<{
    id: string
    carrier: string
    trackingNumber: string | null
    shippedAt: Date | null
    deliveredAt: Date | null
  }>
  itemCount: number
  hasPendingPaymentProof: boolean
  hasVerifiedPaymentProof: boolean
  hasShipped: boolean
  isDelivered: boolean
  latestShipment: {
    id: string
    carrier: string
    trackingNumber: string | null
    shippedAt: Date | null
    deliveredAt: Date | null
  } | null
  latestPaymentProof: {
    id: string
    status: PrismaPaymentProofStatus
    uploadedAt: Date
    imageUrl: string
  } | null
}

export interface OrdersPagination {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
