import { z } from 'zod'

export const selectPaymentMethodSchema = z.object({
  orderId: z.string()
    .uuid('Invalid order ID')
    .min(1, 'Order ID is required'),
  
  paymentMethod: z.enum(['CASH_APP', 'PAYPAL']).refine(
    (val) => ['CASH_APP', 'PAYPAL'].includes(val),
    {
      message: 'Invalid payment method. Only CASH_APP and PAYPAL are allowed.'
    }
  )
})

export type SelectPaymentMethodInput = z.infer<typeof selectPaymentMethodSchema>
