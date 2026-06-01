import { QueryClient } from '@tanstack/react-query'

/**
 * TanStack Query Client Configuration
 * Configured for Next.js App Router with proper hydration and caching
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30, // 30 seconds - data is fresh for 30s
        gcTime: 1000 * 60 * 5, // 5 minutes - cache data for 5min
        refetchOnWindowFocus: true, // Refetch when window regains focus
        refetchOnReconnect: true, // Refetch when reconnecting
        retry: 1, // Retry failed requests once
        retryDelay: 1000, // Wait 1s before retry
      },
      mutations: {
        retry: 1, // Retry failed mutations once
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * Get or create the browser-side QueryClient singleton
 * This ensures we don't create multiple QueryClients during hydration
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new client
    return makeQueryClient()
  } else {
    // Browser: use singleton to avoid hydration mismatches
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}