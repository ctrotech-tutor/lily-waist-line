'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { loginSchema, type LoginFormData } from '@/lib/validators/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sendLoginAlertEmail } from '@/lib/services/email/email-triggers'

export async function login(formData: LoginFormData) {
  try {
    // Validate input
    const validatedData = loginSchema.parse(formData)

    // Create Supabase client
    const supabase = await createClient()

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Invalid email or password'
        }
      }
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Please verify your email before signing in',
          requiresEmailVerification: true
        }
      }
      return {
        success: false,
        error: 'Failed to sign in. Please try again.'
      }
    }

    // Successful login - send login alert email (non-blocking)
    if (data.user) {
      try {
        // Get user details from Prisma for personalization
        const user = await prisma.user.findUnique({
          where: { id: data.user.id },
          select: { fullName: true }
        })

        if (user) {
          const firstName = user.fullName.split(' ')[0] || 'there'
          const loginTime = new Date().toLocaleString()
          
          // Send login alert email asynchronously
          sendLoginAlertEmail(firstName, validatedData.email, loginTime)
        }
      } catch (error) {
        console.error('Failed to send login alert:', error)
        // Don't break login flow if email fails
      }
    }

    revalidatePath('/')
    
    return {
      success: true,
      message: 'Successfully signed in'
    }

  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
