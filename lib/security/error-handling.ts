/**
 * Standardized Error Handling System
 * 
 * All backend errors must:
 * - Be user-safe (no technical jargon)
 * - Not expose DB internals
 * - Not expose stack traces
 * - Return consistent structure
 */

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  statusCode: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

/**
 * Standard error codes for consistent API responses
 */
export const ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Business Rules
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  ORDER_CANNOT_BE_CANCELLED: 'ORDER_CANNOT_BE_CANCELLED',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: 'Please log in to continue',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action',
  [ERROR_CODES.SESSION_EXPIRED]: 'Your session has expired. Please log in again',
  
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again',
  [ERROR_CODES.INVALID_INPUT]: 'The information provided is invalid',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Required information is missing',
  
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found',
  [ERROR_CODES.ALREADY_EXISTS]: 'This resource already exists',
  [ERROR_CODES.RESOURCE_CONFLICT]: 'This action conflicts with existing data',
  
  [ERROR_CODES.INSUFFICIENT_STOCK]: 'This item is out of stock or has limited availability',
  [ERROR_CODES.PAYMENT_REQUIRED]: 'Payment is required to complete this action',
  [ERROR_CODES.ORDER_CANNOT_BE_CANCELLED]: 'This order cannot be cancelled at this time',
  
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later',
  [ERROR_CODES.TOO_MANY_ATTEMPTS]: 'Too many failed attempts. Please try again later',
  
  [ERROR_CODES.INTERNAL_ERROR]: 'Something went wrong. Please try again',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable. Please try again later',
  [ERROR_CODES.DATABASE_ERROR]: 'Data processing error. Please try again',
} as const

/**
 * HTTP status codes for different error types
 */
export const ERROR_STATUS_CODES = {
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.SESSION_EXPIRED]: 401,
  
  [ERROR_CODES.VALIDATION_ERROR]: 400,
  [ERROR_CODES.INVALID_INPUT]: 400,
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 400,
  
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.ALREADY_EXISTS]: 409,
  [ERROR_CODES.RESOURCE_CONFLICT]: 409,
  
  [ERROR_CODES.INSUFFICIENT_STOCK]: 400,
  [ERROR_CODES.PAYMENT_REQUIRED]: 402,
  [ERROR_CODES.ORDER_CANNOT_BE_CANCELLED]: 400,
  
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 429,
  [ERROR_CODES.TOO_MANY_ATTEMPTS]: 429,
  
  [ERROR_CODES.INTERNAL_ERROR]: 500,
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 503,
  [ERROR_CODES.DATABASE_ERROR]: 500,
} as const

/**
 * Create standardized API error
 */
export function createApiError(
  code: keyof typeof ERROR_CODES,
 customMessage?: string,
 details?: Record<string, unknown>
): ApiError {
  return {
    code,
    message: customMessage || ERROR_MESSAGES[code],
    details,
    statusCode: ERROR_STATUS_CODES[code]
  }
}

/**
 * Create successful API response
 */
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

/**
 * Create error API response
 */
export function createErrorResponse(
  code: keyof typeof ERROR_CODES,
  customMessage?: string,
  details?: Record<string, unknown>
): ApiResponse {
  return {
    success: false,
    error: createApiError(code, customMessage, details)
  }
}

/**
 * Handle and standardize any error
 */
export function handleError(error: unknown): ApiResponse {
  console.error('API Error:', error) // Log for debugging, but don't expose to user
  
  // Handle validation errors
  if (error instanceof Error && error.message.includes('Validation failed:')) {
    return createErrorResponse('VALIDATION_ERROR', error.message.replace('Validation failed: ', ''))
  }
  
  // Handle known error codes
  if (error instanceof Error && Object.values(ERROR_CODES).includes(error.message as keyof typeof ERROR_CODES)) {
    return createErrorResponse(error.message as keyof typeof ERROR_CODES)
  }
  
  // Handle Prisma errors safely
  if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
    // Don't expose Prisma-specific error details
    return createErrorResponse('DATABASE_ERROR')
  }
  
  // Handle all other errors
  return createErrorResponse('INTERNAL_ERROR')
}

/**
 * Common error creators for convenience
 */
export const ErrorCreators = {
  unauthorized: (message?: string) => createErrorResponse('UNAUTHORIZED', message),
  forbidden: (message?: string) => createErrorResponse('FORBIDDEN', message),
  notFound: (resource?: string) => createErrorResponse('NOT_FOUND', 
    resource ? `${resource} not found` : undefined),
  validation: (message: string) => createErrorResponse('VALIDATION_ERROR', message),
  insufficientStock: (item?: string) => createErrorResponse('INSUFFICIENT_STOCK',
    item ? `${item} is out of stock` : undefined),
  rateLimit: (message?: string) => createErrorResponse('RATE_LIMIT_EXCEEDED', message),
  internal: () => createErrorResponse('INTERNAL_ERROR'),
} as const

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: keyof typeof ERROR_CODES }

export function createSuccessResult<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

export function createErrorResult(
  code: keyof typeof ERROR_CODES,
  customMessage?: string
): ActionResult<never> {
  return {
    success: false,
    error: customMessage || ERROR_MESSAGES[code],
    code,
  }
}

/**
 * Server action error handler
 * Wraps server actions with consistent error handling
 * Returns ActionResult<R> instead of throwing
 */
export function withErrorHandling<T extends unknown[], R>(
  action: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<ActionResult<R>> => {
    try {
      const data = await action(...args)
      return createSuccessResult(data)
    } catch (error) {
      const errorResponse = handleError(error)
      return createErrorResult(
        (errorResponse.error?.code as keyof typeof ERROR_CODES) || 'INTERNAL_ERROR',
        errorResponse.error?.message
      )
    }
  }
}

/**
 * Wraps a server action that may throw errors and returns ActionResult<R>
 * Use for legacy action files that throw instead of returning success/error objects
 */
export function tryAction<T extends unknown[], R>(
  action: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<ActionResult<R>> => {
    try {
      const data = await action(...args)
      return createSuccessResult(data)
    } catch (error) {
      const errorResponse = handleError(error)
      return createErrorResult(
        (errorResponse.error?.code as keyof typeof ERROR_CODES) || 'INTERNAL_ERROR',
        errorResponse.error?.message
      )
    }
  }
}

/**
 * API route error handler
 * Returns Next.js response with proper status and JSON format
 */
export function handleApiRouteError(error: unknown): Response {
  const errorResponse = handleError(error)
  
  return new Response(JSON.stringify(errorResponse), {
    status: errorResponse.error?.statusCode || 500,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
