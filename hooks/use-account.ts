import { useQuery } from '@tanstack/react-query'
import { accountKeys } from '@/lib/react-query/query-keys'

export function useAccountProfile() {
  return useQuery({
    queryKey: accountKeys.profile(),
    queryFn: async () => {
      const { getCurrentUserAction } = await import('@/server/actions/auth/get-current-user')
      const user = await getCurrentUserAction()
      if (!user) throw new Error('Not authenticated')
      return user
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    retry: false,
  })
}

export function useAccountStats() {
  return useQuery({
    queryKey: accountKeys.stats(),
    queryFn: async () => {
      const { getAccountStats } = await import('@/server/actions/account')
      const stats = await getAccountStats()
      return stats
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  })
}