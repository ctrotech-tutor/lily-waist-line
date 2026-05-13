"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function HeroSection() {
  const [isLoaded] = useState(true);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-card opacity-50" />

      {/* Main container */}
      <div className="relative max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-screen items-center py-20 lg:py-0">
          {/* Left Content Area */}
          <div
            className={cn(
              "flex flex-col justify-center order-2 lg:order-1",
              "transition-all duration-1000 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {/* Eyebrow Label */}
            <div
              className={cn(
                "flex items-center gap-2 mb-6",
                "transition-all duration-700 delay-200",
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                Designed For Transformation
              </span>
            </div>

            {/* Gold Divider */}
            <div
              className={cn(
                "w-16 h-px bg-[#d4af37] mb-8",
                "transition-all duration-700 delay-300",
                isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              )}
              style={{ transformOrigin: "left" }}
            />

            {/* Main Headline */}
            <h1
              className={cn(
                "font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
                "leading-[1.1] tracking-tight text-foreground",
                "mb-6",
                "transition-all duration-1000 delay-400",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Body.
              <br />
              Discipline.
              <br />
              <span className="text-[#d4af37]">Transformation.</span>
            </h1>

            {/* Supporting Copy */}
            <p
              className={cn(
                "font-sans text-base sm:text-lg",
                "text-muted-foreground leading-relaxed",
                "max-w-md mb-10",
                "transition-all duration-1000 delay-500",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Premium waist trainers crafted for the woman who demands excellence. 
              Sculpt your silhouette with confidence, discipline, and uncompromising luxury.
            </p>

            {/* CTA Buttons */}
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-4",
                "transition-all duration-1000 delay-600",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {/* Primary CTA */}
              <Link
                className={cn(
                  "group flex items-center justify-center gap-3",
                  "px-8 py-4",
                  "bg-foreground text-background",
                  "font-sans text-sm font-semibold uppercase tracking-wider",
                  "transition-all duration-300 ease-out",
                  "hover:bg-[#d4af37] hover:text-black",
                  "focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-background"
                )}
                href={'/shop?from&home'}
              >
                Shop Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Secondary CTA */}
              <Link
                className={cn(
                  "flex items-center justify-center",
                  "px-8 py-4",
                  "border border-[#d4af37]",
                  "font-sans text-sm font-semibold uppercase tracking-wider",
                  "text-foreground",
                  "transition-all duration-300 ease-out",
                  "hover:bg-[#d4af37]/10 hover:border-[#d4af37]",
                  "focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-background"
                )}
                href={'#featured'}
              >
                Explore More
              </Link>
            </div>

            {/* Trust Indicators */}
            <div
              className={cn(
                "flex items-center gap-6 mt-12",
                "transition-all duration-1000 delay-700",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500" />
                <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
                  Quality Materials
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#d4af37]" />
                <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
                  Body-Sculpting Fit
                </span>
              </div>
            </div>
          </div>

          {/* Right Content Area - Hero Image */}
          <div
            className={cn(
              "relative order-1 lg:order-2",
              "flex items-center justify-center",
              "transition-all duration-1000 delay-300",
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
          >
            {/* Image Container with Editorial Framing */}
            <div className="relative w-full max-w-lg lg:max-w-none aspect-3/4 lg:aspect-4/5">
              {/* Gold frame accent */}
              <div
                className={cn(
                  "absolute -inset-3 border border-[#d4af37]/30",
                  "transition-all duration-1000 delay-500",
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              />

              {/* Secondary frame accent */}
              <div
                className={cn(
                  "absolute -inset-6 border border-[#d4af37]/10",
                  "transition-all duration-1000 delay-700",
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              />

              {/* Main Image */}
              <div className="relative w-full h-full overflow-hidden bg-card">
                <Image
                  src="/img-1.png"
                  alt="Lily Waist Line - Premium waist trainer for body transformation"
                  fill
                  priority
                  className={cn(
                    "object-cover",
                    "transition-transform duration-1000 ease-out",
                    isLoaded && "scale-100"
                  )}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-linear-to-t from-background/20 via-transparent to-transparent" />
              </div>

              {/* Floating accent element */}
              <div
                className={cn(
                  "absolute -bottom-4 -right-4 w-24 h-24",
                  "bg-[#d4af37]/5 border border-[#d4af37]/20",
                  "transition-all duration-1000 delay-900",
                  "backdrop-blur-md",
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-75"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px",
          "bg-linear-to-r from-transparent via-[#d4af37]/30 to-transparent",
          "transition-all duration-1500 delay-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </section>
  );
}

export default HeroSection;
