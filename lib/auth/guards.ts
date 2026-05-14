import 'server-only'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: 'CUSTOMER' | 'ADMIN'
  emailVerified: boolean
  createdAt: Date
}

/**
 * Validates user session and returns user data with role
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    // Use getClaims() for secure server-side validation (per Supabase best practices)
    const { data: claims, error } = await supabase.auth.getClaims()

    if (error || !claims?.claims?.email) {
      return null
    }

    // Get user role from Prisma
    const dbUser = await prisma.user.findUnique({
      where: { email: claims.claims.email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    })

    if (!dbUser) {
      return null
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      fullName: dbUser.fullName,
      role: dbUser.role,
      emailVerified: dbUser.emailVerified,
      createdAt: dbUser.createdAt
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
}

/**
 * Check if user has customer role
 */
export async function isCustomer(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'CUSTOMER'
}

/**
 * Check if user's email is verified
 */
export async function isEmailVerified(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.emailVerified === true
}

/**
 * Role-based access control helpers
 */
export const authGuards = {
  /**
   * Require user to be authenticated
   */
  requireAuth: async (): Promise<{ success: boolean; user: AuthUser | null }> => {
    const user = await getCurrentUser()
    return {
      success: user !== null,
      user
    }
  },

  /**
   * Require user to have admin role
   */
  requireAdmin: async (): Promise<{ success: boolean; user: AuthUser | null }> => {
    const user = await getCurrentUser()
    return {
      success: user?.role === 'ADMIN',
      user
    }
  },

  /**
   * Require user to have customer role
   */
  requireCustomer: async (): Promise<{ success: boolean; user: AuthUser | null }> => {
    const user = await getCurrentUser()
    return {
      success: user?.role === 'CUSTOMER',
      user
    }
  },

  /**
   * Require email verification
   */
  requireEmailVerified: async (): Promise<{ success: boolean; user: AuthUser | null }> => {
    const user = await getCurrentUser()
    return {
      success: user?.emailVerified === true,
      user
    }
  }
}
