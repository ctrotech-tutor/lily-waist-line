'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function exportStoreData() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false as const, error: 'Unauthorized' }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return { success: false as const, error: 'Access denied. Admin access required.' }
    }

    const [customers, orders, products, paymentConfigs] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        select: {
          id: true, email: true, fullName: true, role: true, emailVerified: true,
          createdAt: true, updatedAt: true,
          addresses: {
            select: { id: true, firstName: true, lastName: true, addressLine1: true, addressLine2: true, city: true, state: true, postalCode: true, country: true, phone: true, isDefault: true },
          },
        },
      }),
      prisma.order.findMany({
        select: {
          id: true, userId: true, addressId: true, total: true, subtotal: true, shippingFee: true, paymentStatus: true, fulfillmentStatus: true, paymentMethod: true, createdAt: true, updatedAt: true,
          orderItems: {
            select: { id: true, orderId: true, productId: true, variantId: true, quantity: true, unitPrice: true },
          },
          paymentProofs: {
            select: { id: true, orderId: true, imageUrl: true, status: true, uploadedAt: true },
          },
          shipments: {
            select: { id: true, orderId: true, carrier: true, trackingNumber: true, shippedAt: true, deliveredAt: true },
          },
        },
      }),
      prisma.product.findMany({
        select: {
          id: true, name: true, slug: true, shortDescription: true, description: true, basePrice: true, compareAtPrice: true, status: true, createdAt: true, updatedAt: true,
          variants: {
            select: { id: true, productId: true, size: true, compressionLevel: true, color: true, sku: true, stockQuantity: true },
          },
          images: {
            select: { id: true, productId: true, url: true, altText: true, sortOrder: true },
          },
        },
      }),
      prisma.paymentConfiguration.findMany(),
    ])

    const data = {
      exportedAt: new Date().toISOString(),
      customers,
      orders,
      products,
      paymentConfigs,
    }

    return { success: true as const, data: JSON.stringify(data, null, 2) }
  } catch (error) {
    console.error('Error exporting data:', error)
    return { success: false as const, error: 'Failed to export data' }
  }
}