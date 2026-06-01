import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/server/actions/products'
import { productsKeys } from '@/lib/react-query/query-keys'
import type { ProductQueryOptions } from '@/types/product'
import type { ProductResult } from '@/lib/services/product-service'

/**
 * Hook for fetching products with filtering and pagination
 * Provides automatic caching, refetching, and loading/error states
 */
export function useProducts(options: ProductQueryOptions = {}) {
  return useQuery({
    queryKey: productsKeys.list(options as Record<string, unknown>),
    queryFn: async (): Promise<ProductResult> => {
      const result = await getProducts(options)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 60, // 1 minute - product list data
    refetchOnWindowFocus: false, // Don't refetch on focus for product lists
  })
}