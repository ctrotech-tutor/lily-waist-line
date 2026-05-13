import prisma, { Decimal } from '@/lib/prisma'
import type { ProductModel, ProductVariantModel, ProductImageModel } from '@/lib/generated/prisma/models'
import type { Prisma } from '@/lib/generated/prisma/client'

// Types for product queries
export interface ProductQueryOptions {
  search?: string
  size?: string
  compression?: string
  sort?: string
  limit?: number
  offset?: number
  inStock?: boolean
}

export interface ProductResult {
  products: ProductWithDetails[]
  total: number
  hasMore: boolean
}

export interface ProductWithDetails extends Omit<ProductModel, 'basePrice' | 'compareAtPrice'> {
  variants: ProductVariantWithStock[]
  images: ProductImage[]
  basePrice: number
  compareAtPrice: number | null
  minPrice: number
  maxPrice: number
  totalStock: number
  inStock: boolean
}

export interface ProductVariantWithStock extends ProductVariantModel {
  inStock: boolean
}

export type ProductImage = ProductImageModel

// Sorting options
export enum SortOption {
  FEATURED = 'featured',
  NEWEST = 'newest',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc'
}

// Size options
export enum SizeOption {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL'
}

// Compression options
export enum CompressionOption {
  LIGHT = 'LIGHT',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class ProductService {
  /**
   * Get products with filtering, sorting, and pagination - Optimized for performance
   */
  static async getProducts(options: ProductQueryOptions = {}): Promise<ProductResult> {
    const {
      search,
      size,
      compression,
      sort = SortOption.FEATURED,
      limit = 12,
      offset = 0,
      inStock = true
    } = options

    // Build optimized where clause using new indexes
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE' // Uses idx_product_status_created_at
    }

    // Optimized search filter - consider using full-text search for large datasets
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Optimized variant filters - combine into single query for better index usage
    const variantConditions: Prisma.ProductVariantWhereInput[] = []
    
    if (size) {
      variantConditions.push({ size: size.toUpperCase() })
    }

    if (compression) {
      variantConditions.push({ compressionLevel: compression.toUpperCase() })
    }

    if (inStock) {
      variantConditions.push({ stockQuantity: { gt: 0 } })
    }

    // Apply combined variant filter
    if (variantConditions.length > 0) {
      where.variants = {
        some: variantConditions.length === 1 
          ? variantConditions[0]
          : Object.assign({}, ...variantConditions.map((condition, index) => 
            index === 0 ? condition : { AND: [condition] }
          ))
      }
    }

    // Optimized order by clause using indexes
    let orderBy: Prisma.ProductOrderByWithRelationInput
    switch (sort) {
      case SortOption.NEWEST:
        orderBy = { createdAt: 'desc' } // Uses idx_product_status_created_at
        break
      case SortOption.PRICE_ASC:
        orderBy = { basePrice: 'asc' } // Uses idx_product_base_price
        break
      case SortOption.PRICE_DESC:
        orderBy = { basePrice: 'desc' } // Uses idx_product_base_price
        break
      case SortOption.FEATURED:
      default:
        orderBy = { createdAt: 'desc' } // Uses idx_product_status_created_at
        break
    }

    // Execute optimized queries with proper include structure
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          variants: {
            include: {
              images: {
                where: {
                  imageType: 'variant'
                },
                orderBy: { sortOrder: 'asc' }
              }
            },
            where: inStock ? { stockQuantity: { gt: 0 } } : undefined
          },
          images: {
            where: {
              OR: [
                { imageType: 'main' },
                { imageType: 'gallery' }
              ]
            },
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy,
        take: limit,
        skip: offset
      }),
      prisma.product.count({ where })
    ])

    // Transform products to include computed fields
    const transformedProducts = products.map(this.transformProduct)

    return {
      products: transformedProducts,
      total,
      hasMore: offset + limit < total
    }
  }

  /**
   * Get a single product by slug - Optimized with indexes
   */
  static async getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: 'ACTIVE' // Uses idx_product_status_created_at
      },
      include: {
        variants: {
          include: {
            images: {
              where: {
                imageType: 'variant'
              },
              orderBy: { sortOrder: 'asc' }
            }
          }
        },
        images: {
          where: {
            OR: [
              { imageType: 'main' },
              { imageType: 'gallery' }
            ]
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    })

    return product ? this.transformProduct(product) : null
  }

  /**
   * Get featured products for homepage
   */
  static async getFeaturedProducts(limit: number = 8): Promise<ProductWithDetails[]> {
    const result = await this.getProducts({
      sort: SortOption.FEATURED,
      limit,
      inStock: true
    })

    return result.products
  }

  /**
   * Transform product data to include computed fields
   */
  private static transformProduct(product: ProductModel & {
    variants: (ProductVariantModel & {
      images: ProductImageModel[]
    })[]
    images: ProductImageModel[]
  }): ProductWithDetails {
    // Transform variants
    const variants: ProductVariantWithStock[] = product.variants.map((variant: ProductVariantModel): ProductVariantWithStock => ({
      ...variant,
      inStock: variant.stockQuantity > 0
    }))

    // Transform images
    const images: ProductImage[] = product.images.map((image: ProductImageModel): ProductImage => ({
      ...image
    }))

    // Convert Decimal prices to numbers for client serialization
    const basePriceNumber = product.basePrice.toNumber()
    const compareAtPriceNumber = product.compareAtPrice ? product.compareAtPrice.toNumber() : null

    // Calculate price range
    const prices = variants.map(v => v.stockQuantity > 0 ? basePriceNumber : null).filter(Boolean)
    const availablePrices = prices as number[]
    const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : basePriceNumber
    const maxPrice = availablePrices.length > 0 ? Math.max(...availablePrices) : basePriceNumber

    // Calculate total stock
    const totalStock = variants.reduce((sum: number, variant: ProductVariantWithStock) => sum + variant.stockQuantity, 0)

    return {
      ...product,
      basePrice: basePriceNumber,
      compareAtPrice: compareAtPriceNumber,
      variants,
      images,
      minPrice,
      maxPrice,
      totalStock,
      inStock: totalStock > 0
    }
  }

  /**
   * Get available sizes for products - Optimized with indexes
   */
  static async getAvailableSizes(): Promise<string[]> {
    const sizes = await prisma.productVariant.findMany({
      where: {
        stockQuantity: {
          gt: 0
        },
        product: {
          status: 'ACTIVE'
        }
      },
      select: {
        size: true
      },
      distinct: ['size'],
      orderBy: {
        size: 'asc'
      }
      // Uses idx_variant_size_stock and idx_variant_active_product_stock
    })

    return sizes.map(s => s.size)
  }

  /**
   * Get available compression levels for products - Optimized with indexes
   */
  static async getAvailableCompressionLevels(): Promise<string[]> {
    const levels = await prisma.productVariant.findMany({
      where: {
        stockQuantity: {
          gt: 0
        },
        product: {
          status: 'ACTIVE'
        }
      },
      select: {
        compressionLevel: true
      },
      distinct: ['compressionLevel'],
      orderBy: {
        compressionLevel: 'asc'
      }
      // Uses idx_variant_compression_stock and idx_variant_active_product_stock
    })

    return levels.map(l => l.compressionLevel)
  }

  /**
   * Get product suggestions for search autocomplete - Optimized
   */
  static async getProductSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query || query.length < 2) return []

    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE', // Uses idx_product_status_created_at
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        name: true,
        slug: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return products.map(p => p.name)
  }
}
