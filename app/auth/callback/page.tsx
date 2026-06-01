import { Suspense } from 'react'
import { AuthCallbackClient } from './auth-callback-client'

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="font-sans text-sm text-muted-foreground">Processing...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  )
}