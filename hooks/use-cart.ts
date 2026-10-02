import { useQuery } from '@tanstack/react-query'
import { getCart } from '@/server/actions/cart'
import { cartKeys } from '@/lib/react-query/query-keys'

/**
 * Hook for fetching cart data
 * Provides automatic caching, refetching, and loading/error states
 */
export function useCart() {
  return useQuery({
    queryKey: cartKeys.base(),
    queryFn: async () => {
      const result = await getCart()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch cart')
      }
      return result.data
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  })
}