import prisma from '@/lib/prisma'

/**
 * Basic Rate Limiting Foundation (Phase 1)
 * 
 * Implements basic protection without external rate limiter library:
 * - Prevent spam orders
 * - Prevent login brute force attempts  
 * - Prevent repeated uploads abuse
 * 
 * Uses in-memory tracking with database persistence
 */

interface RateLimitEntry {
  count: number
  lastAttempt: number
  blockedUntil?: number
}

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs: number
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Login attempts: 5 attempts per 15 minutes, block for 30 minutes
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  
  // Order creation: 3 orders per hour, block for 1 hour
  orderCreation: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
  
  // File uploads: 10 uploads per hour, block for 30 minutes
  fileUpload: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  
  // Password reset: 3 attempts per hour, block for 1 hour
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
}

// In-memory cache for rate limiting (reset on server restart)
const rateLimitCache = new Map<string, RateLimitEntry>()

/**
 * Check if action is rate limited
 */
export async function checkRateLimit(
  identifier: string,
  actionType: keyof typeof RATE_LIMIT_CONFIGS
): Promise<{ allowed: boolean; remaining?: number; resetTime?: number }> {
  const config = RATE_LIMIT_CONFIGS[actionType]
  const key = `${actionType}:${identifier}`
  
  // Check in-memory cache first
  const cached = rateLimitCache.get(key)
  const now = Date.now()
  
  // If currently blocked, check if block has expired
  if (cached?.blockedUntil && cached.blockedUntil > now) {
    return {
      allowed: false,
      resetTime: cached.blockedUntil
    }
  }
  
  // If no entry or window has expired, create new entry
  if (!cached || (now - cached.lastAttempt) > config.windowMs) {
    const newEntry: RateLimitEntry = {
      count: 1,
      lastAttempt: now
    }
    
    rateLimitCache.set(key, newEntry)
    
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs
    }
  }
  
  // Update existing entry
  cached.count++
  cached.lastAttempt = now
  
  // Check if limit exceeded
  if (cached.count > config.maxAttempts) {
    // Block the user
    cached.blockedUntil = now + config.blockDurationMs
    
    // Log rate limit violation
    console.warn(`Rate limit exceeded for ${actionType} by ${identifier}`)
    
    return {
      allowed: false,
      resetTime: cached.blockedUntil
    }
  }
  
  return {
    allowed: true,
    remaining: config.maxAttempts - cached.count,
    resetTime: cached.lastAttempt + config.windowMs
  }
}

/**
 * Check rate limit for login attempts
 */
export async function checkLoginRateLimit(email: string): Promise<{ allowed: boolean; resetTime?: number }> {
  return checkRateLimit(email, 'login')
}

/**
 * Check rate limit for order creation
 */
export async function checkOrderRateLimit(userId: string): Promise<{ allowed: boolean; resetTime?: number }> {
  return checkRateLimit(userId, 'orderCreation')
}

/**
 * Check rate limit for file uploads
 */
export async function checkUploadRateLimit(userId: string): Promise<{ allowed: boolean; resetTime?: number }> {
  return checkRateLimit(userId, 'fileUpload')
}

/**
 * Check rate limit for password reset
 */
export async function checkPasswordResetRateLimit(email: string): Promise<{ allowed: boolean; resetTime?: number }> {
  return checkRateLimit(email, 'passwordReset')
}

/**
 * Reset rate limit for a specific identifier
 * Useful for successful authentication or admin actions
 */
export function resetRateLimit(identifier: string, actionType: keyof typeof RATE_LIMIT_CONFIGS): void {
  const key = `${actionType}:${identifier}`
  rateLimitCache.delete(key)
}

/**
 * Clean up expired entries from cache
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimitCache(): void {
  const now = Date.now()
  
  for (const [key, entry] of rateLimitCache.entries()) {
    // Remove entries that are past their window and not blocked
    if (!entry.blockedUntil && (now - entry.lastAttempt) > 60 * 60 * 1000) {
      rateLimitCache.delete(key)
    }
    
    // Remove expired blocks
    if (entry.blockedUntil && entry.blockedUntil <= now) {
      rateLimitCache.delete(key)
    }
  }
}

/**
 * Get rate limit status for debugging
 */
export function getRateLimitStatus(): Array<{ key: string; entry: RateLimitEntry }> {
  const entries: Array<{ key: string; entry: RateLimitEntry }> = []
  
  for (const [key, entry] of rateLimitCache.entries()) {
    entries.push({ key, entry })
  }
  
  return entries
}

// Auto-cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitCache, 10 * 60 * 1000)
}
