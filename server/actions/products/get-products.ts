'use server'

import { CachedProductService, ProductQueryOptions, ProductResult } from '@/lib/cache/product-cache'

/**
 * Server action to get products with filtering and pagination - Now with caching
 */
export async function getProducts(options: ProductQueryOptions = {}): Promise<ProductResult> {
  try {
    const result = await CachedProductService.getProducts(options)
    return result
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}

/**
 * Server action to get a single product by slug - Now with caching
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await CachedProductService.getProductBySlug(slug)
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }
}

/**
 * Server action to get featured products - Now with caching
 */
export async function getFeaturedProducts(limit: number = 8) {
  try {
    const products = await CachedProductService.getFeaturedProducts(limit)
    return products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw new Error('Failed to fetch featured products')
  }
}

/**
 * Server action to get product suggestions for search - Now with caching
 */
export async function getProductSuggestions(query: string, limit: number = 5) {
  try {
    const suggestions = await CachedProductService.getProductSuggestions(query, limit)
    return suggestions
  } catch (error) {
    console.error('Error fetching product suggestions:', error)
    throw new Error('Failed to fetch product suggestions')
  }
}

/**
 * Server action to get available sizes - Now with caching
 */
export async function getAvailableSizes() {
  try {
    const sizes = await CachedProductService.getAvailableSizes()
    return sizes
  } catch (error) {
    console.error('Error fetching available sizes:', error)
    throw new Error('Failed to fetch available sizes')
  }
}

/**
 * Server action to get available compression levels - Now with caching
 */
export async function getAvailableCompressionLevels() {
  try {
    const levels = await CachedProductService.getAvailableCompressionLevels()
    return levels
  } catch (error) {
    console.error('Error fetching available compression levels:', error)
    throw new Error('Failed to fetch available compression levels')
  }
}

/**
 * Server action to revalidate product pages - Enhanced with cache revalidation
 */
export async function revalidateProducts() {
  CachedProductService.revalidate.revalidateAll()
}
