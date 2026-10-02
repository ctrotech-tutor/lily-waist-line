/**
 * Complete Security Layer Export
 * 
 * Exports all security components for backend hardening:
 * - Server Action Security (session, role, ownership, validation)
 * - Error Handling (user-safe, consistent structure)
 * - Rate Limiting (basic protection against abuse)
 * - Logging Strategy (security event tracking)
 * - Prisma Safety (database operation rules)
 */

// Core security validation
export * from './server-action-security'

// Error handling and standardization
export * from './error-handling'

// Rate limiting foundation
export * from './rate-limiting'

// Security logging
export * from './logging'

// Prisma safety rules
export * from './prisma-safety'

// Re-export commonly used combinations
export {
  validateServerAction,
  secureServerAction,
  SECURITY_CONFIGS,
  type SecurityContext,
  type SecurityOptions
} from './server-action-security'

export {
  createSuccessResponse,
  createErrorResponse,
  handleError,
  ErrorCreators,
  type ApiError,
  type ApiResponse
} from './error-handling'

export {
  checkRateLimit,
  checkLoginRateLimit,
  checkOrderRateLimit,
  checkUploadRateLimit,
  checkPasswordResetRateLimit,
  resetRateLimit
} from './rate-limiting'

export {
  logFailedLogin,
  logSuccessfulLogin,
  logFailedPaymentVerification,
  logSuccessfulPaymentVerification,
  logInvalidOrderCreation,
  logOrderCreation,
  logAdminAction,
  logSecurityViolation,
  logRateLimitViolation,
  getClientIP,
  getUserAgent
} from './logging'

export {
  SafeFinder,
  SafeUpdater,
  SafeDeleter,
  SafeCreator,
  StockValidator,
  safeTransaction
} from './prisma-safety'
