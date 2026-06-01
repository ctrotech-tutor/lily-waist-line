export type ShippingFulfillmentStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED'

export interface AdminShippingRow {
  id: string
  customerName: string
  customerEmail: string
  fulfillmentStatus: ShippingFulfillmentStatus
  carrier: string | null
  trackingNumber: string | null
  orderDate: string
  shippedDate: string | null
  deliveredDate: string | null
  itemCount: number
  total: number
}

export interface AdminShippingFilters {
  page?: number
  search?: string
  fulfillmentStatus?: ShippingFulfillmentStatus
}

export interface ShippingStats {
  processing: number
  shipped: number
  delivered: number
}

export function formatShippingDate(date: Date | string | null | undefined): string | null {
  if (!date) return null
  if (typeof date === 'string') return date.split('T')[0]
  return date.toISOString().split('T')[0]
}

export function computeShippingStats(rows: AdminShippingRow[]): ShippingStats {
  return {
    processing: rows.filter((r) => r.fulfillmentStatus === 'PROCESSING').length,
    shipped: rows.filter((r) => r.fulfillmentStatus === 'SHIPPED').length,
    delivered: rows.filter((r) => r.fulfillmentStatus === 'DELIVERED').length,
  }
}