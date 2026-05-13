import { sendEmailAsync } from './email-service'
import { 
  getWelcomeEmailTemplate, 
  getOrderConfirmationTemplate,
  getPaymentReceivedTemplate,
  getShippingUpdateTemplate,
  getLoginAlertTemplate
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
