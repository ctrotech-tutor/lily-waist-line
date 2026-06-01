/**
 * TanStack Query Key Factory
 * Centralized, type-safe query key definitions for consistent cache management
 */

// Cart query keys
export const cartKeys = {
  all: ['cart'] as const,
  base: () => ['cart'] as const,
} as const

// Wishlist query keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
  base: () => ['wishlist'] as const,
} as const

// Product query keys
export const productKeys = {
  all: ['product'] as const,
  detail: (id: string) => ['product', id] as const,
  bySlug: (slug: string) => ['product', slug] as const,
} as const

// Products query keys
export const productsKeys = {
  all: ['products'] as const,
  list: (options: Record<string, unknown>) => ['products', options] as const,
} as const

// Featured products query keys
export const featuredProductsKeys = {
  all: ['featuredProducts'] as const,
  list: (limit: number) => ['featuredProducts', limit] as const,
} as const

// Auth query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => ['auth', 'user'] as const,
  session: () => ['auth', 'session'] as const,
} as const

// Account query keys
export const accountKeys = {
  all: ['account'] as const,
  profile: () => ['account', 'profile'] as const,
  stats: () => ['account', 'stats'] as const,
} as const

// Address query keys
export const addressKeys = {
  all: ['addresses'] as const,
  base: () => ['addresses'] as const,
} as const

// Payment config query keys
export const paymentConfigKeys = {
  all: ['paymentConfig'] as const,
  base: () => ['paymentConfig'] as const,
} as const

// Order query keys
export const orderKeys = {
  all: ['orders'] as const,
  list: () => ['orders', 'list'] as const,
  detail: (id: string) => ['orders', id] as const,
} as const

// Admin query keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => ['admin', 'dashboard'] as const,
  products: {
    all: () => ['admin', 'products'] as const,
    list: (filters: Record<string, unknown>) => ['admin', 'products', filters] as const,
    detail: (id: string) => ['admin', 'products', id] as const,
  },
  orders: {
    all: () => ['admin', 'orders'] as const,
    list: (filters: Record<string, unknown>) => ['admin', 'orders', filters] as const,
    detail: (id: string) => ['admin', 'orders', id] as const,
  },
  customers: {
    all: () => ['admin', 'customers'] as const,
    list: (filters: Record<string, unknown>) => ['admin', 'customers', filters] as const,
    detail: (id: string) => ['admin', 'customers', id] as const,
  },
  shipping: {
    all: () => ['admin', 'shipping'] as const,
    list: (filters: Record<string, unknown>) => ['admin', 'shipping', filters] as const,
  },
  settings: {
    all: () => ['admin', 'settings'] as const,
  },
} as const

// Type helpers for query keys
export type CartQueryKey = typeof cartKeys.all
export type WishlistQueryKey = typeof wishlistKeys.all
export type ProductQueryKey = ReturnType<typeof productKeys.detail>
export type ProductsQueryKey = ReturnType<typeof productsKeys.list>
export type FeaturedProductsQueryKey = ReturnType<typeof featuredProductsKeys.list>
export type AuthQueryKey = ReturnType<typeof authKeys.user>
export type AccountQueryKey = ReturnType<typeof accountKeys.profile>