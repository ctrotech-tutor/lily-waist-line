"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ROUTES } from "@/lib/constants/routes"
import { cn } from "@/lib/utils"

type CallbackFlow = "recovery" | "signup" | "default" | null

const FLOW_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  recovery: {
    title: "Preparing your password reset",
    subtitle: "Just a moment while we get you set up...",
  },
  signup: {
    title: "Verifying your email",
    subtitle: "You're almost there! Confirming your account...",
  },
  default: {
    title: "Signing you in",
    subtitle: "Please wait while we process your request...",
  },
}

const TIMEOUT_MS = 15_000

function detectFlow(
  hashType: string | null,
  queryType: string | null,
  code: string | null,
  accessToken: string | null
): CallbackFlow {
  const type = hashType || queryType
  if (type === "recovery") return "recovery"
  if (type === "signup" || type === "email") return "signup"
  if (code || accessToken) return "default"
  return null
}

export function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processedRef = useRef(false)
  const [flow, setFlow] = useState<CallbackFlow>(null)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    const timer = setTimeout(() => setTimedOut(true), TIMEOUT_MS)

    const init = async () => {
      const savedHash = window.location.hash.replace(/^#/, '')
      const hashParams = new URLSearchParams(savedHash)
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const hashType = hashParams.get('type')

      const code = searchParams.get('code')
      const queryType = searchParams.get('type')
      const next = searchParams.get('next')

      const type = hashType || queryType

      const detectedFlow = detectFlow(hashType, queryType, code, accessToken)
      if (detectedFlow) setFlow(detectedFlow)

      if (code) {
        const { exchangeCode } = await import('@/server/actions/auth/exchange-code')
        const result = await exchangeCode(code)
        clearTimeout(timer)

        if (!result.success) {
          router.replace(ROUTES.LOGIN + '?error=auth')
          return
        }

        if (type === 'signup' || type === 'email') {
          router.replace(ROUTES.VERIFY_EMAIL + '?verified=true')
        } else if (next) {
          router.replace(next)
        } else {
          router.replace(ROUTES.HOME)
        }
        return
      }

      if (accessToken && refreshToken) {
        const { supabase } = await import('@/lib/supabase/client')
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        const { syncAuthUser } = await import('@/server/actions/auth/sync-user')
        await syncAuthUser()
      }

      clearTimeout(timer)

      if (type === 'recovery') {
        router.replace(ROUTES.RESET_PASSWORD)
      } else if (type === 'signup' || type === 'email') {
        router.replace(ROUTES.VERIFY_EMAIL + '?verified=true')
      } else if (type === 'email_change') {
        router.replace(ROUTES.ACCOUNT)
      } else if (next) {
        router.replace(next)
      } else {
        router.replace(ROUTES.HOME)
      }
    }

    init().catch(() => {
      clearTimeout(timer)
      setTimedOut(true)
    })
  }, [router, searchParams])

  if (timedOut) {
    const loginHref = ROUTES.LOGIN + (searchParams.get('next') ? `?redirectTo=${encodeURIComponent(searchParams.get('next')!)}` : '')

    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className={cn("w-full max-w-sm border border-destructive/30 bg-destructive/3 p-8")}>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
              <AlertCircle className="size-7 text-destructive" />
            </div>
            <h1 className="mb-2 font-heading text-xl text-foreground">Something went wrong</h1>
            <p className="mb-6 font-sans text-sm leading-relaxed text-muted-foreground">
              Your authentication request timed out or encountered an error. Please try signing in again.
            </p>
            <Button asChild className="h-12 w-full font-sans text-sm uppercase tracking-wider">
              <Link href={loginHref}>Return to Sign In</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const flowKey = flow || "default"
  const message = FLOW_MESSAGES[flowKey]

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className={cn("w-full max-w-sm border border-primary/10 bg-card p-8")}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
            <Loader2 className="size-7 animate-spin text-primary" />
          </div>
          <h1 className="mb-2 font-heading text-xl text-foreground">{message.title}</h1>
          <p className="mb-6 font-sans text-sm leading-relaxed text-muted-foreground">{message.subtitle}</p>
          <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/3 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">LWL</span>
          </div>
        </div>
      </Card>
    </div>
  )
}