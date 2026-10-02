import type { ProductModel, ProductVariantModel, ProductImageModel } from '@/lib/generated/prisma/models'
import type { StockState } from './common'

// Prisma types with relations included
export type ProductWithVariantsAndImages = ProductModel & {
  variants: (ProductVariantModel & {
    images: ProductImageModel[]
  })[]
  images: ProductImageModel[]
}

// Domain types for product queries
export interface ProductQueryOptions {
  search?: string
  size?: string
  compression?: string
  sort?: string
  limit?: number
  offset?: number
  availability?: 'in-stock' | 'low-stock' | 'out-of-stock'
}

// Domain result type for product queries (using base Prisma type)
export interface ProductResult {
  products: ProductWithVariantsAndImages[]
  total: number
  hasMore: boolean
}

// Unified sorting options (aligns with product-service enum values)
export const SORT_OPTIONS = ['featured', 'newest', 'price_asc', 'price_desc'] as const
export type SortOption = typeof SORT_OPTIONS[number]

// Unified size options
export const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'] as const
export type SizeOption = typeof SIZE_OPTIONS[number]

// Unified compression options
export const COMPRESSION_OPTIONS = ['LIGHT', 'MEDIUM', 'HIGH'] as const
export type CompressionOption = typeof COMPRESSION_OPTIONS[number]

// UI types for transformed product data
export interface TransformedProduct {
  id: string
  image: string
  name: string
  subtitle: string
  price: number
  originalPrice?: number
  badge?: string
  stockState: StockState
  isWishlisted: boolean
  slug: string
}

// Featured product data structure
export interface FeaturedProductData {
  id: string
  variantId: string
  slug: string
  image: string
  name: string
  subtitle: string
  price: number
  originalPrice?: number
  badge?: string
  stockState: StockState
}

// Product transformation utilities
export interface ProductTransformOptions {
  includeBadge?: boolean
  includeWishlist?: boolean
  stockThreshold?: number
}

// Server action return types
export interface ProductListResult {
  products: ProductWithVariantsAndImages[]
  total: number
  hasMore: boolean
}

export interface FeaturedProductsResult {
  products: FeaturedProductData[]
}

// Error handling types
export interface ProductError {
  code: string
  message: string
  details?: Record<string, unknown>
}