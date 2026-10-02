"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

import { OptimizedImage } from "@/components/shared/optimized-image";
import { ROUTES } from "@/lib/constants/routes";

function FacebookIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function InstagramIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />

      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />

      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const navLinks = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.SHOP, label: "Shop" },
  { href: ROUTES.ABOUT, label: "About" },
  { href: ROUTES.CONTACT, label: "Contact" },
];

const policyLinks = [
  { href: ROUTES.SHIPPING, label: "Shipping Policy" },
  { href: ROUTES.RETURNS, label: "Returns Policy" },
  { href: ROUTES.PRIVACY, label: "Privacy Policy" },
  { href: ROUTES.TERMS, label: "Terms & Conditions" },
];

const socialLinks = [
  {
    href: "#",
    label: "Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "#",
    label: "Facebook",
    Icon: FacebookIcon,
  },
  {
    href: "#",
    label: "TikTok",
    Icon: TikTokIcon,
  },
];

export function Footer() {
  return (
    <footer
      className={cn(
        "relative overflow-hidden",
        "border-t border-border/60",
        "bg-background"
      )}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="absolute right-0 top-0 h-72 w-72 bg-primary/5 blur-[140px]" />

      <div className="mx-auto max-w-360 px-5 py-14 md:px-8 lg:px-12 lg:py-20">

        {/* TOP */}
        <div
          className={cn(
            "grid gap-12",
            "lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]"
          )}
        >

          {/* BRAND */}
          <div className="max-w-md">

            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-3"
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center",
                  "rounded-2xl",
                  "border border-border/60",
                  "bg-card"
                )}
              >
                <OptimizedImage
                  src="/logo.png"
                  alt="Lily Waist Line"
                  width={42}
                  height={42}
                  className="h-10 w-auto object-contain"
                  fallbackSrc="/logo.svg"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
                  Lily Waist Line
                </span>

                <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary">
                  Sculptwear Luxury
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-sm font-sans text-sm leading-7 text-muted-foreground">
              Premium waist trainers and sculptwear crafted for women who embrace discipline,
              confidence, and transformation.
            </p>

            {/* SOCIAL */}
            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={cn(
                    "group flex h-11 w-11 items-center justify-center",
                    "rounded-full",
                    "border border-border/70",
                    "bg-card",
                    "text-muted-foreground",
                    "transition-all duration-300",
                    "hover:border-primary/50",
                    "hover:bg-primary/10",
                    "hover:text-primary"
                  )}
                >
                  <social.Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* MOBILE STACK LINKS */}
          <div className="flex flex-col gap-10 md:flex-row md:gap-16 lg:contents">

            {/* NAVIGATION */}
            <div>
              <h3
                className={cn(
                  "mb-5",
                  "font-sans text-xs font-semibold uppercase tracking-[0.22em]",
                  "text-foreground"
                )}
              >
                Navigation
              </h3>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group inline-flex items-center justify-between",
                      "rounded-xl px-3 py-3",
                      "font-sans text-sm text-muted-foreground",
                      "transition-all duration-300",
                      "hover:bg-card hover:text-primary"
                    )}
                  >
                    <span>{link.label}</span>

                    <ChevronRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* POLICIES */}
            <div>
              <h3
                className={cn(
                  "mb-5",
                  "font-sans text-xs font-semibold uppercase tracking-[0.22em]",
                  "text-foreground"
                )}
              >
                Policies
              </h3>

              <nav className="flex flex-col gap-1">
                {policyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group inline-flex items-center justify-between",
                      "rounded-xl px-3 py-3",
                      "font-sans text-sm text-muted-foreground",
                      "transition-all duration-300",
                      "hover:bg-card hover:text-primary"
                    )}
                  >
                    <span>{link.label}</span>

                    <ChevronRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* NEWSLETTER / CTA */}
            <div>
              <h3
                className={cn(
                  "mb-5",
                  "font-sans text-xs font-semibold uppercase tracking-[0.22em]",
                  "text-foreground"
                )}
              >
                Stay Connected
              </h3>

              <p className="mb-6 font-sans text-sm leading-7 text-muted-foreground">
                Receive exclusive drops, styling inspiration, and special offers.
              </p>

              <Link
                href={ROUTES.SHOP}
                className={cn(
                  "group inline-flex items-center gap-2",
                  "rounded-full",
                  "bg-primary px-6 py-3",
                  "font-sans text-xs font-semibold uppercase tracking-[0.18em]",
                  "text-primary-foreground",
                  "transition-all duration-300",
                  "hover:scale-[1.03]"
                )}
              >
                Shop Collection

                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

          </div>
        </div>

        <Separator className="my-10 bg-border/60 lg:my-14" />

        {/* BOTTOM */}
        <div
          className={cn(
            "flex flex-col gap-4",
            "text-center md:flex-row md:items-center md:justify-between md:text-left"
          )}
        >
          <p className="font-sans text-xs leading-6 text-muted-foreground">
            © {new Date().getFullYear()} Lily Waist Line. All rights reserved.
          </p>

          <div
            className={cn(
              "flex flex-col items-center gap-2",
              "sm:flex-row sm:justify-center sm:gap-6",
              "md:justify-end"
            )}
          >
            <span className="font-sans text-xs text-muted-foreground">
              Designed for transformation.
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-primary/50 sm:block" />

            <span className="font-sans text-xs text-muted-foreground">
              Crafted with precision.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

