'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { signupSchema, type SignupFormData } from '@/lib/validators/auth'
import { revalidatePath } from 'next/cache'
import { getAppUrl } from '@/lib/utils/app-url'
import { sendWelcomeEmail } from '@/lib/services/email/email-triggers'
import { syncUserRoleToAuth } from '@/lib/auth/sync-role'

export async function signup(formData: SignupFormData) {
  try {
    const validatedData = signupSchema.parse(formData)

    const appUrl = getAppUrl()

    // Step 1: Create user via admin API + generate verification link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
        },
        redirectTo: `${appUrl}/auth/callback`,
      },
    })

    if (linkError) {
      if (linkError.message.includes('already exists') || linkError.message.includes('already registered')) {
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

    const authUserId = linkData.user?.id

    // Step 2: Create or upsert Prisma User
    if (authUserId) {
      try {
        await prisma.user.upsert({
          where: { id: authUserId },
          update: {
            email: validatedData.email,
            fullName: `${validatedData.firstName} ${validatedData.lastName}`,
            updatedAt: new Date()
          },
          create: {
            id: authUserId,
            email: validatedData.email,
            fullName: `${validatedData.firstName} ${validatedData.lastName}`,
            role: 'CUSTOMER'
          }
        })

        await syncUserRoleToAuth(authUserId, 'CUSTOMER')
      } catch (prismaError) {
        console.error('Prisma user sync error:', prismaError)
        // Continue with auth flow even if Prisma sync fails temporarily
      }
    }

    // Step 3: Send welcome email (non-blocking)
    sendWelcomeEmail(validatedData.firstName, validatedData.email)

    // Step 4: Send branded verification email with the action_link from generateLink
    let verificationEmailSent = false
    if (linkData?.properties?.action_link) {
      const [{ getVerificationEmailTemplate }, { getAppUrl }] = await Promise.all([
        import('@/lib/email/templates'),
        import('@/lib/utils/app-url'),
      ])
      const template = getVerificationEmailTemplate({
        appUrl: getAppUrl(),
        firstName: validatedData.firstName,
        email: validatedData.email,
        verificationLink: linkData.properties.action_link,
      })
      const { sendEmailAsync } = await import('@/lib/services/email/email-service')
      const delivery = await sendEmailAsync({ to: validatedData.email, subject: template.subject, html: template.html, text: template.text })
      verificationEmailSent = delivery.success
    }

    revalidatePath('/')
    
    return {
      success: true,
      emailDeliveryStatus: verificationEmailSent ? 'sent' as const : 'failed' as const,
      message: verificationEmailSent
        ? 'Account created. A verification email was accepted for delivery; check your inbox and spam folder.'
        : 'Account created, but the verification email could not be sent. Use the resend option on the next screen or contact support; do not create another account.',
      requiresEmailVerification: true
    }

  } catch (error) {
    console.error('Signup error:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation failed'
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
