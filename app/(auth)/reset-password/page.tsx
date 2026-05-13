"use client"

import * as React from "react"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

import { AuthHeader, AuthInput, AuthFooterLinks, authLinkPresets } from "@/components/auth"
import { Button } from "@/components/ui/button"
import { resetPassword } from "@/server/actions/auth"

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await resetPassword({
        password: newPassword,
        confirmPassword: confirmPassword
      })

      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || "Failed to update password")
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
            Your password has been updated.
          </h1>
          <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
            You may now sign in with your new password.
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
          links={authLinkPresets.resetPassword}
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
        title="Create a New Password"
        subtitle="Choose a secure password to continue your journey."
      />

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm font-sans">
          {error}
        </div>
      )}

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Field */}
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
            disabled={isLoading}
            minLength={8}
            endIcon={showNewPassword ? EyeOff : Eye}
            onEndIconClick={() => setShowNewPassword(!showNewPassword)}
          />
          {/* Password Guidance */}
          <p className="font-sans text-xs text-muted-foreground">
            Use at least 8 characters for stronger protection.
          </p>
        </div>

        {/* Confirm New Password Field */}
        <AuthInput
          label="Confirm New Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your new password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          disabled={isLoading}
          minLength={8}
          endIcon={showConfirmPassword ? EyeOff : Eye}
          onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {/* Update Password Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 font-sans text-sm uppercase tracking-wider"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>

      {/* Footer Links */}
      <AuthFooterLinks
        links={authLinkPresets.resetPassword}
        className="mt-8"
      />
    </div>
  )
}