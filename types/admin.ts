/**
 * Admin-related types
 */

// Admin order filters (domain type)
export interface AdminOrderFilters {
  page?: number
  limit?: number
  search?: string
  paymentStatus?: 'PENDING' | 'PAID' | 'REJECTED'
  fulfillmentStatus?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

// Admin customer filters (domain type)
export interface AdminCustomerFilters {
  page?: number
  limit?: number
  search?: string
}

// Admin dashboard metrics (domain type)
export interface AdminDashboardMetrics {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
}