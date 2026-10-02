import { useQuery } from '@tanstack/react-query'
import { getFeaturedProducts } from '@/server/actions/products'
import { featuredProductsKeys } from '@/lib/react-query/query-keys'
import type { ProductWithDetails } from '@/lib/services'

/**
 * Hook to fetch featured products using TanStack Query
 */
export function useFeaturedProducts(limit: number = 8) {
  return useQuery<ProductWithDetails[]>({
    queryKey: featuredProductsKeys.list(limit),
    queryFn: async () => {
      const result = await getFeaturedProducts(limit)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}