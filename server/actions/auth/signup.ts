'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { signupSchema, type SignupFormData } from '@/lib/validators/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sendWelcomeEmail } from '@/lib/services/email/email-triggers'

export async function signup(formData: SignupFormData) {
  try {
    // Validate input
    const validatedData = signupSchema.parse(formData)

    // Create Supabase client
    const supabase = await createClient()

    // Step 1: Create Supabase Auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
        }
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        return {
          success: false,
          error: 'An account with this email already exists. Please sign in instead.'
        }
      }
      return {
        success: false,
        error: 'Failed to create account. Please try again.'
      }
    }

    // Step 2: Create or upsert Prisma User
    if (authData.user?.id) {
      try {
        await prisma.user.upsert({
          where: { id: authData.user.id },
          update: {
            email: validatedData.email,
            fullName: `${validatedData.firstName} ${validatedData.lastName}`,
            updatedAt: new Date()
          },
          create: {
            id: authData.user.id,
            email: validatedData.email,
            fullName: `${validatedData.firstName} ${validatedData.lastName}`,
            role: 'CUSTOMER'
          }
        })
      } catch (prismaError) {
        console.error('Prisma user sync error:', prismaError)
        // Continue with auth flow even if Prisma sync fails temporarily
      }
    }

    // Step 3: Send welcome email (non-blocking)
    // Send welcome email immediately after successful signup
    sendWelcomeEmail(validatedData.firstName, validatedData.email)

    // Step 4: Email verification is handled automatically by Supabase
    // The user will receive a verification email

    revalidatePath('/')
    
    return {
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
      requiresEmailVerification: true
    }

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof Error && error.message.includes('Passwords do not match')) {
      return {
        success: false,
        error: 'Passwords do not match'
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
