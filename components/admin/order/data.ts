export interface AdminOrderDetailItem {
  id: string
  productName: string
  productImage: string | null
  variant: string
  quantity: number
  price: number
}

export interface AdminOrderShippingAddress {
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export interface AdminOrderPaymentProof {
  id: string
  imageUrl: string
  status: string
  uploadedAt: string
}

export interface AdminOrderDetail {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  paymentStatus: string
  paymentMethod: string
  fulfillmentStatus: string
  items: AdminOrderDetailItem[]
  shippingAddress: AdminOrderShippingAddress
  subtotal: number
  shipping: number
  total: number
  paymentProof?: AdminOrderPaymentProof | null
  carrierName?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export function formatOrderDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch {
    return dateStr
  }
}