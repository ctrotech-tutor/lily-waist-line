import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics } from '@/server/actions/admin/dashboard/get-dashboard-metrics'
import { adminKeys } from '@/lib/react-query/query-keys'

export interface DashboardRecentOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  amount: number
  paymentStatus: string
  fulfillmentStatus: string
  date: string
}

export interface DashboardMetrics {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  shippedOrders: number
  recentOrders: DashboardRecentOrder[]
  alerts: {
    paymentConfirmations: number
    lowStock: number
    unshippedOrders: number
  }
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => {
      const result = await getDashboardMetrics()
      if (!result.success) throw new Error(result.error)
      return result.data as DashboardMetrics
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}