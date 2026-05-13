import { revalidatePath } from 'next/cache'
import { CachedProductService } from './product-cache'

/**
 * Simplified cache revalidation system
 * This handles cache invalidation across all entity types using path-based revalidation
 */
export class CacheRevalidator {
  /**
   * Revalidate all product-related caches
   */
  static revalidateProducts(options?: {
    slug?: string
    isFeatured?: boolean
    affectsFilters?: boolean
  }) {
    const { slug, isFeatured } = options || {}
    
    // Revalidate shop pages
    revalidatePath('/shop')
    
    // Revalidate specific product if slug provided
    if (slug) {
      revalidatePath(`/product/${slug}`)
    }
    
    // Revalidate homepage if this affects featured products
    if (isFeatured) {
      revalidatePath('/')
    }
    
    // Use the product cache revalidator for comprehensive invalidation
    CachedProductService.revalidate.revalidateAll()
  }

  /**
   * Revalidate cart caches for a specific user
   */
  static revalidateCart() {
    revalidatePath('/cart')
    // Also revalidate pages that show cart count
    revalidatePath('/')
    revalidatePath('/shop')
  }

  /**
   * Revalidate order caches
   */
  static revalidateOrders(options?: {
    orderId?: string
    isAdmin?: boolean
  }) {
    const { orderId, isAdmin } = options || {}
    
    // Revalidate orders page
    revalidatePath('/orders')
    
    // Revalidate specific order if provided
    if (orderId) {
      revalidatePath(`/orders/${orderId}`)
    }
    
    // Revalidate admin orders if this is an admin operation
    if (isAdmin) {
      revalidatePath('/admin/orders')
      revalidatePath('/admin')
    }
  }

  /**
   * Revalidate wishlist caches
   */
  static revalidateWishlist() {
    revalidatePath('/wishlist')
  }

  /**
   * Revalidate user address caches
   */
  static revalidateUserAddresses() {
    revalidatePath('/address')
  }

  /**
   * Revalidate admin dashboard caches
   */
  static revalidateAdminDashboard() {
    revalidatePath('/admin')
    revalidatePath('/admin/orders')
    revalidatePath('/admin/customers')
    revalidatePath('/admin/products')
  }

  /**
   * Comprehensive revalidation for product updates
   */
  static revalidateAfterProductUpdate(productData: {
    slug: string
    status: string
    isFeatured?: boolean
    affectsInventory?: boolean
  }) {
    const { slug, status, isFeatured } = productData
    
    // Revalidate product caches
    this.revalidateProducts({
      slug,
      isFeatured,
      affectsFilters: true
    })
    
    // If product became active/inactive, revalidate homepage
    if (status === 'ACTIVE' || status === 'ARCHIVED') {
      revalidatePath('/')
    }
  }

  /**
   * Comprehensive revalidation for order creation/updates
   */
  static revalidateAfterOrderUpdate(orderData: {
    userId: string
    orderId: string
    paymentStatus?: string
    fulfillmentStatus?: string
    isAdmin?: boolean
  }) {
    const { orderId, isAdmin } = orderData
    
    // Revalidate orders
    this.revalidateOrders({
      orderId,
      isAdmin
    })
    
    // Revalidate cart since order creation affects cart
    this.revalidateCart()
    
    // Revalidate admin dashboard if status changed
    if (orderData.paymentStatus || orderData.fulfillmentStatus) {
      this.revalidateAdminDashboard()
    }
  }

  /**
   * Revalidate after cart operations
   */
  static revalidateAfterCartUpdate() {
    this.revalidateCart()
  }

  /**
   * Revalidate after wishlist operations
   */
  static revalidateAfterWishlistUpdate() {
    this.revalidateWishlist()
  }

  /**
   * Emergency revalidation - clear all caches
   */
  static revalidateAll() {
    // Revalidate all major paths
    revalidatePath('/')
    revalidatePath('/shop')
    revalidatePath('/cart')
    revalidatePath('/orders')
    revalidatePath('/wishlist')
    revalidatePath('/address')
    revalidatePath('/admin')
    
    // Use product cache revalidator as well
    CachedProductService.revalidate.revalidateAll()
  }
}

/**
 * Hook for automatic cache revalidation in server actions
 * This should be called after any data mutation
 */
export const revalidateCache = {
  product: CacheRevalidator.revalidateAfterProductUpdate,
  order: CacheRevalidator.revalidateAfterOrderUpdate,
  cart: CacheRevalidator.revalidateAfterCartUpdate,
  wishlist: CacheRevalidator.revalidateAfterWishlistUpdate,
  addresses: CacheRevalidator.revalidateUserAddresses,
  admin: CacheRevalidator.revalidateAdminDashboard,
  all: CacheRevalidator.revalidateAll,
}
