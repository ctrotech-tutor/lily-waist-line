import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildProductPriceSortQuery,
  getAvailableProductPriceRange,
} from '../../lib/services/product-pricing'

describe('displayed product price range', () => {
  it('uses effective prices from in-stock variants and falls back to base price for null overrides', () => {
    assert.deepEqual(getAvailableProductPriceRange(100, [
      { price: 10, stockQuantity: 0 },
      { price: 85, stockQuantity: 2 },
      { price: null, stockQuantity: 1 },
      { price: 120, stockQuantity: 1 },
    ]), { minPrice: 85, maxPrice: 120 })
  })

  it('uses the base price when no variant is in stock', () => {
    assert.deepEqual(getAvailableProductPriceRange(100, [
      { price: 75, stockQuantity: 0 },
      { price: null, stockQuantity: 0 },
    ]), { minPrice: 100, maxPrice: 100 })
  })

  it('preserves a zero-priced in-stock variant', () => {
    assert.deepEqual(getAvailableProductPriceRange(100, [
      { price: 0, stockQuantity: 1 },
      { price: null, stockQuantity: 1 },
    ]), { minPrice: 0, maxPrice: 100 })
  })
})

describe('effective-price product sorting query', () => {
  it('sorts by the same in-stock variant minimum and keeps filters and paging parameterized', () => {
    const query = buildProductPriceSortQuery({
      search: 'wig',
      size: 'M',
      compression: 'high',
      availability: 'low-stock',
      limit: 12,
      offset: 24,
    }, 'desc')

    assert.match(query.sql, /MIN\(COALESCE\(price_variant\."price", p\."basePrice"\)\)/)
    assert.match(query.sql, /price_variant\."stockQuantity" > 0/)
    assert.match(query.sql, /ORDER BY "displayPrice" DESC, "createdAt" DESC, "id" ASC/)
    assert.match(query.sql, /matching_variant\."size" = \?/)
    assert.match(query.sql, /matching_variant\."compressionLevel" = \?/)
    assert.match(query.sql, /matching_variant\."stockQuantity" > 0/)
    assert.match(query.sql, /matching_variant\."stockQuantity" <= 5/)
    assert.deepEqual(query.values, ['%wig%', '%wig%', '%wig%', 'M', 'HIGH', 12, 24])
  })

  it('uses the in-stock threshold in the product filter', () => {
    const query = buildProductPriceSortQuery({
      availability: 'in-stock',
      limit: 5,
      offset: 0,
    }, 'asc')

    assert.match(query.sql, /matching_variant\."stockQuantity" > 5/)
    assert.deepEqual(query.values, [5, 0])
  })

  it('binds search input instead of interpolating it into SQL', () => {
    const search = "wig%' OR 1=1 --"
    const query = buildProductPriceSortQuery({ search, limit: 12, offset: 0 }, 'asc')

    assert.equal(query.values[0], `%${search}%`)
    assert.equal(query.values[1], `%${search}%`)
    assert.equal(query.values[2], `%${search}%`)
    assert.equal(query.sql.includes(search), false)
    assert.match(query.sql, /ORDER BY "displayPrice" ASC, "createdAt" DESC, "id" ASC/)
  })
})
