"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AuthLink {
  label: string
  href: string
  variant?: "default" | "primary"
}

interface AuthFooterLinksProps {
  links: AuthLink[]
  className?: string
}

export function AuthFooterLinks({
  links,
  className,
}: AuthFooterLinksProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-8", className)}>
      {links.map((link, index) => (
        <React.Fragment key={link.href}>
          {index > 0 && (
            <span className="text-muted-foreground/40">|</span>
          )}
          <Link
            href={link.href}
            className={cn(
              "font-sans text-sm transition-colors duration-200",
              link.variant === "primary"
                ? "text-primary hover:text-primary/80 font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
}

// Pre-configured link sets for common auth patterns
export const authLinkPresets = {
  login: [
    { label: "Forgot password?", href: "/forgot-password", variant: "primary" as const },
    { label: "Create account", href: "/signup" },
  ],
  signup: [
    { label: "Already have an account?", href: "/login", variant: "primary" as const },
  ],
  forgotPassword: [
    { label: "Back to sign in", href: "/login" },
    { label: "Create account", href: "/signup" },
  ],
  resetPassword: [
    { label: "Back to sign in", href: "/login", variant: "primary" as const },
  ],
  verifyEmail: [
    { label: "Back to sign in", href: "/login", variant: "primary" as const },
  ],
}
