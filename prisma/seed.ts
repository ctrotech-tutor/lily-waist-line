import 'dotenv/config'
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from '../lib/generated/prisma/client'
import { Role, ProductStatus, PaymentMethod, PaymentStatus, FulfillmentStatus, PaymentProofStatus } from '../lib/generated/prisma/client'

// Helper to generate UUID v4 for seeding
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting Lily Waist Line database seeding...')

  // Clear existing data (for development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Clearing existing data...')
    await prisma.shipment.deleteMany()
    await prisma.paymentProof.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.wishlistItem.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.productVariant.deleteMany()
    await prisma.product.deleteMany()
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()
  }

  // 1. Seed Admin User
  console.log('👤 Creating admin user...')
  await prisma.user.upsert({
    where: { email: 'admin@lilywaistline.com' },
    update: {},
    create: {
      id: generateUuid(), // Required: User.id no longer has default
      email: 'admin@lilywaistline.com',
      fullName: 'Lily Waist Line Admin',
      role: Role.ADMIN,
      emailVerified: true,
    },
  })

  // 2. Seed Customer Users
  console.log('👥 Creating customer users...')
  const customer1 = await prisma.user.upsert({
    where: { email: 'sophia.chen@email.com' },
    update: {},
    create: {
      id: generateUuid(), // Required: User.id no longer has default
      email: 'sophia.chen@email.com',
      fullName: 'Sophia Chen',
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  })

  const customer2 = await prisma.user.upsert({
    where: { email: 'maria.garcia@email.com' },
    update: {},
    create: {
      id: generateUuid(), // Required: User.id no longer has default
      email: 'maria.garcia@email.com',
      fullName: 'Maria Garcia',
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  })

  const customer3 = await prisma.user.upsert({
    where: { email: 'emma.wilson@email.com' },
    update: {},
    create: {
      id: generateUuid(), // Required: User.id no longer has default
      email: 'emma.wilson@email.com',
      fullName: 'Emma Wilson',
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  })

  // 3. Seed Customer Addresses
  console.log('🏠 Creating customer addresses...')
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      firstName: 'Sophia',
      lastName: 'Chen',
      addressLine1: '123 Fashion Avenue',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      phone: '+1-555-0123',
      isDefault: true,
    },
  })

  const address2 = await prisma.address.create({
    data: {
      userId: customer2.id,
      firstName: 'Maria',
      lastName: 'Garcia',
      addressLine1: '456 Style Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'United States',
      phone: '+1-555-0124',
      isDefault: true,
    },
  })

  const address3 = await prisma.address.create({
    data: {
      userId: customer3.id,
      firstName: 'Emma',
      lastName: 'Wilson',
      addressLine1: '789 Wellness Way',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'United States',
      phone: '+1-555-0125',
      isDefault: true,
    },
  })

  // 4. Seed Premium Waist Trainer Products
  console.log('🏋️‍♀️ Creating premium waist trainer products...')

  const products = [
    {
      name: 'Sculpt & Define Premium Waist Trainer',
      slug: 'sculpt-define-premium-waist-trainer',
      shortDescription: 'Professional-grade waist sculpting with advanced compression technology',
      description: 'Transform your silhouette with our Sculpt & Define Premium Waist Trainer. Featuring advanced dual-layer compression technology, this trainer provides maximum waist sculpting while maintaining comfort for all-day wear. Perfect for postpartum recovery and everyday waist training.',
      basePrice: 89.99,
      compareAtPrice: 129.99,
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Workout Performance Waist Trainer',
      slug: 'workout-performance-waist-trainer',
      shortDescription: 'High-intensity workout companion with thermal activation',
      description: 'Engineered for serious fitness enthusiasts, the Workout Performance Waist Trainer features thermal activation technology that increases sweat production by up to 40%. The flexible boning allows full range of motion while providing core support during intense workouts.',
      basePrice: 79.99,
      compareAtPrice: 119.99,
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Everyday Comfort Waist Cincher',
      slug: 'everyday-comfort-waist-cincher',
      shortDescription: 'Discrete comfort for daily waist training and posture support',
      description: 'Experience the perfect balance of comfort and effectiveness with our Everyday Comfort Waist Cincher. Made with breathable, lightweight materials, this trainer can be worn discreetly under clothing for up to 8 hours. Ideal for beginners and daily waist training.',
      basePrice: 69.99,
      compareAtPrice: 99.99,
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Professional Grade Steel Boned Corset',
      slug: 'professional-grade-steel-boned-corset',
      shortDescription: 'Traditional steel-boned corset for maximum waist reduction',
      description: 'Our Professional Grade Steel Boned Corset represents the pinnacle of waist training technology. Featuring 12 spiral steel bones and premium cotton lining, this corset provides exceptional waist reduction while ensuring proper posture and back support.',
      basePrice: 149.99,
      compareAtPrice: 199.99,
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Thermal Sweat Belt Waist Trainer',
      slug: 'thermal-sweat-belt-waist-trainer',
      shortDescription: 'Neoprene thermal belt for enhanced sweat and detoxification',
      description: 'Maximize your workout results with the Thermal Sweat Belt Waist Trainer. The premium neoprene material creates a thermal effect that increases core temperature, promoting sweat production and toxin release. Perfect for gym sessions and cardio workouts.',
      basePrice: 59.99,
      compareAtPrice: 89.99,
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Postpartum Recovery Waist Trainer',
      slug: 'postpartum-recovery-waist-trainer',
      shortDescription: 'Gentle support designed for postpartum body recovery',
      description: 'Specially designed for new mothers, the Postpartum Recovery Waist Trainer provides gentle compression to support abdominal muscle recovery. The adjustable design accommodates changing body shapes during the postpartum period while promoting proper posture.',
      basePrice: 94.99,
      compareAtPrice: 139.99,
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Steel Boned Classic Waist Trainer',
      slug: 'steel-boned-classic-waist-trainer',
      shortDescription: 'Timeless steel-boned design for dramatic waist shaping',
      description: 'The Steel Boned Classic Waist Trainer combines traditional corsetry with modern comfort. Featuring 10 flexible steel bones and a classic silhouette, this trainer delivers dramatic waist reduction while allowing comfortable movement for extended wear.',
      basePrice: 109.99,
      compareAtPrice: 159.99,
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Sport Compression Performance Trainer',
      slug: 'sport-compression-performance-trainer',
      shortDescription: 'Athletic-grade compression for peak performance and recovery',
      description: 'Engineered for athletes and fitness enthusiasts, the Sport Compression Performance Trainer provides medical-grade compression to enhance performance and accelerate recovery. The moisture-wicking fabric keeps you dry during intense training sessions.',
      basePrice: 84.99,
      compareAtPrice: 124.99,
      status: ProductStatus.ACTIVE,
    },
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    })
    createdProducts.push(product)
  }

  // 5. Seed Product Variants
  console.log('📏 Creating product variants...')
  const sizes = ['XS', 'S', 'M', 'L', 'XL']
  const compressionLevels = ['LIGHT', 'MEDIUM', 'HIGH']

  const variants = []
  for (const product of createdProducts) {
    const productCode = product.slug.split('-').slice(0, 2).join('').toUpperCase()
    for (const size of sizes) {
      for (const compression of compressionLevels) {
        // Generate unique SKU using timestamp and random number
        const timestamp = Date.now().toString().slice(-6)
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        const sku = `LWL-${productCode}-${timestamp}-${random}`

        const variant = await prisma.productVariant.upsert({
          where: { sku },
          update: {
            productId: product.id,
            size,
            compressionLevel: compression,
            color: 'Black',
            stockQuantity: Math.floor(Math.random() * 20) + 5, // 5-24 units
          },
          create: {
            productId: product.id,
            size,
            compressionLevel: compression,
            color: 'Black',
            sku,
            stockQuantity: Math.floor(Math.random() * 20) + 5, // 5-24 units
          },
        })
        variants.push(variant)
      }
    }
  }

  // 6. Seed Product Images
  console.log('📸 Creating product images...')
  for (const product of createdProducts) {
    const productVariants = variants.filter(v => v.productId === product.id)

    // Main product image
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `/images/products/${product.slug}-main.jpg`,
        storagePath: `products/${product.id}/main/${product.slug}-main.jpg`,
        altText: `${product.name} - Main View`,
        imageType: 'main',
        sortOrder: 0,
      },
    })

    // Gallery images
    for (let i = 1; i <= 3; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `/images/products/${product.slug}-gallery-${i}.jpg`,
          storagePath: `products/${product.id}/gallery/${product.slug}-gallery-${i}.jpg`,
          altText: `${product.name} - Gallery View ${i}`,
          imageType: 'gallery',
          sortOrder: i,
        },
      })
    }

    // Variant-specific images (for first 2 variants)
    for (let i = 0; i < Math.min(2, productVariants.length); i++) {
      const variant = productVariants[i]
      await prisma.productImage.create({
        data: {
          productId: product.id,
          variantId: variant.id,
          url: `/images/products/${product.slug}-${variant.size}-${variant.compressionLevel}.jpg`,
          storagePath: `products/${product.id}/variants/${product.slug}-${variant.size}-${variant.compressionLevel}.jpg`,
          altText: `${product.name} - Size ${variant.size}, ${variant.compressionLevel} Compression`,
          imageType: 'variant',
          sortOrder: 0,
        },
      })
    }
  }

  // 7. Seed Wishlist Items
  console.log('❤️ Creating wishlist items...')
  const wishlistItems = [
    { userId: customer1.id, productId: createdProducts[0].id },
    { userId: customer1.id, productId: createdProducts[2].id },
    { userId: customer2.id, productId: createdProducts[1].id },
    { userId: customer2.id, productId: createdProducts[4].id },
    { userId: customer3.id, productId: createdProducts[3].id },
  ]

  for (const item of wishlistItems) {
    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: item.userId,
          productId: item.productId,
        },
      },
      update: {},
      create: item,
    })
  }

  // 8. Seed Cart Items
  console.log('🛒 Creating cart items...')
  const cartItems = [
    { userId: customer1.id, variantId: variants[0].id, quantity: 1 },
    { userId: customer1.id, variantId: variants[5].id, quantity: 2 },
    { userId: customer2.id, variantId: variants[10].id, quantity: 1 },
    { userId: customer3.id, variantId: variants[15].id, quantity: 1 },
  ]

  for (const item of cartItems) {
    await prisma.cartItem.upsert({
      where: {
        userId_variantId: {
          userId: item.userId,
          variantId: item.variantId,
        },
      },
      update: {},
      create: item,
    })
  }

  // 9. Seed Orders
  console.log('📦 Creating orders...')
  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      addressId: address1.id,
      subtotal: 179.98,
      shippingFee: 10.00,
      total: 189.98,
      paymentMethod: PaymentMethod.CASH_APP,
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.PROCESSING,
    },
  })

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      addressId: address2.id,
      subtotal: 149.99,
      shippingFee: 10.00,
      total: 159.99,
      paymentMethod: PaymentMethod.PAYPAL,
      paymentStatus: PaymentStatus.PENDING,
      fulfillmentStatus: FulfillmentStatus.PENDING,
    },
  })

  const order3 = await prisma.order.create({
    data: {
      userId: customer3.id,
      addressId: address3.id,
      subtotal: 209.98,
      shippingFee: 10.00,
      total: 219.98,
      paymentMethod: PaymentMethod.CASH_APP,
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.SHIPPED,
    },
  })

  // 10. Seed Order Items
  console.log('📋 Creating order items...')
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: createdProducts[0].id,
        variantId: variants[0].id,
        quantity: 1,
        unitPrice: 89.99,
      },
      {
        orderId: order1.id,
        productId: createdProducts[1].id,
        variantId: variants[5].id,
        quantity: 1,
        unitPrice: 79.99,
      },
      {
        orderId: order2.id,
        productId: createdProducts[3].id,
        variantId: variants[10].id,
        quantity: 1,
        unitPrice: 149.99,
      },
      {
        orderId: order3.id,
        productId: createdProducts[2].id,
        variantId: variants[15].id,
        quantity: 1,
        unitPrice: 69.99,
      },
      {
        orderId: order3.id,
        productId: createdProducts[4].id,
        variantId: variants[20].id,
        quantity: 2,
        unitPrice: 59.99,
      },
    ],
  })

  // 11. Seed Payment Proofs
  console.log('💳 Creating payment proofs...')
  await prisma.paymentProof.createMany({
    data: [
      {
        orderId: order1.id,
        imageUrl: '/payment-proofs/order-1-cashapp.jpg',
        status: PaymentProofStatus.VERIFIED,
      },
      {
        orderId: order2.id,
        imageUrl: '/payment-proofs/order-2-paypal.jpg',
        status: PaymentProofStatus.PENDING,
      },
      {
        orderId: order3.id,
        imageUrl: '/payment-proofs/order-3-cashapp.jpg',
        status: PaymentProofStatus.VERIFIED,
      },
    ],
  })

  // 12. Seed Shipments
  console.log('🚚 Creating shipments...')
  await prisma.shipment.createMany({
    data: [
      {
        orderId: order1.id,
        carrier: 'USPS',
        trackingNumber: 'US920550000000000000001',
        shippedAt: new Date(),
      },
      {
        orderId: order3.id,
        carrier: 'FedEx',
        trackingNumber: 'FDX123456789012345',
        shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ],
  })

  console.log('✅ Database seeding completed successfully!')
  console.log(`
📊 Seeding Summary:
- Admin User: 1
- Customer Users: 3
- Addresses: 3
- Products: 8
- Product Variants: ${variants.length}
- Product Images: ${createdProducts.length * 5} (approximately)
- Wishlist Items: 5
- Cart Items: 4
- Orders: 3
- Order Items: 5
- Payment Proofs: 3
- Shipments: 2

🎯 Ready for development!
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
