"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  MailCheck,
  Loader2,
  CheckCircle,
  WifiOff,
} from "lucide-react"
import { toast } from "sonner"
import {
  AuthFooterLinks,
  AuthHeader,
  AuthInput,
} from "@/components/auth"
import { ROUTES } from "@/lib/constants/routes"

import { Button } from "@/components/ui/button"
import { useResendVerification } from "@/hooks/use-auth-mutations"
import { useNetworkStatus } from "@/hooks/use-network-status"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"
  const emailParam = searchParams.get("email") || ""
  const verified = searchParams.get("verified") === "true"

  const [email, setEmail] = React.useState(emailParam)

  const isOnline = useNetworkStatus()
  const resendMutation = useResendVerification()

  const handleResend = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }

    try {
      await resendMutation.mutateAsync({ email })
      toast.success("Verification email sent!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend verification email.")
    }
  }

  if (verified) {
    return (
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl md:text-3xl text-foreground leading-tight mb-2">
            Email Verified!
          </h1>
          <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
            Your email has been successfully verified. You can now sign in and continue your journey.
          </p>
        </div>

        <Button asChild className="w-full h-12 font-sans text-sm uppercase tracking-wider">
          <Link href={ROUTES.LOGIN}>Sign In</Link>
        </Button>

        <AuthFooterLinks
          links={[
            {
              label: "Back to sign in",
              href: ROUTES.LOGIN,
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
      {!isOnline && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>No internet connection. Please check your network.</span>
        </div>
      )}

      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <MailCheck className="h-10 w-10 text-primary" />
        </div>
      </div>

      <AuthHeader
        title="Verify Your Email"
        subtitle="We've sent a confirmation link to your email address."
        className="text-center"
      />

      <div className="text-center mb-8">
        <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
          Check your inbox and click the link to activate your account.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          icon={MailCheck}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={resendMutation.isPending}
          required
        />

        <Button
          onClick={handleResend}
          className="w-full h-12 font-sans text-sm uppercase tracking-wider"
          disabled={resendMutation.isPending || !isOnline}
        >
          {resendMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend Verification Email"
          )}
        </Button>
      </div>

      <div className="text-center">
        <span className="font-sans text-sm text-muted-foreground">Wrong email? </span>
        <Link
          href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="font-sans text-sm text-primary hover:text-primary/80 font-medium"
        >
          Update Email
        </Link>
      </div>

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