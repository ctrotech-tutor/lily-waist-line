import { useQuery } from '@tanstack/react-query'
import { getPaymentConfiguration } from '@/server/actions/payment/get-payment-config'
import { paymentConfigKeys } from '@/lib/react-query/query-keys'

export function usePaymentConfig() {
  return useQuery({
    queryKey: paymentConfigKeys.base(),
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