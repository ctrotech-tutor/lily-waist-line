import { useMemo } from 'react'
import { useCart } from './use-cart'
import { useWishlist } from './use-wishlist'

/**
 * Hook to check if a product is in the wishlist
 * Derived from the wishlist query data
 */
export function useProductWishlistStatus(productId: string) {
  const { data: wishlist } = useWishlist()

  const isWishlisted = useMemo(() => {
    if (!wishlist) return false
    return wishlist.some(item => item.product.id === productId)
  }, [wishlist, productId])

  return { isWishlisted }
}

/**
 * Hook to check if a variant is in the cart
 * Derived from the cart query data
 */
export function useProductCartStatus(variantId: string) {
  const { data: cart } = useCart()

  const inCart = useMemo(() => {
    if (!cart) return false
    return cart.items.some(item => item.variant.id === variantId)
  }, [cart, variantId])

  return { inCart }
}