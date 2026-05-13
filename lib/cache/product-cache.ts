import { unstable_cache } from 'next/cache'
import { ProductService, ProductQueryOptions, ProductResult } from '@/lib/services/product-service'
import { revalidatePath, revalidateTag } from 'next/cache'

// Export types for use in other modules
export type { ProductQueryOptions, ProductResult }

// Cache tags for revalidation
export const PRODUCT_CACHE_TAGS = {
  ALL: 'products',
  ACTIVE: 'products:active',
  FEATURED: 'products:featured',
  BY_SLUG: (slug: string) => `product:${slug}`,
  BY_CATEGORY: (category: string) => `products:category:${category}`,
  BY_SIZE: (size: string) => `products:size:${size}`,
  BY_COMPRESSION: (compression: string) => `products:compression:${compression}`,
  SEARCH: (query: string) => `products:search:${query}`,
  AVAILABLE_SIZES: 'products:available-sizes',
  AVAILABLE_COMPRESSIONS: 'products:available-compressions',
} as const

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  SHORT: 60,        // 1 minute - for dynamic data
  MEDIUM: 300,      // 5 minutes - for semi-static data
  LONG: 3600,       // 1 hour - for static data
  VERY_LONG: 86400, // 24 hours - for very static data
} as const

/**
 * Cached wrapper for ProductService.getProducts
 * Uses Next.js unstable_cache with proper tags for revalidation
 */
export const getCachedProducts = unstable_cache(
  async (options: ProductQueryOptions = {}): Promise<ProductResult> => {
    return await ProductService.getProducts(options)
  },
  ['get-products'],
  {
    tags: [PRODUCT_CACHE_TAGS.ACTIVE],
    revalidate: CACHE_DURATIONS.MEDIUM,
  }
)

/**
 * Cached wrapper for ProductService.getProductBySlug
 * Longer cache duration since individual products change less frequently
 */
export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    return await ProductService.getProductBySlug(slug)
  },
  ['get-product-by-slug'],
  {
    tags: [PRODUCT_CACHE_TAGS.ACTIVE],
    revalidate: CACHE_DURATIONS.LONG,
  }
)

/**
 * Cached wrapper for ProductService.getFeaturedProducts
 * Featured products are relatively stable, can be cached longer
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (limit: number = 8) => {
    return await ProductService.getFeaturedProducts(limit)
  },
  ['get-featured-products'],
  {
    tags: [PRODUCT_CACHE_TAGS.FEATURED, PRODUCT_CACHE_TAGS.ACTIVE],
    revalidate: CACHE_DURATIONS.LONG,
  }
)

/**
 * Cached wrapper for ProductService.getProductSuggestions
 * Short cache duration since search suggestions are dynamic
 */
export const getCachedProductSuggestions = unstable_cache(
  async (query: string, limit: number = 5) => {
    return await ProductService.getProductSuggestions(query, limit)
  },
  ['get-product-suggestions'],
  {
    tags: [PRODUCT_CACHE_TAGS.SEARCH('')],
    revalidate: CACHE_DURATIONS.SHORT,
  }
)

/**
 * Cached wrapper for ProductService.getAvailableSizes
 * Sizes are very static, can be cached for a long time
 */
export const getCachedAvailableSizes = unstable_cache(
  async () => {
    return await ProductService.getAvailableSizes()
  },
  ['get-available-sizes'],
  {
    tags: [PRODUCT_CACHE_TAGS.AVAILABLE_SIZES],
    revalidate: CACHE_DURATIONS.VERY_LONG,
  }
)

/**
 * Cached wrapper for ProductService.getAvailableCompressionLevels
 * Compression levels are very static, can be cached for a long time
 */
export const getCachedAvailableCompressionLevels = unstable_cache(
  async () => {
    return await ProductService.getAvailableCompressionLevels()
  },
  ['get-available-compression-levels'],
  {
    tags: [PRODUCT_CACHE_TAGS.AVAILABLE_COMPRESSIONS],
    revalidate: CACHE_DURATIONS.VERY_LONG,
  }
)

/**
 * Cache revalidation utilities
 */
export const ProductCacheRevalidator = {
  /**
   * Revalidate all product caches
   */
  revalidateAll: () => {
    revalidateTag(PRODUCT_CACHE_TAGS.ALL, 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.ACTIVE, 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.FEATURED, 'force')
    revalidatePath('/shop')
    revalidatePath('/')
  },

  /**
   * Revalidate a specific product by slug
   */
  revalidateProduct: (slug: string) => {
    revalidateTag(PRODUCT_CACHE_TAGS.BY_SLUG(slug), 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.ACTIVE, 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.ALL, 'force')
    revalidatePath(`/product/${slug}`)
  },

  /**
   * Revalidate featured products
   */
  revalidateFeatured: () => {
    revalidateTag(PRODUCT_CACHE_TAGS.FEATURED, 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.ACTIVE, 'force')
    revalidatePath('/')
    revalidatePath('/shop')
  },

  /**
   * Revalidate available sizes and compression levels
   */
  revalidateFilters: () => {
    revalidateTag(PRODUCT_CACHE_TAGS.AVAILABLE_SIZES, 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.AVAILABLE_COMPRESSIONS, 'force')
    revalidatePath('/shop')
  },

  /**
   * Revalidate search results
   */
  revalidateSearch: (query: string) => {
    revalidateTag(PRODUCT_CACHE_TAGS.SEARCH(query), 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.ACTIVE, 'force')
    revalidatePath('/shop')
  },

  /**
   * Revalidate products by size
   */
  revalidateBySize: (size: string) => {
    revalidateTag(PRODUCT_CACHE_TAGS.BY_SIZE(size), 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.ACTIVE, 'force')
    revalidatePath('/shop')
  },

  /**
   * Revalidate products by compression level
   */
  revalidateByCompression: (compression: string) => {
    revalidateTag(PRODUCT_CACHE_TAGS.BY_COMPRESSION(compression), 'force')
    revalidateTag(PRODUCT_CACHE_TAGS.ACTIVE, 'force')
    revalidatePath('/shop')
  },
}

/**
 * Enhanced product service with caching
 * This is the main interface that should be used throughout the application
 */
export const CachedProductService = {
  /**
   * Get products with caching
   */
  getProducts: getCachedProducts,

  /**
   * Get a single product by slug with caching
   */
  getProductBySlug: getCachedProductBySlug,

  /**
   * Get featured products with caching
   */
  getFeaturedProducts: getCachedFeaturedProducts,

  /**
   * Get product suggestions with caching
   */
  getProductSuggestions: getCachedProductSuggestions,

  /**
   * Get available sizes with caching
   */
  getAvailableSizes: getCachedAvailableSizes,

  /**
   * Get available compression levels with caching
   */
  getAvailableCompressionLevels: getCachedAvailableCompressionLevels,

  /**
   * Cache revalidation methods
   */
  revalidate: ProductCacheRevalidator,
}
