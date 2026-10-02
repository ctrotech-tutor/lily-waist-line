"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Heart,
  ShoppingBag,
  User,
  Sun,
  Moon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { OptimizedImage } from "../shared/optimized-image";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";
import { ROUTES } from "@/lib/constants/routes";
import { useCart } from "@/hooks/use-cart";

const navLinks = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.SHOP, label: "Shop" },
  { href: ROUTES.ABOUT, label: "About" },
  { href: ROUTES.CONTACT, label: "Contact" },
];

/* ---------------- THEME TOGGLE ---------------- */
function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full",
        "border border-border transition-colors hover:bg-muted",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

/* ---------------- NAVBAR ---------------- */
export function Navbar() {
  const { data: cart } = useCart();
  const totalItems = cart?.summary?.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-5 md:px-12 lg:px-20">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <MobileNav className="lg:hidden" />

          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-3"
          >
            <OptimizedImage
              src="/logo.png"
              alt="Lily Waist Line"
              width={36}
              height={32}
              priority
              className="h-9 w-auto object-contain"
            />

            <span className="hidden sm:inline-block font-heading text-base font-semibold tracking-tight">
              Lily Waist Line
            </span>
          </Link>
        </div>

        {/* CENTER NAV */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-sans text-sm font-medium text-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:text-primary hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          <SearchDialog />

          <ThemeToggle className="hidden lg:flex" />

          <Link
            href={ROUTES.WISHLIST}
            className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
          </Link>

          <Link
            href={ROUTES.CART}
            className="relative hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <Link
            href={ROUTES.ACCOUNT}
            className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </Link>

          <div className="lg:hidden">
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
}