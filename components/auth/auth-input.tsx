"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideIcon } from "lucide-react"

interface AuthInputProps extends React.ComponentProps<"input"> {
  label?: string
  icon?: LucideIcon
  error?: string
  helperText?: string
  endIcon?: LucideIcon
  onEndIconClick?: () => void
}

export function AuthInput({
  label,
  icon: Icon,
  error,
  helperText,
  endIcon: EndIcon,
  onEndIconClick,
  className,
  id,
  ...props
}: AuthInputProps) {
  const generatedId = React.useId()
  const inputId = id || generatedId

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={inputId}
          className="font-sans text-xs uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </Label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <Input
          id={inputId}
          data-slot="auth-input"
          className={cn(
            "h-12 bg-transparent border-0 border-b border-input rounded-none px-0",
            "font-sans text-base text-foreground placeholder:text-muted-foreground/60",
            "focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0",
            "transition-colors duration-200",
            Icon && "pl-8",
            EndIcon && "pr-10",
            error && "border-destructive focus-visible:border-destructive",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          {...props}
        />
        {EndIcon && onEndIconClick && (
          <button
            type="button"
            onClick={onEndIconClick}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            <EndIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && (
        <p className="font-sans text-xs text-destructive mt-1.5">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="font-sans text-xs text-muted-foreground mt-1.5">
          {helperText}
        </p>
      )}
    </div>
  )
}
