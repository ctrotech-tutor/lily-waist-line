'use client'

import { QueryClientProvider as TanStackQueryProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query/query-client'

/**
 * TanStack Query Provider Component
 * Wraps the app with QueryClientProvider for client-side data fetching
 * Only used in site route group, not admin
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <TanStackQueryProvider client={queryClient}>
      {children}
    </TanStackQueryProvider>
  )
}