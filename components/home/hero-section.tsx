"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden",
        "pt-24"
      )}
    >
      {/* Background Image */}
      <div
        className={cn(
          "absolute inset-0 z-0 bg-cover bg-no-repeat"
        )}
        style={{
          backgroundImage: "url('/Lily-Waistline940-960px.png')",
          backgroundPosition: "50% 60%",
        }}
      >
        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0",
            "bg-linear-to-t",
            "from-background via-background/60 to-black/20"
          )}
        />

        {/* Gold atmosphere */}
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

        <div className="absolute left-0 bottom-20 h-72 w-72 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 mx-auto",
          "flex max-w-5xl flex-col items-center text-center",
          "px-4 sm:px-6 lg:px-8"
        )}
      >
        {/* Eyebrow */}
        <span
          className={cn(
            "mb-6",
            "font-sans text-xs font-semibold uppercase tracking-[0.3em]",
            "text-primary"
          )}
        >
          Premium Sculptwear
        </span>

        {/* Heading */}
        <h1
          className={cn(
            "mb-6",
            "font-heading tracking-tight text-foreground",
            "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
            "leading-[1.05]"
          )}
        >
          The Silhouette
          <br />
          of Self-Discipline
        </h1>

        {/* Copy */}
        <p
          className={cn(
            "mb-10 max-w-2xl",
            "font-sans text-base sm:text-lg",
            "leading-relaxed text-muted-foreground"
          )}
        >
          Empowering modern women through premium waist trainers
          designed for confidence, discipline, and transformation.
        </p>

        {/* CTA */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Primary */}
          <Button asChild size="lg" className="px-8 h-12 font-sans text-sm font-semibold uppercase tracking-[0.15em] hover:scale-[1.03]">
            <Link href={ROUTES.SHOP}>
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Secondary */}
          <Button
            variant="outline"
            size="lg"
            className="px-8 h-12 border-primary/30 bg-white/5 backdrop-blur-md font-sans text-sm font-semibold uppercase tracking-[0.15em] text-foreground hover:bg-white/10 hover:border-primary/50"
            onClick={() => {
              const el = document.getElementById("featured");
              el?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Explore Collection
          </Button>
        </div>
      </div>

      {/* Bottom fade */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" /> */}
    </section>
  );
}

