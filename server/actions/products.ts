"use server";

import { ProductService, ProductQueryOptions, ProductWithDetails } from "@/lib/services";
import { tryAction } from "@/lib/security/error-handling";

/**
 * Server action to get products with filtering and pagination
 */
export const getProducts = tryAction(async (options: ProductQueryOptions = {}) => {
  return await ProductService.getProducts(options);
})

/**
 * Server action to load more products (for pagination)
 */
export const loadMoreProducts = tryAction(async (options: ProductQueryOptions = {}) => {
  return await ProductService.getProducts(options);
})

/**
 * Server action to get a single product by slug
 */
export const getProductBySlug = tryAction(async (slug: string) => {
  return await ProductService.getProductBySlug(slug);
})

/**
 * Server action to get featured products
 */
export const getFeaturedProducts = tryAction(async (limit: number = 8) => {
  return await ProductService.getFeaturedProducts(limit);
})

/**
 * Server action to get related products (using featured products as placeholder)
 */
export const getRelatedProducts = tryAction(async (productId: string, limit: number = 4) => {
  // For now, return featured products excluding the current product
  const featuredProducts = await ProductService.getFeaturedProducts(limit + 1);
  return featuredProducts.filter((p: ProductWithDetails) => p.id !== productId).slice(0, limit);
})
