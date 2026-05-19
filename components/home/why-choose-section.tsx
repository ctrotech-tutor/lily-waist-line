"use client";

import { useState } from "react";
import {
  Shield,
  Lock,
  Truck,
  Headphones,
  Sparkles,
} from "lucide-react";

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
      "Complimentary express shipping on all orders. Receive your transformation tools within 2–3 business days.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Personal concierge support ready to guide your transformation journey with expert care.",
  },
];

export function WhyChooseSection() {
  const [isLoaded] = useState(true);

  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-20">

      {/* Ambient background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-card/20 to-transparent" />

      {/* Glow */}
      <div className="absolute top-20 right-0 h-75 w-75 bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-360 px-5 sm:px-6 lg:px-8 xl:px-12">

        {/* HEADER */}
        <div className="mb-16 text-center md:mb-20 lg:mb-24">

          {/* Eyebrow */}
          <div
            className={cn(
              "mb-6 flex items-center justify-center gap-2",
              "transition-all duration-700",
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
          >
            <Sparkles className="h-4 w-4 text-primary" />

            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Crafted For Transformation
            </span>
          </div>

          {/* Divider */}
          <div
            className={cn(
              "mx-auto mb-8 h-px w-14 bg-primary",
              "transition-all duration-700 delay-100",
              isLoaded
                ? "scale-x-100 opacity-100"
                : "scale-x-0 opacity-0"
            )}
          />

          {/* Heading */}
          <h2
            className={cn(
              "mb-6 font-heading text-3xl text-foreground sm:text-4xl md:text-5xl lg:text-6xl",
              "leading-[1.1] tracking-tight",
              "transition-all duration-700 delay-200",
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
          >
            More Than Waist Training
          </h2>

          {/* Copy */}
          <p
            className={cn(
              "mx-auto max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg",
              "transition-all duration-700 delay-300",
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
          >
            Experience the intersection of luxury craftsmanship and body confidence.
            Every detail is engineered for comfort, support, and premium transformation.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative",
                  "transition-all duration-700",
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                )}
                style={{
                  transitionDelay: `${(index + 4) * 100}ms`,
                }}
              >
                {/* Card */}
                <div
                  className={cn(
                    "relative h-full overflow-hidden rounded-3xl",
                    "bg-card/40 backdrop-blur-xl",
                    "p-8 md:p-10",
                    "transition-all duration-500",
                    "group-hover:-translate-y-2",
                    "group-hover:bg-card/70"
                  )}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/3" />

                  {/* Icon */}
                  <div
                    className={cn(
                      "relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl",
                      "bg-primary/5",
                      "transition-all duration-500",
                      "group-hover:bg-primary/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 text-foreground/70",
                        "transition-all duration-500",
                        "group-hover:text-primary"
                      )}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={cn(
                      "mb-3 font-heading text-xl text-foreground md:text-2xl",
                      "transition-colors duration-500",
                      "group-hover:text-primary"
                    )}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseSection;