"use client"

import * as React from "react"
import { MailCheck, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

import { AuthHeader, AuthFooterLinks, authLinkPresets } from "@/components/auth"
import { Button } from "@/components/ui/button"
import { resendVerification } from "@/server/actions/auth"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = React.useState(false)
  const [resentSuccess, setResentSuccess] = React.useState(false)
  const [error, setError] = React.useState("")
  const [email, setEmail] = React.useState("")

  const handleResend = async () => {
    setIsResending(true)
    setResentSuccess(false)
    setError("")

    try {
      const result = await resendVerification({
        email: email || "user@example.com" // Use a placeholder if no email provided
      })

      if (result.success) {
        setResentSuccess(true)
        // Clear success message after 5 seconds
        setTimeout(() => setResentSuccess(false), 5000)
      } else {
        setError(result.error || "Failed to resend verification email")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Status Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <MailCheck className="h-10 w-10 text-primary" />
        </div>
      </div>

      {/* Header */}
      <AuthHeader
        title="Verify Your Email"
        subtitle="We've sent a confirmation link to your email address."
        className="text-center"
      />

      {/* Instruction Text */}
      <div className="text-center mb-8">
        <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
          Check your inbox and click link to activate your account.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm font-sans mb-6">
          {error}
        </div>
      )}

      {/* Resend Success Message */}
      {resentSuccess && (
        <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded bg-primary/10">
          <CheckCircle className="h-4 w-4 text-primary" />
          <span className="font-sans text-sm text-primary">
            Email resent successfully
          </span>
        </div>
      )}

      {/* Resend Button */}
      <Button
        onClick={handleResend}
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 font-sans text-sm uppercase tracking-wider"
        disabled={isResending}
      >
        {isResending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Resend Email"
        )}
      </Button>

      {/* Change Email Option */}
      <div className="text-center mt-6">
        <span className="font-sans text-sm text-muted-foreground">
          Wrong email?{" "}
        </span>
        <Link
          href="/signup"
          className="font-sans text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
        >
          Update Email
        </Link>
      </div>

      {/* Footer Links */}
      <AuthFooterLinks
        links={authLinkPresets.verifyEmail}
        className="mt-8"
      />
    </div>
  )
}