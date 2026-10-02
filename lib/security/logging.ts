/**
 * Security Logging Strategy (Minimal Phase 1)
 * 
 * Logs important security events without exposing sensitive data:
 * - Failed login attempts
 * - Failed payment verification attempts  
 * - Invalid order creation attempts
 * 
 * Never logs: passwords, tokens, personal data, payment details
 */

export interface SecurityLogEntry {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR'
  category: 'AUTH' | 'PAYMENT' | 'ORDER' | 'ADMIN' | 'SYSTEM'
  event: string
  userId?: string
  email?: string // Only for auth events, never full user data
  ip?: string
  userAgent?: string
  details?: Record<string, unknown> // Sanitized details, never sensitive data
}

/**
 * Log security event to console (can be extended to external logging service)
 */
function logSecurityEvent(entry: SecurityLogEntry): void {
  // Format for production logging
  const logMessage = JSON.stringify({
    ...entry,
    // Ensure no sensitive data is logged
    details: entry.details ? sanitizeLogDetails(entry.details) : undefined
  })
  
  // Log with appropriate level
  switch (entry.level) {
    case 'ERROR':
      console.error(`[SECURITY] ${logMessage}`)
      break
    case 'WARN':
      console.warn(`[SECURITY] ${logMessage}`)
      break
    case 'INFO':
    default:
      console.log(`[SECURITY] ${logMessage}`)
      break
  }
}

/**
 * Sanitize log details to remove sensitive information
 */
function sanitizeLogDetails(details: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'creditCard', 'ssn',
    'bankAccount', 'routing', 'cvv', 'expiry', 'pin'
  ]
  
  const sanitized: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(details)) {
    // Check if key contains sensitive information
    const isSensitive = sensitiveKeys.some(sensitiveKey => 
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    )
    
    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'string' && value.length > 200) {
      // Truncate long strings
      sanitized[key] = value.substring(0, 200) + '...'
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

/**
 * Log failed login attempt
 */
export function logFailedLogin(
  email: string,
  ip?: string,
  userAgent?: string,
  reason?: string
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'WARN',
    category: 'AUTH',
    event: 'FAILED_LOGIN',
    email: email.toLowerCase(), // Normalize for consistent logging
    ip,
    userAgent,
    details: reason ? { reason } : undefined
  })
}

/**
 * Log successful login
 */
export function logSuccessfulLogin(
  userId: string,
  email: string,
  ip?: string,
  userAgent?: string
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    category: 'AUTH',
    event: 'SUCCESSFUL_LOGIN',
    userId,
    email: email.toLowerCase(),
    ip,
    userAgent
  })
}

/**
 * Log failed payment verification attempt
 */
export function logFailedPaymentVerification(
  userId: string,
  orderId: string,
  reason: string,
  ip?: string
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'WARN',
    category: 'PAYMENT',
    event: 'FAILED_PAYMENT_VERIFICATION',
    userId,
    ip,
    details: {
      orderId,
      reason
    }
  })
}

/**
 * Log successful payment verification
 */
export function logSuccessfulPaymentVerification(
  userId: string,
  orderId: string,
  adminId: string,
  ip?: string
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    category: 'PAYMENT',
    event: 'SUCCESSFUL_PAYMENT_VERIFICATION',
    userId,
    ip,
    details: {
      orderId,
      verifiedBy: adminId
    }
  })
}

/**
 * Log invalid order creation attempt
 */
export function logInvalidOrderCreation(
  userId: string,
  reason: string,
  details?: Record<string, unknown>,
  ip?: string
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'WARN',
    category: 'ORDER',
    event: 'INVALID_ORDER_CREATION',
    userId,
    ip,
    details: {
      reason,
      ...sanitizeLogDetails(details || {})
    }
  })
}

/**
 * Log successful order creation
 */
export function logOrderCreation(
  userId: string,
  orderId: string,
  totalAmount: number,
  ip?: string
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    category: 'ORDER',
    event: 'ORDER_CREATED',
    userId,
    ip,
    details: {
      orderId,
      totalAmount // Safe to log amount, not payment details
    }
  })
}

/**
 * Log admin action
 */
export function logAdminAction(
  adminId: string,
  action: string,
  targetResource?: string,
  targetId?: string,
  details?: Record<string, unknown>
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    category: 'ADMIN',
    event: 'ADMIN_ACTION',
    userId: adminId,
    details: sanitizeLogDetails({
      action,
      targetResource,
      targetId,
      ...details
    })
  })
}

/**
 * Log security violation
 */
export function logSecurityViolation(
  event: string,
  userId?: string,
  ip?: string,
  details?: Record<string, unknown>
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    category: 'SYSTEM',
    event: 'SECURITY_VIOLATION',
    userId,
    ip,
    details: sanitizeLogDetails(details || {})
  })
}

/**
 * Log rate limit violation
 */
export function logRateLimitViolation(
  identifier: string,
  actionType: string,
  ip?: string
): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    level: 'WARN',
    category: 'SYSTEM',
    event: 'RATE_LIMIT_VIOLATION',
    details: {
      identifier,
      actionType
    },
    ip
  })
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Try various headers for real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (clientIP) {
    return clientIP
  }
  
  // Fallback to request IP (may not be reliable in production)
  return request.headers.get('host') || 'unknown'
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown'
}
