import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { ZodSchema } from 'zod'
import { redirect } from 'next/navigation'
import { VALIDATION_ERRORS } from '@/lib/validators/base'

/**
 * Server Action Security Layer
 * 
 * Core security validation order:
 * 1. Session validation
 * 2. Role validation  
 * 3. Ownership validation
 * 4. Input schema validation
 * 
 * Never trust client inputs, frontend validation, request metadata, or user-provided IDs
 */

export interface SecurityContext {
  user: {
    id: string
    email: string
    role: 'CUSTOMER' | 'ADMIN'
  }
  session: Record<string, unknown>
}

export interface SecurityOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
  requireOwnership?: {
    resourceType: 'order' | 'address' | 'cart' | 'wishlist' | 'paymentProof'
    resourceId?: string
  }
  validateInput?: {
    schema: ZodSchema
    data: unknown
  }
}

/**
 * Main security validation function
 * Enforces all security checks in the correct order
 */
export async function validateServerAction(options: SecurityOptions): Promise<{
  context: SecurityContext
  validatedData?: unknown
}> {
  // Step 1: Session validation
  const context = await validateSession(options.requireAuth ?? true)
  
  // Step 2: Role validation
  if (options.requireAdmin) {
    await validateAdminRole(context)
  }
  
  // Step 3: Ownership validation
  if (options.requireOwnership) {
    await validateOwnership(context, options.requireOwnership)
  }
  
  // Step 4: Input schema validation
  let validatedData: unknown
  if (options.validateInput) {
    validatedData = await validateInputSchema(options.validateInput.schema, options.validateInput.data)
  }
  
  return { context, validatedData }
}

/**
 * Step 1: Session validation
 * Ensures user is authenticated and session is valid
 */
async function validateSession(required: boolean): Promise<SecurityContext> {
  const supabase = createClient()
  
  const { data: { user }, error } = await (await supabase).auth.getUser()
  
  if (required && !user) {
    redirect('/login')
  }
  
  if (!user) {
    throw new Error(VALIDATION_ERRORS.UNAUTHORIZED)
  }
  
  // Get user role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  })
  
  if (!dbUser) {
    throw new Error(VALIDATION_ERRORS.UNAUTHORIZED)
  }
  
  return {
    user: {
      id: user.id,
      email: user.email!,
      role: dbUser.role as 'CUSTOMER' | 'ADMIN'
    },
    session: user as unknown as Record<string, unknown>
  }
}

/**
 * Step 2: Role validation
 * Ensures user has required admin role
 */
async function validateAdminRole(context: SecurityContext): Promise<void> {
  if (context.user.role !== 'ADMIN') {
    throw new Error(VALIDATION_ERRORS.FORBIDDEN)
  }
}

/**
 * Step 3: Ownership validation
 * Ensures user owns the resource they're trying to access
 */
async function validateOwnership(
  context: SecurityContext, 
  ownership: NonNullable<SecurityOptions['requireOwnership']>
): Promise<void> {
  const { resourceType, resourceId } = ownership
  
  if (!resourceId) {
    throw new Error(VALIDATION_ERRORS.INVALID_INPUT)
  }
  
  let resource
  
  switch (resourceType) {
    case 'order':
      resource = await prisma.order.findUnique({
        where: { id: resourceId },
        select: { userId: true }
      })
      break
      
    case 'address':
      resource = await prisma.address.findUnique({
        where: { id: resourceId },
        select: { userId: true }
      })
      break
      
    case 'cart':
      resource = await prisma.cartItem.findUnique({
        where: { id: resourceId },
        select: { userId: true }
      })
      break
      
    case 'wishlist':
      resource = await prisma.wishlistItem.findUnique({
        where: { id: resourceId },
        select: { userId: true }
      })
      break
      
    case 'paymentProof':
      resource = await prisma.paymentProof.findUnique({
        where: { id: resourceId },
        include: {
          order: {
            select: { userId: true }
          }
        }
      })
      // For payment proofs, check order ownership
      if (resource && 'order' in resource) {
        resource = { userId: resource.order.userId }
      }
      break
      
    default:
      throw new Error(VALIDATION_ERRORS.INVALID_INPUT)
  }
  
  if (!resource) {
    throw new Error(VALIDATION_ERRORS.NOT_FOUND)
  }
  
  if (resource.userId !== context.user.id) {
    throw new Error(VALIDATION_ERRORS.FORBIDDEN)
  }
}

/**
 * Step 4: Input schema validation
 * Validates input against Zod schema with sanitization
 */
async function validateInputSchema(schema: ZodSchema, data: unknown): Promise<unknown> {
  try {
    return await schema.parseAsync(data)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Validation failed: ${error.message}`)
    }
    throw new Error(VALIDATION_ERRORS.INVALID_INPUT)
  }
}

/**
 * Helper function for common server action patterns
 */
export async function secureServerAction<T>(
  options: SecurityOptions,
  action: (context: SecurityContext, validatedData: T) => Promise<unknown>
): Promise<unknown> {
  try {
    const { context, validatedData } = await validateServerAction(options)
    return await action(context, validatedData as T)
  } catch (error) {
    // Log security violations
    console.error('Server action security violation:', error)
    throw error
  }
}

/**
 * Pre-built security configurations for common patterns
 */
export const SECURITY_CONFIGS = {
  // Customer accessing their own data
  customerOwnData: (resourceType: NonNullable<SecurityOptions['requireOwnership']>['resourceType'], resourceId: string) => ({
    requireAuth: true,
    requireAdmin: false,
    requireOwnership: { resourceType, resourceId }
  }),
  
  // Admin accessing any data
  adminAccess: () => ({
    requireAuth: true,
    requireAdmin: true
  }),
  
  // Public action with validation
  publicWithValidation: (schema: ZodSchema, data: unknown) => ({
    requireAuth: false,
    requireAdmin: false,
    validateInput: { schema, data }
  }),
  
  // Authenticated user with validation
  userWithValidation: (schema: ZodSchema, data: unknown) => ({
    requireAuth: true,
    requireAdmin: false,
    validateInput: { schema, data }
  }),
  
  // Admin with validation
  adminWithValidation: (schema: ZodSchema, data: unknown) => ({
    requireAuth: true,
    requireAdmin: true,
    validateInput: { schema, data }
  }) as const
} as const
