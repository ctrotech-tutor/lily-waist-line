import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

// Types for admin operations
export interface AdminOrderFilters {
  page?: number
  limit?: number
  search?: string
  paymentStatus?: 'PENDING' | 'PAID' | 'REJECTED'
  fulfillmentStatus?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

export interface AdminOrderResult {
  orders: any[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface AdminDashboardMetrics {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  shippedOrders: number
  recentOrders: any[]
  alerts: {
    paymentConfirmations: number
    lowStock: number
    unshippedOrders: number
  }
}

/**
 * Optimized Admin Service for large datasets
 * Uses proper indexes and batch queries for performance
 */
export class AdminService {
  /**
   * Get orders with optimized filtering and pagination
   * Uses composite indexes for admin dashboard queries
   */
  static async getAllOrders(filters: AdminOrderFilters = {}): Promise<AdminOrderResult> {
    const {
      page = 1,
      limit = 20,
      search,
      paymentStatus,
      fulfillmentStatus
    } = filters

    const offset = (page - 1) * limit

    // Build optimized where clause using indexes
    const where: any = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    if (fulfillmentStatus) {
      where.fulfillmentStatus = fulfillmentStatus
    }

    // Execute parallel queries for better performance
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          subtotal: true,
          shippingFee: true,
          total: true,
          paymentMethod: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true
            }
          },
          address: {
            select: {
              firstName: true,
              lastName: true,
              addressLine1: true,
              city: true,
              state: true,
              country: true,
              postalCode: true
            }
          },
          orderItems: {
            select: {
              quantity: true,
              unitPrice: true,
              product: {
                select: {
                  name: true,
                  slug: true
                }
              },
              variant: {
                select: {
                  size: true,
                  compressionLevel: true,
                  sku: true
                }
              }
            },
            take: 5 // Limit items for performance
          },
          paymentProofs: {
            select: {
              id: true,
              imageUrl: true,
              status: true,
              uploadedAt: true
            },
            orderBy: { uploadedAt: 'desc' },
            take: 1
          },
          shipments: {
            select: {
              id: true,
              carrier: true,
              trackingNumber: true,
              shippedAt: true,
              deliveredAt: true
            },
            orderBy: { shippedAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }, // Uses idx_order_created_status
        take: limit,
        skip: offset
      }),
      prisma.order.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage
      }
    }
  }

  /**
   * Get dashboard metrics with optimized queries
   * Uses parallel execution and aggregate functions
   */
  static async getDashboardMetrics(): Promise<AdminDashboardMetrics> {
    // Execute all metric queries in parallel for maximum performance
    const [
      totalOrdersResult,
      totalRevenueResult,
      pendingOrdersResult,
      shippedOrdersResult,
      recentOrders,
      paymentConfirmationsResult,
      lowStockResult,
      unshippedOrdersResult
    ] = await Promise.all([
      // Total orders count
      prisma.order.count(),
      
      // Total revenue (only paid orders)
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true }
      }),
      
      // Pending orders count
      prisma.order.count({
        where: { paymentStatus: 'PENDING' }
      }),
      
      // Shipped orders count
      prisma.order.count({
        where: { fulfillmentStatus: 'SHIPPED' }
      }),
      
      // Recent orders (last 5)
      prisma.order.findMany({
        select: {
          id: true,
          total: true,
          paymentStatus: true,
          fulfillmentStatus: true,
          createdAt: true,
          user: {
            select: {
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // Payment confirmations pending
      prisma.paymentProof.count({
        where: { status: 'PENDING' }
      }),
      
      // Low stock variants (less than 5 items)
      prisma.productVariant.count({
        where: {
          stockQuantity: { lt: 5 },
          product: { status: 'ACTIVE' }
        }
      }),
      
      // Unshipped paid orders
      prisma.order.count({
        where: {
          paymentStatus: 'PAID',
          fulfillmentStatus: { not: 'DELIVERED' }
        }
      })
    ])

    return {
      totalOrders: totalOrdersResult,
      totalRevenue: totalRevenueResult._sum.total?.toNumber() || 0,
      pendingOrders: pendingOrdersResult,
      shippedOrders: shippedOrdersResult,
      recentOrders,
      alerts: {
        paymentConfirmations: paymentConfirmationsResult,
        lowStock: lowStockResult,
        unshippedOrders: unshippedOrdersResult
      }
    }
  }

  /**
   * Get customers with optimized queries
   */
  static async getCustomers(page: number = 1, limit: number = 20, search?: string) {
    const offset = (page - 1) * limit

    const where = search ? {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {}

    const [customers, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              orders: true
            }
          },
          orders: {
            select: {
              total: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }, // Uses idx_user_role_created
        take: limit,
        skip: offset
      }),
      prisma.user.count({ where })
    ])

    // Transform customers with computed fields
    const transformedCustomers = customers.map(customer => {
      const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + order.total.toNumber(), 0)
      const orderCount = customer._count.orders
      
      // Determine customer segment
      let status = 'New'
      if (totalSpent > 500) status = 'VIP'
      else if (orderCount >= 2) status = 'Returning'

      return {
        ...customer,
        totalSpent,
        orderCount,
        status,
        lastOrderDate: customer.orders[0]?.createdAt || null
      }
    })

    const totalPages = Math.ceil(totalCount / limit)

    return {
      customers: transformedCustomers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  }

  /**
   * Get products with admin-specific optimizations
   */
  static async getProducts(page: number = 1, limit: number = 20, search?: string, stockFilter?: string) {
    const offset = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } }
      ]
    }

    if (stockFilter) {
      where.variants = {
        some: stockFilter === 'OUT_OF_STOCK' 
          ? { stockQuantity: 0 }
          : stockFilter === 'LOW_STOCK'
          ? { stockQuantity: { gt: 0, lt: 5 } }
          : { stockQuantity: { gte: 5 } }
      }
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          basePrice: true,
          compareAtPrice: true,
          status: true,
          createdAt: true,
          variants: {
            select: {
              id: true,
              size: true,
              compressionLevel: true,
              sku: true,
              stockQuantity: true
            }
          },
          images: {
            select: {
              url: true,
              imageType: true,
              sortOrder: true
            },
            where: { imageType: 'main' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }, // Uses idx_product_status_created_at
        take: limit,
        skip: offset
      }),
      prisma.product.count({ where })
    ])

    // Transform products with computed fields
    const transformedProducts = products.map(product => {
      const totalStock = product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0)
      const inStockCount = product.variants.filter(v => v.stockQuantity > 0).length
      
      let stockStatus = 'IN_STOCK'
      if (totalStock === 0) stockStatus = 'OUT_OF_STOCK'
      else if (totalStock < 10) stockStatus = 'LOW_STOCK'

      return {
        ...product,
        basePrice: product.basePrice.toNumber(),
        compareAtPrice: product.compareAtPrice?.toNumber() || null,
        totalStock,
        stockStatus,
        variantCount: product.variants.length,
        inStockCount,
        image: product.images[0] || null
      }
    })

    const totalPages = Math.ceil(totalCount / limit)

    return {
      products: transformedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  }
}

// Cached wrappers for admin operations
export const getCachedDashboardMetrics = unstable_cache(
  async () => {
    return await AdminService.getDashboardMetrics()
  },
  ['get-dashboard-metrics'],
  {
    revalidate: 300, // 5 minutes cache for dashboard metrics
  }
)

export const getCachedAdminOrders = unstable_cache(
  async (filters: AdminOrderFilters) => {
    return await AdminService.getAllOrders(filters)
  },
  ['get-admin-orders'],
  {
    revalidate: 60, // 1 minute cache for orders
  }
)
