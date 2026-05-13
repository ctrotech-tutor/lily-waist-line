"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface AuthShellProps {
  children: React.ReactNode
  className?: string
  brandHeading?: string
  brandSubtext?: string
  showBrandPanel?: boolean
}

export function AuthShell({
  children,
  className,
  brandHeading = "Sculpt confidence. Wear transformation.",
  brandSubtext = "Premium waist trainers crafted for the modern woman.",
  showBrandPanel = true,
}: AuthShellProps) {
  return (
    <div className={cn("min-h-screen flex flex-col lg:flex-row bg-background", className)}>
      {/* Left Panel: Brand / Editorial */}
      {showBrandPanel && (
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#1b1b1b] overflow-hidden">
          {/* Background Image */}
          <Image
            src="/auth-1.png"
            alt="Editorial Campaign"
            fill
            className="object-cover opacity-70 mix-blend-luminosity"
            priority
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />

          {/* Brand Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-12 xl:p-20">
            {/* Logo */}
            <div className="relative z-10">
              <Image
                src="/logo.png"
                alt="Lily Waist Line"
                width={180}
                height={60}
                className="w-auto h-12 xl:h-14 brightness-0 invert opacity-90"
                priority
              />
            </div>

            {/* Editorial Copy */}
            <div className="relative z-10 space-y-6">
              <h1 className="font-heading text-3xl xl:text-4xl text-white leading-tight max-w-md">
                {brandHeading}
              </h1>
              <p className="font-sans text-sm xl:text-base text-white/70 max-w-sm leading-relaxed">
                {brandSubtext}
              </p>
            </div>
          </div>

          {/* Brand Watermark */}
          <div className="absolute bottom-12 right-12 xl:bottom-20 xl:right-20 opacity-10">
            <span className="font-heading text-[120px] xl:text-[160px] text-white italic tracking-tighter leading-none select-none">
              LWL
            </span>
          </div>
        </div>
      )}

      {/* Right Panel: Form Content */}
      <div className={cn(
        "flex flex-col justify-center items-center px-5 py-12 relative z-10",
        showBrandPanel ? "w-full lg:w-1/2 min-h-screen" : "w-full min-h-screen"
      )}>
        {/* Mobile Brand Header (visible only on small screens when brand panel is hidden) */}
        {showBrandPanel && (
          <div className="lg:hidden absolute top-8 left-0 right-0 flex justify-center">
            <Image
              src="/logo.png"
              alt="Lily Waist Line"
              width={140}
              height={48}
              className="w-auto h-10"
              priority
            />
          </div>
        )}

        {/* Form Container */}
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
