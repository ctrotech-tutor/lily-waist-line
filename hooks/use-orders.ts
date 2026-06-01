import { useQuery } from '@tanstack/react-query'
import { getUserOrders, getOrderDetails } from '@/server/actions/orders'
import { orderKeys } from '@/lib/react-query/query-keys'

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: async () => {
      const result = await getUserOrders()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch orders')
      }
      return result.data
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      const result = await getOrderDetails(orderId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch order')
      }
      return result.data
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    enabled: !!orderId,
  })
}