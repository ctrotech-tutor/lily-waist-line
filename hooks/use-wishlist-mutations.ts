import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addToWishlist, removeFromWishlist } from '@/server/actions/wishlist'
import { wishlistKeys } from '@/lib/react-query/query-keys'

/**
 * Hook for adding product to wishlist
 * Automatically invalidates wishlist query on success
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const result = await addToWishlist(productId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to add to wishlist')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.base() })
      toast.success("Added to wishlist")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add to wishlist')
    },
  })
}

/**
 * Hook for removing product from wishlist
 * Automatically invalidates wishlist query on success
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const result = await removeFromWishlist(productId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove from wishlist')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.base() })
      toast.success("Removed from wishlist")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to remove from wishlist')
    },
  })
}