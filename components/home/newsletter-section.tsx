"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [isLoaded] = useState(true);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Newsletter signup:", email);
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-20">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[140px]" />

      <div className="relative mx-auto max-w-360 px-5 sm:px-6 lg:px-8 xl:px-12">
        {/* Main container */}
        <div
          className={cn(
            "mx-auto max-w-4xl overflow-hidden rounded-[40px]",
            "bg-card/30 backdrop-blur-xl",
            "px-6 py-14 sm:px-10 md:px-16 md:py-20",
            "transition-all duration-1000",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
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
              Exclusive Access
            </span>
          </div>

          {/* Heading */}
          <h2
            className={cn(
              "mb-6 text-center font-heading text-3xl leading-[1.1] tracking-tight text-foreground",
              "sm:text-4xl md:text-5xl lg:text-6xl",
              "transition-all duration-700 delay-100",
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
          >
            Own Your Transformation
          </h2>

          {/* Copy */}
          <p
            className={cn(
              "mx-auto mb-12 max-w-2xl text-center font-sans text-base leading-relaxed text-muted-foreground sm:text-lg",
              "transition-all duration-700 delay-200",
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
          >
            Be first to discover new arrivals, exclusive offers, and inspiring
            transformation stories crafted for women who demand excellence.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={cn(
              "transition-all duration-700 delay-300",
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
          >
            <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
              {/* Input */}
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={cn(
                  "h-14 flex-1 rounded-full border-border/30",
                  "bg-background/60 px-6 backdrop-blur-md",
                  "font-sans",
                  "placeholder:text-muted-foreground/60",
                  "focus-visible:ring-primary"
                )}
              />

              {/* Button */}
              <Button
                type="submit"
                className={cn(
                  "h-14 rounded-full px-8",
                  "bg-primary text-primary-foreground",
                  "font-sans text-sm font-semibold uppercase tracking-[0.15em]",
                  "transition-all duration-300",
                  "hover:scale-[1.03] hover:bg-primary"
                )}
              >
                Join Now
              </Button>
            </div>

            {/* Helper */}
            <p className="mt-5 text-center font-sans text-xs tracking-wide text-muted-foreground/60">
              Join a community of women transforming their confidence.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;