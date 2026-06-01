import type { ProductWithDetails } from '@/lib/services'
import type { ProductCardProps } from '@/components/store/product-card'
import type { StockState } from '@/types/common'

/**
 * Calculate stock state from product data
 * Used consistently across wishlist, product grid, and other components
 */
export function calculateStockState(product: ProductWithDetails): StockState {
  if (!product.inStock) {
    return 'out-of-stock'
  }
  if (product.variants.some(v => v.stockQuantity > 0 && v.stockQuantity <= 5)) {
    return 'low-stock'
  }
  return 'in-stock'
}

/**
 * Transform a single product from database format to card props
 * Used for product cards in shop, wishlist, and related products
 */
export function transformProductToCardProps(product: ProductWithDetails): ProductCardProps {
  const stockState = calculateStockState(product)
  const firstVariant = product.variants[0]

  return {
    id: product.id,
    variantId: firstVariant?.id || product.id,
    slug: product.slug,
    image: product.images[0]?.url || '/placeholder-product.jpg',
    name: product.name,
    subtitle: product.shortDescription,
    price: parseFloat(product.minPrice.toString()),
    originalPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : undefined,
    badge: product.totalStock > 10 ? undefined : 'Limited',
    stockState,
    isWishlisted: false, // This would come from user-specific data
  }
}

/**
 * Transform multiple products from database format to card props
 * Used for product grids and lists
 */
export function transformProductsToCardProps(products: ProductWithDetails[]): ProductCardProps[] {
  return products.map(transformProductToCardProps)
}