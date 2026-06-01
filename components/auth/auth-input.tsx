"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"
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

      <InputGroup>
        {Icon && (
          <InputGroupAddon align="inline-start">
            <Icon className="h-4 w-4" />
          </InputGroupAddon>
        )}
        <InputGroupInput
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />
        {EndIcon && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              onClick={onEndIconClick}
              tabIndex={-1}
            >
              <EndIcon className="h-4 w-4" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {error && (
        <p
          id={`${inputId}-error`}
          className="font-sans text-xs text-destructive mt-1.5"
        >
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="font-sans text-xs text-muted-foreground mt-1.5"
        >
          {helperText}
        </p>
      )}
    </div>
  )
}