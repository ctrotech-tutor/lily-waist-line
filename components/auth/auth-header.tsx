"use client"

import { cn } from "@/lib/utils"

interface AuthHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function AuthHeader({
  title,
  subtitle,
  className,
}: AuthHeaderProps) {
  return (
    <div className={cn("space-y-2 mb-8", className)}>
      <h1 className="font-heading text-2xl md:text-3xl text-foreground leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
