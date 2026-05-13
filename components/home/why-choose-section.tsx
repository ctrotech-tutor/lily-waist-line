"use client";

import { useState } from "react";
import { Shield, Lock, Truck, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "Premium Quality",
    description:
      "Crafted from the finest materials with meticulous attention to detail for lasting durability and comfort.",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description:
      "Shop with confidence. Your payment information is protected with industry-leading encryption.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Complimentary express shipping on all orders. Receive your transformation tools within 2-3 business days.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Dedicated concierge service available to guide your journey and answer every question with care.",
  },
];

export function WhyChooseSection() {
  const [isLoaded] = useState(true);

  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/30 to-transparent opacity-50" />

      <div className="relative max-w-360 mx-auto px-5 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          {/* Eyebrow Label */}
          <div
            className={cn(
              "transition-all duration-700",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Crafted For Transformation
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
            More Than Waist Training
          </h2>

          {/* Supporting Copy */}
          <p
            className={cn(
              "font-sans text-base sm:text-lg",
              "text-muted-foreground leading-relaxed",
              "max-w-2xl mx-auto",
              "transition-all duration-700 delay-300",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Experience the intersection of luxury craftsmanship and body confidence. 
            Every detail engineered for your comfort, support, and premium transformation.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative",
                  "transition-all duration-700",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                  isLoaded && `delay-${(index + 4) * 100}`
                )}
                style={{ transitionDelay: isLoaded ? `${(index + 4) * 100}ms` : "0ms" }}
              >
                {/* Card Container */}
                <div
                  className={cn(
                    "relative h-full",
                    "p-8 md:p-10",
                    "bg-card/50",
                    "border border-outline/20",
                    "transition-all duration-500 ease-out",
                    "group-hover:border-[#d4af37]/40",
                    "group-hover:bg-card/80"
                  )}
                >
                  {/* Gold accent corner */}
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-12 h-12",
                      "border-t border-r border-[#d4af37]/0",
                      "transition-all duration-500",
                      "group-hover:border-[#d4af37]/30"
                    )}
                  />

                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 mb-6",
                      "flex items-center justify-center",
                      "border border-[#d4af37]/30",
                      "transition-all duration-500",
                      "group-hover:border-[#d4af37]/60",
                      "group-hover:bg-[#d4af37]/5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        "text-foreground/70",
                        "transition-all duration-500",
                        "group-hover:text-[#d4af37]"
                      )}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={cn(
                      "font-heading text-xl md:text-2xl",
                      "text-foreground",
                      "mb-3",
                      "transition-colors duration-500",
                      "group-hover:text-[#d4af37]"
                    )}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "font-sans text-sm md:text-base",
                      "text-muted-foreground leading-relaxed"
                    )}
                  >
                    {feature.description}
                  </p>

                  {/* Bottom gold line on hover */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-px",
                      "bg-[#d4af37]/0",
                      "transition-all duration-500",
                      "group-hover:bg-[#d4af37]/40"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative bottom line */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2",
          "w-32 h-px",
          "bg-linear-to-r from-transparent via-[#d4af37]/30 to-transparent",
          "transition-all duration-1000 delay-700",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </section>
  );
}

export default WhyChooseSection;
