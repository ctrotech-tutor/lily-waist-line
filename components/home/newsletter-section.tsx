"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterSection() {
  const [isLoaded] = useState(true);
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Future backend integration placeholder
    console.log("Newsletter signup:", email);
  };

  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Layered background for premium feel */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/20 to-transparent opacity-60" />

      {/* Subtle gold glow accents */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-200 h-100",
          "bg-[#d4af37]/5 blur-[120px] rounded-full",
          "pointer-events-none",
          "transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="relative max-w-360 mx-auto px-5 sm:px-6 lg:px-8 xl:px-12">
        {/* Content Container with Editorial Framing */}
        <div className="relative max-w-3xl mx-auto">
          {/* Top decorative line */}
          <div
            className={cn(
              "absolute -top-8 left-1/2 -translate-x-1/2",
              "w-px h-16",
              "bg-linear-to-b from-transparent via-[#d4af37]/40 to-[#d4af37]/40",
              "transition-all duration-700",
              isLoaded ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            )}
          />

          {/* Content Area */}
          <div className="text-center py-12 md:py-16 lg:py-20">
            {/* Eyebrow Label */}
            <div
              className={cn(
                "transition-all duration-700",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                Exclusive Access
              </span>
            </div>

            {/* Gold Divider */}
            <div
              className={cn(
                "w-12 h-px bg-[#d4af37] mx-auto mt-6 mb-8",
                "transition-all duration-700 delay-100",
                isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              )}
            />

            {/* Main Heading */}
            <h2
              className={cn(
                "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                "leading-[1.15] tracking-tight text-foreground",
                "mb-6",
                "transition-all duration-700 delay-200",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Own Your Transformation
            </h2>

            {/* Supporting Copy */}
            <p
              className={cn(
                "font-sans text-base sm:text-lg md:text-xl",
                "text-muted-foreground leading-relaxed",
                "max-w-xl mx-auto mb-12",
                "transition-all duration-700 delay-300",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Be the first to discover new arrivals, exclusive offers, and
              transformation stories crafted for women who demand excellence.
            </p>

            {/* Subscription Form */}
            <form
              onSubmit={handleSubmit}
              className={cn(
                "transition-all duration-700 delay-400",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 max-w-lg mx-auto">
                {/* Email Input - Underline Style */}
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your email"
                    required
                    className={cn(
                      "w-full px-0 py-4",
                      "bg-transparent",
                      "font-sans text-base text-foreground",
                      "placeholder:text-muted-foreground/60",
                      "border-0 border-b",
                      "transition-all duration-300",
                      "focus:outline-none",
                      isFocused || email
                        ? "border-[#d4af37]"
                        : "border-outline/40",
                      "sm:pr-6"
                    )}
                  />
                  {/* Focus indicator line */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-px",
                      "bg-[#d4af37]",
                      "transition-transform duration-300 origin-left",
                      isFocused || email ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </div>

                {/* Subscribe Button */}
                <button
                  type="submit"
                  className={cn(
                    "group relative",
                    "px-8 py-4",
                    "font-sans text-sm font-semibold uppercase tracking-widest",
                    "text-primary-foreground",
                    "bg-primary",
                    "border-0",
                    "transition-all duration-300",
                    "hover:bg-[#d4af37]",
                    "hover:text-[#1b1b1b]",
                    "sm:ml-6",
                    "overflow-hidden"
                  )}
                >
                  {/* Shimmer effect on hover */}
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">Join Now</span>
                </button>
              </div>

              {/* Helper text */}
              <p className="font-sans text-xs text-muted-foreground/60 mt-4 tracking-wide">
                Join a community of women transforming their confidence.
              </p>
            </form>
          </div>

          {/* Bottom decorative line */}
          <div
            className={cn(
              "absolute -bottom-8 left-1/2 -translate-x-1/2",
              "w-px h-16",
              "bg-linear-to-t from-transparent via-[#d4af37]/40 to-[#d4af37]/40",
              "transition-all duration-700 delay-500",
              isLoaded ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            )}
          />
        </div>

        {/* Horizontal decorative lines */}
        <div
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2",
            "w-32 h-px",
            "bg-linear-to-r from-transparent via-[#d4af37]/20 to-transparent",
            "transition-all duration-1000 delay-600",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2",
            "w-32 h-px",
            "bg-linear-to-r from-transparent via-[#d4af37]/20 to-transparent",
            "transition-all duration-1000 delay-600",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </section>
  );
}

export default NewsletterSection;
