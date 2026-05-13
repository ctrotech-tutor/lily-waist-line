"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Sparkles,
  Wind,
  Dumbbell,
  Lock,
  Truck,
  RefreshCw,
  Gem,
  Layers,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Target,
    title: "Core Support",
    description:
      "Engineered compression technology that provides targeted support to your core, promoting better posture and stability throughout your day.",
  },
  {
    icon: Sparkles,
    title: "Waist Sculpting Effect",
    description:
      "Instantly enhances your natural curves while providing gradual waist reduction through consistent, comfortable compression.",
  },
  {
    icon: Wind,
    title: "Breathable Comfort",
    description:
      "Advanced moisture-wicking fabric keeps you cool and dry, allowing your skin to breathe even during extended wear.",
  },
  {
    icon: Dumbbell,
    title: "Workout Friendly Design",
    description:
      "Flexible yet supportive construction moves with your body, making it perfect for gym sessions, yoga, or daily activities.",
  },
];

const trustIndicators = [
  {
    icon: Lock,
    label: "Secure Checkout",
  },
  {
    icon: Truck,
    label: "Fast Delivery",
  },
  {
    icon: RefreshCw,
    label: "Easy Returns",
  },
];

const materialHighlights = [
  {
    icon: Gem,
    title: "Premium Fabric",
    description: "Luxury-grade materials sourced for exceptional quality",
  },
  {
    icon: Layers,
    title: "Durable Compression Structure",
    description: "Built to maintain shape and support through daily wear",
  },
  {
    icon: Heart,
    title: "Skin-friendly Material",
    description: "Hypoallergenic and gentle on all skin types",
  },
];

export function ProductTrustBenefitsSection() {
  const [isLoaded] = useState(true);

  return (
    <section className="relative py-12 md:py-16">
      <div className="space-y-10 md:space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          {/* Eyebrow */}
          <span
            className={cn(
              "font-sans text-xs font-semibold uppercase tracking-[0.15em] text-secondary",
              "transition-all duration-700",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Why You&apos;ll Love It
          </span>

          {/* Title */}
          <h2
            className={cn(
              "font-heading text-2xl md:text-3xl lg:text-4xl",
              "text-foreground leading-tight",
              "transition-all duration-700 delay-100",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Designed for Your Transformation
          </h2>

          {/* Supporting Line */}
          <p
            className={cn(
              "font-sans text-base md:text-lg",
              "text-muted-foreground leading-relaxed max-w-xl",
              "transition-all duration-700 delay-200",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Every detail crafted to support your journey with confidence,
            comfort, and unmistakable luxury.
          </p>
        </div>

        <Separator className="bg-border/50" />

        {/* Benefits Grid - 2x2 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={benefit.title}
                className={cn(
                  "group bg-transparent border-border/30",
                  "transition-all duration-500",
                  "hover:border-secondary/40 hover:bg-card/30",
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: isLoaded ? `${(index + 3) * 100}ms` : "0ms" }}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "shrink-0 w-10 h-10",
                        "flex items-center justify-center",
                        "border border-secondary/30",
                        "transition-all duration-500",
                        "group-hover:border-secondary/60 group-hover:bg-secondary/5"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 text-foreground/70",
                          "transition-all duration-500",
                          "group-hover:text-secondary"
                        )}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3
                        className={cn(
                          "font-heading text-lg md:text-xl text-foreground",
                          "transition-colors duration-500",
                          "group-hover:text-secondary"
                        )}
                      >
                        {benefit.title}
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator className="bg-border/50" />

        {/* Trust Indicators Row */}
        <div
          className={cn(
            "flex flex-wrap justify-center gap-6 md:gap-12",
            "transition-all duration-700 delay-500",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {trustIndicators.map((indicator) => {
            const Icon = indicator.icon;
            return (
              <div
                key={indicator.label}
                className="flex items-center gap-3 px-4 py-2"
              >
                <Icon
                  className="w-4 h-4 text-secondary"
                  strokeWidth={1.5}
                />
                <span className="font-sans text-sm text-muted-foreground">
                  {indicator.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Material/Quality Highlight Card */}
        <Card
          className={cn(
            "relative overflow-hidden",
            "bg-card/20 border-border/30",
            "transition-all duration-700 delay-600",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {/* Subtle gold accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/40 to-transparent" />

          <CardContent className="p-8 md:p-10">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="font-sans text-xs uppercase tracking-wide border-secondary/40 text-secondary bg-secondary/5"
                >
                  Luxury Assurance
                </Badge>
              </div>

              <h3 className="font-heading text-xl md:text-2xl text-foreground">
                Uncompromising Quality Standards
              </h3>

              {/* Material Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {materialHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="group space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 flex items-center justify-center",
                            "border border-secondary/20",
                            "transition-all duration-300",
                            "group-hover:border-secondary/40"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4 h-4 text-foreground/60",
                              "transition-all duration-300",
                              "group-hover:text-secondary"
                            )}
                            strokeWidth={1.5}
                          />
                        </div>
                        <h4
                          className={cn(
                            "font-sans text-sm font-semibold text-foreground",
                            "transition-colors duration-300",
                            "group-hover:text-secondary"
                          )}
                        >
                          {item.title}
                        </h4>
                      </div>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed pl-11">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>

          {/* Subtle gold accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
        </Card>
      </div>
    </section>
  );
}

export default ProductTrustBenefitsSection;
