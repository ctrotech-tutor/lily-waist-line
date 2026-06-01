"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  WifiOff,
} from "lucide-react"
import { toast } from "sonner"

import {
  AuthHeader,
  AuthInput,
  AuthFooterLinks,
} from "@/components/auth"

import { Button } from "@/components/ui/button"
import { useResetPassword } from "@/hooks/use-auth-mutations"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { ROUTES } from "@/lib/constants/routes"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || ROUTES.HOME

  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const isOnline = useNetworkStatus()
  const resetMutation = useResetPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOnline) return

    resetMutation.mutate({ password: newPassword, confirmPassword }, {
      onSuccess: () => {
        toast.success("Password updated successfully")
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  if (resetMutation.isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl md:text-3xl text-foreground leading-tight mb-2">
            Your password has been updated.
          </h1>
          <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
            You may now sign in with your new password.
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
        title="Create a New Password"
        subtitle="Choose a secure password to continue your journey."
      />

      {!isOnline && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>No internet connection. Please check your network.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <AuthInput
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter your new password"
            icon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={resetMutation.isPending}
            minLength={8}
            endIcon={showNewPassword ? EyeOff : Eye}
            onEndIconClick={() => setShowNewPassword(!showNewPassword)}
          />
          <p className="font-sans text-xs text-muted-foreground">
            Use at least 8 characters for stronger protection.
          </p>
        </div>

        <AuthInput
          label="Confirm New Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your new password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          disabled={resetMutation.isPending}
          minLength={8}
          endIcon={showConfirmPassword ? EyeOff : Eye}
          onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <Button
          type="submit"
          className="w-full h-12 font-sans text-sm uppercase tracking-wider"
          disabled={resetMutation.isPending || !isOnline}
        >
          {resetMutation.isPending ? "Updating..." : "Update Password"}
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