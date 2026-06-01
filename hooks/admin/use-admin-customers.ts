import { useQuery } from '@tanstack/react-query'
import { getAllCustomers, getCustomerById } from '@/server/actions/admin/customers'
import type { GetAllCustomersInput } from '@/server/actions/admin/customers'
import { adminKeys } from '@/lib/react-query/query-keys'

export function useAdminCustomers(filters: Partial<GetAllCustomersInput> = {}) {
  return useQuery({
    queryKey: adminKeys.customers.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const result = await getAllCustomers({
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
        search: filters.search,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 30,
  })
}

export function useAdminCustomer(customerId: string) {
  return useQuery({
    queryKey: adminKeys.customers.detail(customerId),
    queryFn: async () => {
      const result = await getCustomerById({ customerId })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!customerId,
  })
}