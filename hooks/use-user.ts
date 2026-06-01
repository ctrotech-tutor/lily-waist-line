import { useQuery } from '@tanstack/react-query'
import { authKeys } from '@/lib/react-query/query-keys'

export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const { getCurrentUserAction } = await import('@/server/actions/auth/get-current-user')
      const user = await getCurrentUserAction()
      return user
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    retry: false,
  })
}