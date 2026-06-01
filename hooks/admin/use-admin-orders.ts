import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getAllOrders, getOrderById, verifyPayment, updateFulfillmentStatus, addTrackingNumber } from '@/server/actions/admin/orders'
import type { GetAllOrdersInput, VerifyPaymentInput, UpdateFulfillmentStatusInput, AddTrackingNumberInput } from '@/server/actions/admin/orders'
import { adminKeys } from '@/lib/react-query/query-keys'

function invalidateOrderCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: adminKeys.orders.all() })
  queryClient.invalidateQueries({ queryKey: adminKeys.shipping.all() })
}

export function useAdminOrders(filters: GetAllOrdersInput = {}) {
  return useQuery({
    queryKey: adminKeys.orders.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const result = await getAllOrders({
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
        search: filters.search,
        paymentStatus: filters.paymentStatus,
        fulfillmentStatus: filters.fulfillmentStatus,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 30,
  })
}

export function useAdminOrder(orderId: string) {
  return useQuery({
    queryKey: adminKeys.orders.detail(orderId),
    queryFn: async () => {
      const result = await getOrderById({ orderId })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!orderId,
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: VerifyPaymentInput) => {
      return await verifyPayment(data)
    },
    onSuccess: (data) => {
      invalidateOrderCaches(queryClient)
      toast.success(data.message || 'Payment verified successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to verify payment')
    },
  })
}

export function useUpdateFulfillmentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateFulfillmentStatusInput) => {
      return await updateFulfillmentStatus(data)
    },
    onSuccess: (data) => {
      invalidateOrderCaches(queryClient)
      toast.success(data.message || 'Fulfillment status updated')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update fulfillment status')
    },
  })
}

export function useAddTrackingNumber() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddTrackingNumberInput) => {
      return await addTrackingNumber(data)
    },
    onSuccess: (data) => {
      invalidateOrderCaches(queryClient)
      toast.success(data.message || 'Tracking number added')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add tracking number')
    },
  })
}