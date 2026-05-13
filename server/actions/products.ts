"use server";

import { ProductService, ProductQueryOptions, ProductWithDetails } from "@/lib/services";

/**
 * Server action to get products with filtering and pagination
 */
export async function getProducts(options: ProductQueryOptions = {}) {
  try {
    return await ProductService.getProducts(options);
  } catch (error) {
    console.error('Failed to get products:', error);
    throw new Error('Failed to load products');
  }
}

/**
 * Server action to load more products (for pagination)
 */
export async function loadMoreProducts(options: ProductQueryOptions = {}) {
  try {
    return await ProductService.getProducts(options);
  } catch (error) {
    console.error('Failed to load more products:', error);
    throw new Error('Failed to load more products');
  }
}

/**
 * Server action to get a single product by slug
 */
export async function getProductBySlug(slug: string) {
  try {
    return await ProductService.getProductBySlug(slug);
  } catch (error) {
    console.error('Failed to get product:', error);
    throw new Error('Failed to load product');
  }
}

/**
 * Server action to get featured products
 */
export async function getFeaturedProducts(limit = 8) {
  try {
    return await ProductService.getFeaturedProducts(limit);
  } catch (error) {
    console.error('Failed to get featured products:', error);
    throw new Error('Failed to load featured products');
  }
}

/**
 * Server action to get related products (using featured products as placeholder)
 */
export async function getRelatedProducts(productId: string, limit = 4) {
  try {
    // For now, return featured products excluding the current product
    const featuredProducts = await ProductService.getFeaturedProducts(limit + 1);
    return featuredProducts.filter((p: ProductWithDetails) => p.id !== productId).slice(0, limit);
  } catch (error) {
    console.error('Failed to get related products:', error);
    throw new Error('Failed to load related products');
  }
}
