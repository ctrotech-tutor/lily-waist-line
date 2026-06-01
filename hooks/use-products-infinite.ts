import { useInfiniteQuery } from '@tanstack/react-query'
import { getProducts } from '@/server/actions/products'
import type { ProductQueryOptions } from '@/types/product'

/**
 * Hook to fetch products with infinite scroll using TanStack Query
 */
export function useProductsInfinite(options: ProductQueryOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['products', options.search, options.size, options.compression, options.availability, options.sort] as const,
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getProducts({
        ...options,
        offset: pageParam,
        limit: options.limit || 12,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined
      return allPages.length * (options.limit || 12)
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}