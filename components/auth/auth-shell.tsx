"use client";

import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/optimized-image";
import Link from "next/link";

interface AuthShellProps {
  children: React.ReactNode;
  className?: string;
  brandHeading?: string;
  brandSubtext?: string;
  showBrandPanel?: boolean;
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

      {/* LEFT PANEL */}
      {showBrandPanel && (
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#1b1b1b] overflow-hidden">

          {/* Background Image (OPTIMIZED) */}
          <OptimizedImage
            src="/auth-1.png"
            alt="Editorial Campaign"
            fill
            priority
            className="object-cover opacity-70 mix-blend-luminosity"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />

          {/* Brand Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-12 xl:p-20">

            {/* Logo */}
            <div className="relative z-10">
              <Link href="/">
                <OptimizedImage
                  src="/logo.png"
                  alt="Lily Waist Line"
                  width={180}
                  height={60}
                  priority
                  className="w-auto h-12 xl:h-14 brightness-0 invert opacity-90 object-contain"
                />
              </Link>
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

      {/* RIGHT PANEL */}
      <div
        className={cn(
          "flex flex-col justify-center items-center px-5 py-12 relative z-10",
          showBrandPanel ? "w-full lg:w-1/2 min-h-screen" : "w-full min-h-screen"
        )}
      >
        {/* Mobile Logo */}
        {showBrandPanel && (
          <div className="lg:hidden absolute top-8 left-0 right-0 flex justify-center">
            <OptimizedImage
              src="/logo.png"
              alt="Lily Waist Line"
              width={140}
              height={48}
              priority
              className="w-auto h-10 object-contain"
            />
          </div>
        )}

        {/* Form */}
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}