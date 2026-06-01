"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail, CheckCircle, WifiOff } from "lucide-react"
import { toast } from "sonner"

import {
  AuthHeader,
  AuthInput,
  AuthFooterLinks,
} from "@/components/auth"
import { Button } from "@/components/ui/button"
import { useForgotPassword } from "@/hooks/use-auth-mutations"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { ROUTES } from "@/lib/constants/routes"

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || ROUTES.HOME

  const [email, setEmail] = React.useState("")

  const isOnline = useNetworkStatus()
  const forgotMutation = useForgotPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOnline) return

    forgotMutation.mutate({ email }, {
      onSuccess: () => {
        toast.success("If an account exists, reset instructions have been sent.")
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  if (forgotMutation.isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl md:text-3xl text-foreground leading-tight mb-2">
            Check your inbox
          </h1>
          <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
            If an account with that email exists, we&apos;ve sent password reset instructions.
          </p>
        </div>

        <Button asChild className="w-full h-12 font-sans text-sm uppercase tracking-wider">
          <Link href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}>
            Back to Sign In
          </Link>
        </Button>

        <AuthFooterLinks
          links={[
            {
              label: "Back to sign in",
              href: `/login?redirectTo=${encodeURIComponent(redirectTo)}`,
              variant: "primary",
            },
          ]}
          className="mt-8"
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <AuthHeader
        title="Forgot Your Password?"
        subtitle="Enter your email and we'll help you get back in."
      />

      {!isOnline && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>No internet connection. Please check your network.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={forgotMutation.isPending}
        />

        <Button
          type="submit"
          className="w-full h-12 font-sans text-sm uppercase tracking-wider"
          disabled={forgotMutation.isPending || !isOnline}
        >
          {forgotMutation.isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <AuthFooterLinks
        links={[
          {
            label: "Back to sign in",
            href: `/login?redirectTo=${encodeURIComponent(redirectTo)}`,
            variant: "primary",
          },
        ]}
        className="mt-8"
      />
    </div>
  )
}