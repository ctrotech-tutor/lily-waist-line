import { useQuery } from '@tanstack/react-query'
import { getAdminProfile } from '@/server/actions/admin/profile/get-admin-profile'

export function useAdminUser() {
  return useQuery({
    queryKey: ['admin', 'currentUser'],
    queryFn: async () => {
      const result = await getAdminProfile()
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to fetch admin profile')
      }
      return result.data
    },
    staleTime: 1000 * 60 * 30,
    retry: false,
  })
}