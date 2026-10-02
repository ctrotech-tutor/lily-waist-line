import { useQuery } from '@tanstack/react-query'
import { getAllOrders } from '@/server/actions/admin/orders'
import { adminKeys } from '@/lib/react-query/query-keys'

export function useAdminShipping(filters: {
  page?: number
  search?: string
  fulfillmentStatus?: string
} = {}) {
  const params = {
    page: filters.page ?? 1,
    limit: 50,
    search: filters.search || undefined,
    fulfillmentStatus: (filters.fulfillmentStatus || undefined) as 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | undefined,
  }

  return useQuery({
    queryKey: adminKeys.shipping.list(params as Record<string, unknown>),
    queryFn: async () => {
      const result = await getAllOrders(params)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 30,
  })
}