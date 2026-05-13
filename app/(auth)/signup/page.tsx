"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

import { AuthHeader, AuthFooterLinks } from "@/components/auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { signup } from "@/server/actions/auth"

export default function SignupPage() {
  const router = useRouter()
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [agreeToTerms, setAgreeToTerms] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await signup({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        agreeToTerms
      })

      if (result.success) {
        setSuccess(result.message || "Account created successfully!")
        
        // If email verification is required, redirect to verify email page
        if (result.requiresEmailVerification) {
          setTimeout(() => {
            router.push('/verify-email')
          }, 2000)
        } else {
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }
      } else {
        setError(result.error || "Failed to create account")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <AuthHeader
        title="Create Your Account"
        subtitle="Begin your confidence and transformation journey."
      />

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm font-sans">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm font-sans">
          {success}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First Name Field */}
        <div className="space-y-2">
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            First Name
          </label>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
              className={cn(
                "w-full h-12 bg-transparent border-0 border-b border-input rounded-none px-0",
                "font-sans text-base text-foreground placeholder:text-muted-foreground/60",
                "focus-visible:outline-none focus-visible:border-ring",
                "transition-colors duration-200",
                "pl-8"
              )}
            />
          </div>
        </div>

        {/* Last Name Field */}
        <div className="space-y-2">
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
              className={cn(
                "w-full h-12 bg-transparent border-0 border-b border-input rounded-none px-0",
                "font-sans text-base text-foreground placeholder:text-muted-foreground/60",
                "focus-visible:outline-none focus-visible:border-ring",
                "transition-colors duration-200",
                "pl-8"
              )}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={cn(
                "w-full h-12 bg-transparent border-0 border-b border-input rounded-none px-0",
                "font-sans text-base text-foreground placeholder:text-muted-foreground/60",
                "focus-visible:outline-none focus-visible:border-ring",
                "transition-colors duration-200",
                "pl-8"
              )}
            />
          </div>
        </div>

        {/* Password Field with Visibility Toggle */}
        <div className="space-y-2">
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={cn(
                "w-full h-12 bg-transparent border-0 border-b border-input rounded-none px-0 pr-10",
                "font-sans text-base text-foreground placeholder:text-muted-foreground/60",
                "focus-visible:outline-none focus-visible:border-ring",
                "transition-colors duration-200",
                "pl-8"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field with Visibility Toggle */}
        <div className="space-y-2">
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={cn(
                "w-full h-12 bg-transparent border-0 border-b border-input rounded-none px-0 pr-10",
                "font-sans text-base text-foreground placeholder:text-muted-foreground/60",
                "focus-visible:outline-none focus-visible:border-ring",
                "transition-colors duration-200",
                "pl-8"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className="mt-0.5"
          />
          <label
            htmlFor="terms"
            className="font-sans text-sm text-muted-foreground cursor-pointer"
          >
            I agree to the terms and privacy policy.
          </label>
        </div>

        {/* Create Account Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 font-sans text-sm uppercase tracking-wider mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 font-sans text-xs uppercase tracking-wider text-muted-foreground">
            OR
          </span>
        </div>
      </div>

      {/* Social Login - Google (UI only) */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-border bg-background font-sans text-sm"
        disabled={isLoading}
      >
        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
          <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
          <path d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"/>
          <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 0 12.2401 0C7.7029 0 3.55371 2.55748 1.5166 6.61481L5.50264 9.70575C6.45504 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Button>

      {/* Footer Links */}
      <AuthFooterLinks
        links={[
          { label: "Already have an account?", href: "#", variant: "default" },
          { label: "Sign In", href: "/login", variant: "primary" },
        ]}
      />
    </div>
  )
}