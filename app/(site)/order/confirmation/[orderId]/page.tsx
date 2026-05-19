import { Suspense } from 'react'
import OrderConfirmationClient from './order-confirmation-client'

interface PageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function OrderConfirmationPage({
  params,
}: PageProps) {
  const { orderId } = await params

  return (
    <Suspense fallback={null}>
      <OrderConfirmationClient orderId={orderId} />
    </Suspense>
  )
}