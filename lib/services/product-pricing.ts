import { Prisma } from '../generated/prisma/client'
import type { ProductQueryOptions } from '../../types/product'

export interface VariantPriceInput {
  price: number | null
  stockQuantity: number
}

export interface ProductPriceRange {
  minPrice: number
  maxPrice: number
}

/**
 * Match the price shown on product cards: the min/max effective price among
 * in-stock variants, falling back to the product base price when none are in stock.
 */
export function getAvailableProductPriceRange(
  basePrice: number,
  variants: readonly VariantPriceInput[],
): ProductPriceRange {
  let minPrice = Number.POSITIVE_INFINITY
  let maxPrice = Number.NEGATIVE_INFINITY

  for (const variant of variants) {
    if (variant.stockQuantity <= 0) continue

    const effectivePrice = variant.price ?? basePrice
    minPrice = Math.min(minPrice, effectivePrice)
    maxPrice = Math.max(maxPrice, effectivePrice)
  }

  if (minPrice === Number.POSITIVE_INFINITY) {
    return { minPrice: basePrice, maxPrice: basePrice }
  }

  return { minPrice, maxPrice }
}

export type ProductPriceSortDirection = 'asc' | 'desc'

type ProductPriceSortOptions = Pick<
  ProductQueryOptions,
  'search' | 'size' | 'compression' | 'availability'
> & Required<Pick<ProductQueryOptions, 'limit' | 'offset'>>

/**
 * Select a correctly paginated product-ID slice ordered by the same effective
 * minimum price used by product cards. SQL fragments and sort directions are
 * fixed here; all user-controlled values remain bound parameters.
 */
export function buildProductPriceSortQuery(
  options: ProductPriceSortOptions,
  direction: ProductPriceSortDirection,
): Prisma.Sql {
  const productConditions: Prisma.Sql[] = [Prisma.sql`p."status" = 'ACTIVE'`]

  if (options.search) {
    const searchPattern = `%${options.search}%`
    productConditions.push(Prisma.sql`(
      p."name" ILIKE ${searchPattern}
      OR p."description" ILIKE ${searchPattern}
      OR p."slug" ILIKE ${searchPattern}
    )`)
  }

  const matchingVariantConditions: Prisma.Sql[] = [
    Prisma.sql`matching_variant."productId" = p."id"`,
  ]

  if (options.size) {
    matchingVariantConditions.push(Prisma.sql`matching_variant."size" = ${options.size.toUpperCase()}`)
  }

  if (options.compression) {
    matchingVariantConditions.push(
      Prisma.sql`matching_variant."compressionLevel" = ${options.compression.toUpperCase()}`,
    )
  }

  if (options.availability === 'in-stock') {
    matchingVariantConditions.push(Prisma.sql`matching_variant."stockQuantity" > 5`)
  } else if (options.availability === 'low-stock') {
    matchingVariantConditions.push(Prisma.sql`matching_variant."stockQuantity" > 0`)
    matchingVariantConditions.push(Prisma.sql`matching_variant."stockQuantity" <= 5`)
  } else if (options.availability === 'out-of-stock') {
    matchingVariantConditions.push(Prisma.sql`matching_variant."stockQuantity" = 0`)
  }

  if (matchingVariantConditions.length > 1) {
    productConditions.push(Prisma.sql`
      EXISTS (
        SELECT 1
        FROM "ProductVariant" AS matching_variant
        WHERE ${Prisma.join(matchingVariantConditions, ' AND ')}
      )
    `)
  }

  const sortDirection = direction === 'desc' ? Prisma.sql`DESC` : Prisma.sql`ASC`

  return Prisma.sql`
    WITH matching_products AS (
      SELECT
        p."id",
        p."createdAt",
        COALESCE(
          (
            SELECT MIN(COALESCE(price_variant."price", p."basePrice"))
            FROM "ProductVariant" AS price_variant
            WHERE price_variant."productId" = p."id"
              AND price_variant."stockQuantity" > 0
          ),
          p."basePrice"
        ) AS "displayPrice"
      FROM "Product" AS p
      WHERE ${Prisma.join(productConditions, ' AND ')}
    )
    SELECT "id"
    FROM matching_products
    ORDER BY "displayPrice" ${sortDirection}, "createdAt" DESC, "id" ASC
    LIMIT ${options.limit} OFFSET ${options.offset}
  `
}
