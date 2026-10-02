import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPaymentConfiguration } from '@/server/actions/payment/get-payment-config'
import { updatePaymentConfigurations } from '@/server/actions/admin/payment/update-payment-config'
import { adminKeys } from '@/lib/react-query/query-keys'
import { toast } from 'sonner'

export function useAdminPaymentConfig() {
  return useQuery({
    queryKey: adminKeys.settings.all(),
    queryFn: async () => {
      const result = await getPaymentConfiguration()
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to load payment configuration')
      }
      return result.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdatePaymentConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      cashAppEnabled: boolean
      cashAppHandle?: string
      paypalEnabled: boolean
      paypalEmail?: string
      paypalHandle?: string
    }) => {
      const result = await updatePaymentConfigurations(input)
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to update payment configuration')
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.settings.all() })
      toast.success('Payment configuration updated')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
