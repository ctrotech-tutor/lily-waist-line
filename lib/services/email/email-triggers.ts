import { sendEmailAsync } from './email-service'
import { getAppUrl } from '@/lib/utils/app-url'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { 
  getWelcomeEmailTemplate, 
  getOrderConfirmationTemplate,
  getPaymentReceivedTemplate,
  getPaymentRejectedTemplate,
  getShippingUpdateTemplate,
  getLoginAlertTemplate,
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
  getPasswordResetSuccessEmailTemplate,
  getPaymentInstructionsTemplate,
  getOrderProcessingTemplate,
  getOrderShippedTemplate,
  getOrderDeliveredTemplate,
  getOrderCancelledTemplate,
} from '@/lib/email/templates'

export const sendWelcomeEmail = async (firstName: string, email: string) => {
  try {
    const template = getWelcomeEmailTemplate({ firstName, email })
    
    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log('Welcome email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    // Don't throw - email failure shouldn't break business flow
  }
}

export const sendOrderConfirmationEmail = async (
  firstName: string,
  email: string,
  orderNumber: string,
  items: Array<{
    name: string
    quantity: number
    price: string
    size?: string
    compression?: string
  }>,
  subtotal: string,
  shipping: string,
  total: string,
  shippingAddress?: {
    name: string
    address: string
    city: string
    state: string
    country: string
    postalCode: string
  }
) => {
  try {
    const template = getOrderConfirmationTemplate({
      firstName,
      email,
      orderNumber,
      items,
      subtotal,
      shipping,
      total,
      shippingAddress,
    })
    
    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log('Order confirmation email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    // Don't throw - email failure shouldn't break business flow
  }
}

export const sendPaymentReceivedEmail = async (
  firstName: string,
  email: string,
  orderNumber: string,
  paymentMethod: string,
  amount: string,
  items: Array<{
    name: string
    quantity: number
  }>
) => {
  try {
    const template = getPaymentReceivedTemplate({
      firstName,
      email,
      orderNumber,
      paymentMethod,
      amount,
      items,
    })
    
    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log('Payment received email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send payment received email:', error)
    // Don't throw - email failure shouldn't break business flow
  }
}

export const sendPaymentRejectedEmail = async (
  firstName: string,
  email: string,
  orderNumber: string,
  paymentMethod: string,
  amount: string,
  items: Array<{
    name: string
    quantity: number
  }>,
  reason?: string
) => {
  try {
    const template = getPaymentRejectedTemplate({
      firstName,
      email,
      orderNumber,
      paymentMethod,
      amount,
      items,
      reason,
    })
    
    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log('Payment rejected email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send payment rejected email:', error)
    // Don't throw - email failure shouldn't break business flow
  }
}

export const sendShippingUpdateEmail = async (
  firstName: string,
  email: string,
  orderNumber: string,
  carrier: string,
  trackingNumber: string,
  estimatedDelivery: string,
  items: Array<{
    name: string
    quantity: number
  }>
) => {
  try {
    const template = getShippingUpdateTemplate({
      firstName,
      email,
      orderNumber,
      carrier,
      trackingNumber,
      estimatedDelivery,
      items,
    })
    
    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log('Shipping update email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send shipping update email:', error)
    // Don't throw - email failure shouldn't break business flow
  }
}

export const sendLoginAlertEmail = async (
  firstName: string,
  email: string,
  loginTime: string,
  loginLocation?: string,
  device?: string
) => {
  try {
    const template = getLoginAlertTemplate({
      firstName,
      email,
      loginTime,
      loginLocation,
      device,
    })
    
    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log('Login alert email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send login alert email:', error)
    // Don't throw - email failure shouldn't break business flow
  }
}

export const sendCustomVerificationEmail = async (
  firstName: string,
  email: string,
  _password?: string
) => {
  try {
    const appUrl = getAppUrl()

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      ...(_password ? { password: _password } : {}),
      options: {
        redirectTo: `${appUrl}/auth/callback`,
      },
    } as Parameters<typeof supabaseAdmin.auth.admin.generateLink>[0])

    if (error || !data?.properties?.action_link) {
      console.error('Failed to generate verification link:', error)
      return
    }

    const template = getVerificationEmailTemplate({
      firstName,
      email,
      verificationLink: data.properties.action_link,
    })

    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log('Custom verification email sent to:', email)
  } catch (error) {
    console.error('Failed to send custom verification email:', error)
  }
}

export const sendCustomPasswordResetEmail = async (
  firstName: string,
  email: string
) => {
  try {
    const appUrl = getAppUrl()

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${appUrl}/auth/callback`,
      },
    })

    if (error || !data?.properties?.action_link) {
      console.error('Failed to generate password reset link:', error)
      return
    }

    const template = getPasswordResetEmailTemplate({
      firstName,
      email,
      resetLink: data.properties.action_link,
    })

    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log('Custom password reset email sent to:', email)
  } catch (error) {
    console.error('Failed to send password reset email:', error)
  }
}

export const sendPasswordResetConfirmationEmail = async (
  firstName: string,
  email: string
) => {
  try {
    const template = getPasswordResetSuccessEmailTemplate({
      firstName,
      email,
    })

    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log('Password reset confirmation email sent to:', email)
  } catch (error) {
    console.error('Failed to send password reset confirmation email:', error)
  }
}

export const sendPaymentInstructionsEmail = async (
  firstName: string,
  email: string,
  orderNumber: string,
  paymentMethod: string,
  paymentDetails: string,
  amount: string,
  items: Array<{
    name: string
    quantity: number
  }>
) => {
  try {
    const template = getPaymentInstructionsTemplate({
      firstName,
      email,
      orderNumber,
      paymentMethod,
      paymentDetails,
      amount,
      items,
    })
    
    await sendEmailAsync({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log('Payment instructions email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send payment instructions email:', error)
    // Don't throw - email failure shouldn't break business flow
  }
}

export const sendOrderProcessingEmail = async (
  firstName: string,
  email: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number }>
) => {
  try {
    const template = getOrderProcessingTemplate({ firstName, email, orderNumber, items })
    await sendEmailAsync({ to: email, subject: template.subject, html: template.html, text: template.text })
    console.log('Order processing email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send order processing email:', error)
  }
}

export const sendOrderShippedEmail = async (
  firstName: string,
  email: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number }>
) => {
  try {
    const template = getOrderShippedTemplate({ firstName, email, orderNumber, items })
    await sendEmailAsync({ to: email, subject: template.subject, html: template.html, text: template.text })
    console.log('Order shipped email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send order shipped email:', error)
  }
}

export const sendOrderDeliveredEmail = async (
  firstName: string,
  email: string,
  orderNumber: string
) => {
  try {
    const template = getOrderDeliveredTemplate({ firstName, email, orderNumber })
    await sendEmailAsync({ to: email, subject: template.subject, html: template.html, text: template.text })
    console.log('Order delivered email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send order delivered email:', error)
  }
}

export const sendOrderCancelledEmail = async (
  firstName: string,
  email: string,
  orderNumber: string,
  reason?: string
) => {
  try {
    const template = getOrderCancelledTemplate({ firstName, email, orderNumber, reason })
    await sendEmailAsync({ to: email, subject: template.subject, html: template.html, text: template.text })
    console.log('Order cancelled email sent successfully to:', email)
  } catch (error) {
    console.error('Failed to send order cancelled email:', error)
  }
}
