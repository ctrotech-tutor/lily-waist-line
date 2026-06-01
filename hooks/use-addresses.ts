import { useQuery } from '@tanstack/react-query'
import { getUserAddresses } from '@/server/actions/address'
import { addressKeys } from '@/lib/react-query/query-keys'

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.base(),
    queryFn: async () => {
      const result = await getUserAddresses()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch addresses')
      }
      return result.data || []
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  })
}