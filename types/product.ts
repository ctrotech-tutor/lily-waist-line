import type { ProductModel, ProductVariantModel, ProductImageModel } from '@/lib/generated/prisma/models'
import type { Decimal } from '@/lib/prisma'

// Prisma types with relations included
export type ProductWithVariantsAndImages = ProductModel & {
  variants: (ProductVariantModel & {
    images: ProductImageModel[]
  })[]
  images: ProductImageModel[]
}

// Re-export ProductWithDetails from product-service to avoid duplication
export type { ProductWithDetails } from '@/lib/services/product-service'

// UI Product Card Props
export interface ProductCardProps {
  id: string
  image: string
  name: string
  subtitle: string
  price: number
  originalPrice?: number
  badge?: string
  stockState: 'in-stock' | 'out-of-stock' | 'low-stock'
  isWishlisted?: boolean
  slug?: string
}

// Transformed product data for UI
export interface TransformedProduct {
  id: string
  image: string
  name: string
  subtitle: string
  price: number
  originalPrice?: number
  badge?: string
  stockState: 'in-stock' | 'out-of-stock' | 'low-stock'
  isWishlisted: boolean
  slug: string
}

// Featured product data structure
export interface FeaturedProductData {
  id: string
  image: string
  name: string
  subtitle: string
  price: number
  originalPrice?: number
  badge?: string
  stockState: 'in-stock' | 'out-of-stock' | 'low-stock'
  slug: string
}

// Filter and search options
export interface ProductFilterOptions {
  search?: string
  size?: string
  compression?: string
  sort?: string
  limit?: number
  offset?: number
  inStock?: boolean
}

// Size and compression enums for type safety
export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'] as const
export const COMPRESSION_OPTIONS = ['LIGHT', 'MEDIUM', 'HIGH'] as const
export const SORT_OPTIONS = ['FEATURED', 'NEWEST', 'PRICE_ASC', 'PRICE_DESC'] as const

export type SizeOption = typeof SIZE_OPTIONS[number]
export type CompressionOption = typeof COMPRESSION_OPTIONS[number]
export type SortOption = typeof SORT_OPTIONS[number]

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
