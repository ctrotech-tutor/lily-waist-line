"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
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
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const policyLinks = [
  { href: "/shipping", label: "Shipping Policy" },
  { href: "/returns", label: "Returns Policy" },
  { href: "/privacy", label: "Privacy Policy" },
];

const socialLinks = [
  { href: "#", label: "Instagram", Icon: InstagramIcon },
  { href: "#", label: "WhatsApp", Icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-360 px-5 py-16 md:px-12 lg:px-20 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Lily Waist Line"
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
              <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
                Lily Waist Line
              </span>
            </Link>
            <p className="max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
              Premium waist trainers and shapewear for the modern woman. 
              Sculpt your silhouette with luxury and confidence.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Policies
            </h3>
            <nav className="flex flex-col gap-2">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center border border-border bg-transparent text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label={social.label}
                >
                  <social.Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <p className="font-sans text-xs text-muted-foreground">
              Follow us for exclusive offers and styling tips.
            </p>
          </div>
        </div>

        <Separator className="my-12 bg-border" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-sans text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lily Waist Line. All rights reserved.
          </p>
          <p className="font-sans text-xs text-muted-foreground">
            Crafted with precision and passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
