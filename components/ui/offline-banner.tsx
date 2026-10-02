'use client'

import { useNetworkStatus } from '@/hooks/use-network-status'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const isOnline = useNetworkStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center gap-2 text-sm font-sans">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>You appear to be offline. Please check your internet connection.</span>
    </div>
  )
}
