import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { Decimal } from '@/lib/prisma'
import type { Prisma } from '@/lib/generated/prisma/client'
import type { AdminOrderFilters, AdminCustomerFilters } from '@/types/admin'

// Re-export domain types for backward compatibility
export type { AdminOrderFilters }
export type { AdminCustomerFilters }

// Type for serializable admin order (Decimal converted to number)
export type AdminOrderSerializable = {
  id: string
  subtotal: number
  shippingFee: number
  total: number
  paymentMethod: string
  paymentRecipient?: string | null
  paymentUrl?: string | null
  paymentStatus: string
  fulfillmentStatus: string
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    email: string
    fullName: string
    phone?: string | null
  }
  address: {
    firstName: string
    lastName: string
    company?: string | null
    addressLine1: string
    addressLine2?: string | null
    city: string
    state: string
    country: string
    postalCode: string
    phone?: string | null
  }
  orderItems: Array<{
    id?: string
    quantity: number
    unitPrice: number
    product: {
      name: string
      slug: string
      images: { url: string }[]
    }
    variant: {
      size: string
      compressionLevel: string
      sku: string
    }
  }>
  paymentProofs: Array<{
    id: string
    imageUrl: string
    status: string
    rejectionReason?: string | null
    uploadedAt: Date
  }>
  shipments: Array<{
    id: string
    carrier: string
    trackingNumber: string | null
    shippedAt: Date | null
    deliveredAt: Date | null
  }>
}

export interface AdminOrderResult {
  orders: AdminOrderSerializable[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Type for recent order with selected fields
type RecentOrder = {
  id: string
  orderNumber: string
  total: number
  paymentStatus: string
  fulfillmentStatus: string
  createdAt: Date
  user: {
    fullName: string
    email: string
  }
}

export interface AdminDashboardMetrics {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  shippedOrders: number
  recentOrders: RecentOrder[]
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
    const where: Prisma.OrderWhereInput = {}

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
          shippingFirstName: true,
          shippingLastName: true,
          shippingCompany: true,
          shippingAddressLine1: true,
          shippingAddressLine2: true,
          shippingCity: true,
          shippingState: true,
          shippingPostalCode: true,
          shippingCountry: true,
          shippingPhone: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true
            }
          },
          orderItems: {
            select: {
              quantity: true,
              unitPrice: true,
              productNameSnapshot: true,
              variantSizeSnapshot: true,
              variantCompressionLevelSnapshot: true,
              variantSkuSnapshot: true,
              product: {
                select: {
                  slug: true,
                  images: {
                    where: { imageType: 'main' },
                    take: 1,
                    select: { url: true }
                  }
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

    const serializedOrders: AdminOrderSerializable[] = orders.map(({
      shippingFirstName,
      shippingLastName,
      shippingCompany,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      shippingPhone,
      ...order
    }) => ({
      ...order,
      subtotal: order.subtotal.toNumber(),
      shippingFee: order.shippingFee.toNumber(),
      total: order.total.toNumber(),
      address: {
        firstName: shippingFirstName,
        lastName: shippingLastName,
        company: shippingCompany,
        addressLine1: shippingAddressLine1,
        addressLine2: shippingAddressLine2,
        city: shippingCity,
        state: shippingState,
        country: shippingCountry,
        postalCode: shippingPostalCode,
        phone: shippingPhone,
      },
      orderItems: order.orderItems.map(({ productNameSnapshot, variantSizeSnapshot, variantCompressionLevelSnapshot, variantSkuSnapshot, ...item }) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
        product: { ...item.product, name: productNameSnapshot },
        variant: {
          size: variantSizeSnapshot,
          compressionLevel: variantCompressionLevelSnapshot,
          sku: variantSkuSnapshot,
        },
      })),
    }))

    return {
      orders: serializedOrders,
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
          orderNumber: true,
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

    const serializedRecentOrders: RecentOrder[] = recentOrders.map(order => ({
      ...order,
      total: order.total.toNumber()
    }))

    return {
      totalOrders: totalOrdersResult,
      totalRevenue: totalRevenueResult._sum.total?.toNumber() || 0,
      pendingOrders: pendingOrdersResult,
      shippedOrders: shippedOrdersResult,
      recentOrders: serializedRecentOrders,
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
      const totalSpent = customer.orders.reduce((sum: number, order: { total: Decimal }) => sum + order.total.toNumber(), 0)
      const orderCount = customer._count.orders

      // Determine customer segment
      let status = 'NEW'
      if (totalSpent > 500) status = 'VIP'
      else if (orderCount >= 2) status = 'RETURNING'

      return {
        id: customer.id,
        email: customer.email,
        fullName: customer.fullName,
        phone: customer.phone,
        avatarUrl: customer.avatarUrl,
        avatarStoragePath: customer.avatarStoragePath,
        role: customer.role,
        emailVerified: customer.emailVerified,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
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
   * Get a single order by ID with all relations
   */
  static async getOrderById(orderId: string): Promise<AdminOrderSerializable | null> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        subtotal: true,
        shippingFee: true,
        total: true,
        paymentMethod: true,
        paymentRecipient: true,
        paymentUrl: true,
        paymentStatus: true,
        fulfillmentStatus: true,
        createdAt: true,
        updatedAt: true,
        shippingFirstName: true,
        shippingLastName: true,
        shippingCompany: true,
        shippingAddressLine1: true,
        shippingAddressLine2: true,
        shippingCity: true,
        shippingState: true,
        shippingPostalCode: true,
        shippingCountry: true,
        shippingPhone: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true
          }
        },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            unitPrice: true,
            productNameSnapshot: true,
            variantSizeSnapshot: true,
            variantCompressionLevelSnapshot: true,
            variantSkuSnapshot: true,
            product: {
              select: {
                slug: true,
                images: {
                  where: { imageType: 'main' },
                  take: 1,
                  select: { url: true }
                }
              }
            }
          }
        },
        paymentProofs: {
          select: {
            id: true,
            imageUrl: true,
            status: true,
            rejectionReason: true,
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
      }
    })

    if (!order) return null

    const {
      shippingFirstName,
      shippingLastName,
      shippingCompany,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      shippingPhone,
      ...orderData
    } = order

    return {
      ...orderData,
      subtotal: order.subtotal.toNumber(),
      shippingFee: order.shippingFee.toNumber(),
      total: order.total.toNumber(),
      address: {
        firstName: shippingFirstName,
        lastName: shippingLastName,
        company: shippingCompany,
        addressLine1: shippingAddressLine1,
        addressLine2: shippingAddressLine2,
        city: shippingCity,
        state: shippingState,
        country: shippingCountry,
        postalCode: shippingPostalCode,
        phone: shippingPhone,
      },
      orderItems: order.orderItems.map(({ productNameSnapshot, variantSizeSnapshot, variantCompressionLevelSnapshot, variantSkuSnapshot, ...item }) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
        product: { ...item.product, name: productNameSnapshot },
        variant: {
          size: variantSizeSnapshot,
          compressionLevel: variantCompressionLevelSnapshot,
          sku: variantSkuSnapshot,
        },
      })),
    }
  }

  /**
   * Get a single customer by ID with order history
   */
  static async getCustomerById(customerId: string) {
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        },
        orders: {
          select: {
            id: true,
            createdAt: true,
            fulfillmentStatus: true,
            total: true,
            _count: {
              select: { orderItems: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    })

    if (!customer) return null

    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total.toNumber(), 0)
    const orderCount = customer._count.orders

    let status = 'NEW'
    if (totalSpent > 500) status = 'VIP'
    else if (orderCount >= 2) status = 'RETURNING'

    return {
      id: customer.id,
      email: customer.email,
      fullName: customer.fullName,
      phone: customer.phone,
      avatarUrl: customer.avatarUrl,
      orderCount,
      totalSpent,
      status,
      lastOrderDate: customer.orders[0]?.createdAt || null,
      createdAt: customer.createdAt,
      orders: customer.orders.map(order => ({
        id: order.id,
        createdAt: order.createdAt,
        fulfillmentStatus: order.fulfillmentStatus,
        total: order.total.toNumber(),
        itemCount: order._count.orderItems
      }))
    }
  }

  /**
   * Get products with admin-specific optimizations
   */
  static async getProducts(page: number = 1, limit: number = 20, search?: string, stockFilter?: string) {
    const offset = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {}

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
      else if (totalStock <= 5) stockStatus = 'LOW_STOCK'

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

export const getCachedAdminOrder = unstable_cache(
  async (orderId: string) => {
    return await AdminService.getOrderById(orderId)
  },
  ['get-admin-order'],
  {
    revalidate: 30, // 30 seconds cache for order detail
  }
)

export const getCachedAdminCustomers = unstable_cache(
  async (filters: AdminCustomerFilters) => {
    return await AdminService.getCustomers(filters.page, filters.limit, filters.search)
  },
  ['get-admin-customers'],
  {
    revalidate: 60, // 1 minute cache for customers list
  }
)

export const getCachedAdminCustomer = unstable_cache(
  async (customerId: string) => {
    return await AdminService.getCustomerById(customerId)
  },
  ['get-admin-customer'],
  {
    revalidate: 30, // 30 seconds cache for customer detail
  }
)
