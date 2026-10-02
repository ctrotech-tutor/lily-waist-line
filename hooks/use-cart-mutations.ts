import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addToCart, updateCartQuantity, removeFromCart } from '@/server/actions/cart'
import { cartKeys } from '@/lib/react-query/query-keys'

/**
 * Hook for adding item to cart
 * Automatically invalidates cart query on success
 */
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      const result = await addToCart({ variantId, quantity })
      if (!result.success) {
        throw new Error(result.error || 'Failed to add to cart')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.base() })
      toast.success('Added to cart', {
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart',
        },
      })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart')
    },
  })
}

/**
 * Hook for updating cart item quantity
 * Automatically invalidates cart query on success
 */
export function useUpdateQuantity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      const result = await updateCartQuantity({ cartItemId, quantity })
      if (!result.success) {
        throw new Error(result.error || 'Failed to update quantity')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.base() })
      toast.success('Cart updated')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update quantity')
    },
  })
}

/**
 * Hook for removing item from cart
 * Automatically invalidates cart query on success
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ cartItemId }: { cartItemId: string }) => {
      const result = await removeFromCart({ cartItemId })
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove from cart')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.base() })
      toast.success('Removed from cart')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to remove from cart')
    },
  })
}