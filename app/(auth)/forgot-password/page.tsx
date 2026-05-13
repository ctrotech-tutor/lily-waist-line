"use client"

import * as React from "react"
import { Mail, CheckCircle } from "lucide-react"

import { AuthHeader, AuthInput, AuthFooterLinks, authLinkPresets } from "@/components/auth"
import { Button } from "@/components/ui/button"
import { forgotPassword } from "@/server/actions/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await forgotPassword({
        email
      })

      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || "Failed to send reset email")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Success Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl md:text-3xl text-foreground leading-tight mb-2">
            Reset instructions have been prepared.
          </h1>
          <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
            Check your inbox to continue.
          </p>
        </div>

        {/* Back to Login CTA */}
        <Button
          asChild
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 font-sans text-sm uppercase tracking-wider"
        >
          <a href="/login">Back to Sign In</a>
        </Button>

        {/* Footer Links */}
        <AuthFooterLinks
          links={authLinkPresets.forgotPassword}
          className="mt-8"
        />
      </div>
    )
  }

  // Form State
  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <AuthHeader
        title="Forgot Your Password?"
        subtitle="Enter your email and we'll help you get back in."
      />

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm font-sans">
          {error}
        </div>
      )}

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={isLoading}
        />

        {/* Send Reset Link Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 font-sans text-sm uppercase tracking-wider"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {/* Footer Links */}
      <AuthFooterLinks
        links={[
          { label: "Back to sign in", href: "/login", variant: "primary" },
        ]}
        className="mt-8"
      />
    </div>
  )
}