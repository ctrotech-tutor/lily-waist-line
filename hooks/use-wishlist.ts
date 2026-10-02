import { useQuery } from '@tanstack/react-query'
import { getWishlist } from '@/server/actions/wishlist'
import { wishlistKeys } from '@/lib/react-query/query-keys'

/**
 * Hook for fetching wishlist data
 * Provides automatic caching, refetching, and loading/error states
 */
export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.base(),
    queryFn: async () => {
      const result = await getWishlist()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch wishlist')
      }
      return result.data
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  })
}