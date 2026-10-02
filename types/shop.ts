/**
 * Shop/URL-related types
 */

// Shop search parameters for URL state
export interface ShopSearchParams {
  q?: string // search query
  size?: string // size filter: xs, s, m, l, xl
  compression?: string // compression filter: light, medium, high
  availability?: string // availability filter: in-stock, low-stock, out-of-stock
  sort?: string // sort: featured, newest, price_asc, price_desc
}