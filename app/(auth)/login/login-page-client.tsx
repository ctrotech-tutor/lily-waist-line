"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { AuthHeader, AuthInput, AuthFooterLinks } from "@/components/auth"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/hooks/use-auth-mutations"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { ROUTES } from "@/lib/constants/routes"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get("redirectTo") || ROUTES.HOME

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  const isOnline = useNetworkStatus()
  const loginMutation = useLogin()

  // Parse auth errors from URL hash fragments (e.g., after failed OTP verification)
  React.useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.replace(/^#/, ''))
      const errorCode = params.get('error_code')
      const errorDescription = params.get('error_description')
      if (errorCode || errorDescription) {
        const message = errorDescription || 'Authentication error. Please try again.'
        toast.error(decodeURIComponent(message))
        // Clean up the URL hash after displaying
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isOnline) return

    loginMutation.mutate({ email, password }, {
      onSuccess: () => {
        toast.success("Signed in successfully")
        setTimeout(() => {
          router.replace(redirectTo)
        }, 1000)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div className="w-full max-w-md">
      <AuthHeader
        title="Welcome Back"
        subtitle="Continue your transformation journey."
      />

      {!isOnline && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>No internet connection. Please check your network.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          icon={Lock}
          endIcon={showPassword ? EyeOff : Eye}
          onEndIconClick={() => setShowPassword(!showPassword)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            href={`/forgot-password?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-sans text-sm uppercase tracking-wider"
          disabled={loginMutation.isPending || !isOnline}
        >
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>

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

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 font-sans text-sm"
        disabled={loginMutation.isPending}
        onClick={async () => {
          const { googleSignIn } = await import('@/server/actions/auth/google-signin')
          await googleSignIn(redirectTo)
        }}
      >
        <svg
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
            fill="#4285F4"
          />
          <path
            d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
            fill="#34A853"
          />
          <path
            d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z"
            fill="#FBBC05"
          />
          <path
            d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 0 12.2401 0C7.7029 0 3.55371 2.55748 1.5166 6.61481L5.50264 9.70575C6.45504 6.86173 9.10947 4.74966 12.2401 4.74966Z"
            fill="#EA4335"
          />
        </svg>

        Continue with Google
      </Button>

      <AuthFooterLinks
        links={[
          {
            label: "Don't have an account?",
            href: "#",
            variant: "default",
          },
          {
            label: "Sign Up",
            href: `/signup?redirectTo=${encodeURIComponent(redirectTo)}`,
            variant: "primary",
          },
        ]}
      />
    </div>
  )
}