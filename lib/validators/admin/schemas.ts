import { z } from 'zod'
import { 
  strictObject, 
  baseIdSchema, 
  basePositiveNumberSchema,
  baseCurrencySchema,
  baseStatusSchema,
  baseRoleSchema,
  basePaginationSchema,
  baseEmailSchema,
  basePhoneSchema,
  baseNameSchema,
} from '../base'

/**
 * Admin validation schemas with strict security rules
 * 
 * Security principles:
 * - Admin role validation required
 * - Strict input validation
 * - Audit trail support
 * - Business rule enforcement
 */

// Admin user query schema
export const adminUserQuerySchema = strictObject({
  userId: baseIdSchema,
})

// Admin user list schema
export const adminUserListSchema = strictObject({
  ...basePaginationSchema.shape,
  search: z.string().trim().max(100, 'Search query too long').optional(),
  role: baseRoleSchema.optional(),
  status: baseStatusSchema.optional(),
})

// Admin product update schema
export const adminProductUpdateSchema = strictObject({
  productId: baseIdSchema,
  name: z.string().trim().min(1, 'Product name is required').max(200, 'Product name too long').optional(),
  description: z.string().trim().max(2000, 'Description too long').optional(),
  price: baseCurrencySchema.optional(),
  compareAtPrice: baseCurrencySchema.optional(),
  stockQuantity: basePositiveNumberSchema.int().max(10000, 'Stock quantity too high').optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
})

// Admin settings update schema
export const adminSettingsUpdateSchema = strictObject({
  storeName: z.string().trim().min(1, 'Store name is required').max(100, 'Store name too long').optional(),
  storeEmail: baseEmailSchema.optional(),
  supportEmail: baseEmailSchema.optional(),
  supportPhone: basePhoneSchema.optional(),
  cashAppEnabled: z.boolean().optional(),
  paypalEnabled: z.boolean().optional(),
  cashAppHandle: z.string().trim().max(50, 'Cash App handle too long').optional(),
  paypalEmail: baseEmailSchema.optional(),
  maintenanceMode: z.boolean().optional(),
  newOrdersEnabled: z.boolean().optional(),
})

// Admin payment proof review schema
export const adminPaymentProofReviewSchema = strictObject({
  proofId: baseIdSchema,
  action: z.enum(['APPROVE', 'REJECT']),
  adminNote: z.string().trim().max(500, 'Note too long').optional(),
})

// Admin bulk operations schema
export const adminBulkOperationSchema = strictObject({
  operation: z.enum(['BULK_DELETE', 'BULK_UPDATE_STATUS', 'BULK_UPDATE_STOCK']),
  itemIds: z.array(baseIdSchema).min(1, 'At least one item must be selected').max(100, 'Cannot process more than 100 items at once'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  stockQuantity: basePositiveNumberSchema.int().optional(),
})

// Admin customer creation schema
export const adminCustomerCreateSchema = strictObject({
  firstName: baseNameSchema,
  lastName: baseNameSchema,
  email: baseEmailSchema,
  phone: basePhoneSchema.optional(),
  role: baseRoleSchema.default('CUSTOMER'),
})

// Admin order management schema
export const adminOrderManagementSchema = strictObject({
  orderId: baseIdSchema,
  action: z.enum(['MARK_PAID', 'CANCEL_ORDER', 'PROCESS_ORDER', 'SHIP_ORDER']),
  trackingNumber: z.string().trim().max(100, 'Tracking number too long').optional(),
  carrier: z.enum(['UPS', 'FedEx', 'USPS', 'DHL', 'OTHER']).optional(),
  adminNote: z.string().trim().max(500, 'Note too long').optional(),
})

// Export types
export type AdminUserQueryInput = z.infer<typeof adminUserQuerySchema>
export type AdminUserListInput = z.infer<typeof adminUserListSchema>
export type AdminProductUpdateInput = z.infer<typeof adminProductUpdateSchema>
export type AdminSettingsInput = z.infer<typeof adminSettingsUpdateSchema>
export type AdminPaymentProofReviewInput = z.infer<typeof adminPaymentProofReviewSchema>
export type AdminBulkOperationInput = z.infer<typeof adminBulkOperationSchema>
export type AdminCustomerCreateInput = z.infer<typeof adminCustomerCreateSchema>
export type AdminOrderManagementInput = z.infer<typeof adminOrderManagementSchema>

// Export all schemas as a collection
export const adminSchemas = {
  user: {
    query: adminUserQuerySchema,
    list: adminUserListSchema,
    create: adminCustomerCreateSchema,
  },
  product: {
    update: adminProductUpdateSchema,
  },
  settings: {
    update: adminSettingsUpdateSchema,
  },
  paymentProof: {
    review: adminPaymentProofReviewSchema,
  },
  bulk: adminBulkOperationSchema,
  order: adminOrderManagementSchema,
} as const
