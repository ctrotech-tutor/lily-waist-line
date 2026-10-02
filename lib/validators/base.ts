import { z } from 'zod'

/**
 * Base validation utilities with strict security rules
 * 
 * Core principles:
 * - Always trim strings
 * - Reject unknown fields
 * - Strict typing only
 * - No loose validation allowed
 */

// Base string schema with automatic trimming
export const baseStringSchema = z.string().trim()

// Base email schema with trimming and validation
export const baseEmailSchema = z.string().trim().email('Invalid email address')

// Base password schema with security requirements
export const basePasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')

// Base UUID/CUID schema for IDs
export const baseIdSchema = z.string().min(1, 'ID is required').cuid('Invalid ID format')

// Base numeric schema with positive validation
export const basePositiveNumberSchema = z.number().positive('Value must be positive')

// Base boolean schema
export const baseBooleanSchema = z.boolean()

// Base date schema
export const baseDateSchema = z.string().datetime('Invalid date format')

// Base pagination schema
export const basePaginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20),
})

// Base search schema with sanitization
export const baseSearchSchema = z.object({
  q: z.string().trim().min(1, 'Search query is required').max(100, 'Search query too long'),
})

// Strict object schema that rejects unknown fields
export function strictObject<T extends z.ZodRawShape>(shape: T): z.ZodObject<T> {
  return z.object(shape).strict()
}

// Sanitization middleware for arrays
export const sanitizeArray = <T>(schema: z.ZodType<T>) => z.array(schema).transform((items) => 
  items.filter((item, index, arr) => arr.indexOf(item) === index) // Remove duplicates
)

// File validation schema
export const baseFileSchema = z.instanceof(File)
  .refine((file) => file.size > 0, 'File cannot be empty')
  .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')

// Image file validation
export const baseImageFileSchema = baseFileSchema.refine(
  (file) => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
  'Invalid file type. Only PNG, JPEG, and WebP images are allowed.'
)

// Base address components
export const baseAddressComponents = {
  street: z.string().trim().min(1, 'Street address is required').max(200, 'Street address too long'),
  city: z.string().trim().min(1, 'City is required').max(100, 'City name too long'),
  state: z.string().trim().min(1, 'State is required').max(100, 'State name too long'),
  postalCode: z.string().trim().min(1, 'Postal code is required').max(20, 'Postal code too long'),
  country: z.string().trim().min(1, 'Country is required').max(100, 'Country name too long'),
}

// Base phone number schema
export const basePhoneSchema = z.string().trim().regex(
  /^\+?[\d\s\-\(\)]+$/,
  'Invalid phone number format'
).min(10, 'Phone number must be at least 10 digits')

// Base name schema
export const baseNameSchema = z.string().trim()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

// Base currency schema
export const baseCurrencySchema = z.number()
  .positive('Amount must be positive')
  .max(999999.99, 'Amount exceeds maximum limit')
  .transform((val) => Math.round(val * 100) / 100) // Round to 2 decimal places

// Base status schema for common status fields
export const baseStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'CANCELLED'])

// Base role schema
export const baseRoleSchema = z.enum(['CUSTOMER', 'ADMIN'])

// Error response schema for consistent API responses
export const baseErrorResponseSchema = strictObject({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional(), // For additional error context
})

// Success response schema
export const baseSuccessResponseSchema = strictObject({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
})

// Common validation error messages
export const VALIDATION_ERRORS = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_ID: 'Invalid ID format',
  INVALID_PHONE: 'Invalid phone number format',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  DUPLICATE_ENTRY: 'Duplicate entry not allowed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input provided',
} as const
