import { useQuery } from '@tanstack/react-query'
import { getProductBySlug } from '@/server/actions/products'
import { productKeys } from '@/lib/react-query/query-keys'
import type { ProductWithDetails } from '@/lib/services'

/**
 * Hook for fetching a single product by slug
 * Provides automatic caching, refetching, and loading/error states
 */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.bySlug(slug),
    queryFn: async (): Promise<ProductWithDetails> => {
      const result = await getProductBySlug(slug)
      if (!result.success) throw new Error(result.error)
      if (!result.data) throw new Error('Product not found')
      return result.data
    },
    enabled: !!slug, // Only fetch if slug is provided
    staleTime: 1000 * 60 * 5, // 5 minutes - product data changes less frequently
    refetchOnWindowFocus: false, // Don't refetch on focus for product details
  })
}