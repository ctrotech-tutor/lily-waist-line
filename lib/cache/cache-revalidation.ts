import { revalidatePath } from 'next/cache'
import { CachedProductService } from './product-cache'
import { ROUTES } from '@/lib/constants/routes'

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
    revalidatePath(ROUTES.SHOP)
    
    // Revalidate specific product if slug provided
    if (slug) {
      revalidatePath(`/product/${slug}`)
    }
    
    // Revalidate homepage if this affects featured products
    if (isFeatured) {
      revalidatePath(ROUTES.HOME)
    }
    
    // Use the product cache revalidator for comprehensive invalidation
    CachedProductService.revalidate.revalidateAll()
  }

  /**
   * Revalidate cart caches for a specific user
   */
  static revalidateCart() {
    revalidatePath(ROUTES.CART)
    // Also revalidate pages that show cart count
    revalidatePath(ROUTES.HOME)
    revalidatePath(ROUTES.SHOP)
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
    revalidatePath(ROUTES.ORDERS)
    
    // Revalidate specific order if provided
    if (orderId) {
      revalidatePath(`/orders/${orderId}`)
    }
    
    // Revalidate admin orders if this is an admin operation
    if (isAdmin) {
      revalidatePath(ROUTES.ADMIN_ORDERS)
      revalidatePath(ROUTES.ADMIN)
    }
  }

  /**
   * Revalidate wishlist caches
   */
  static revalidateWishlist() {
    revalidatePath(ROUTES.WISHLIST)
  }

  /**
   * Revalidate user address caches
   */
  static revalidateUserAddresses() {
    revalidatePath(ROUTES.ADDRESS)
  }

  /**
   * Revalidate admin dashboard caches
   */
  static revalidateAdminDashboard() {
    revalidatePath(ROUTES.ADMIN)
    revalidatePath(ROUTES.ADMIN_ORDERS)
    revalidatePath(ROUTES.ADMIN_CUSTOMERS)
    revalidatePath(ROUTES.ADMIN_PRODUCTS)
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
      revalidatePath(ROUTES.HOME)
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
    revalidatePath(ROUTES.HOME)
    revalidatePath(ROUTES.SHOP)
    revalidatePath(ROUTES.CART)
    revalidatePath(ROUTES.ORDERS)
    revalidatePath(ROUTES.WISHLIST)
    revalidatePath(ROUTES.ADDRESS)
    revalidatePath(ROUTES.ADMIN)
    
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
