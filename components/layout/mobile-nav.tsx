"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  Sun,
  Moon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Separator } from "@/components/ui/separator";

import { OptimizedImage } from "../shared/optimized-image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  const { theme, setTheme } = useTheme();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DrawerTrigger asChild>
        <button
          aria-label="Open menu"
          className={cn(
            "flex h-10 w-10 items-center justify-center",
            "rounded-full border border-border",
            "transition-colors hover:bg-muted",
            className
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
      </DrawerTrigger>

      {/* Drawer */}
      <DrawerContent className="h-[92vh] border-border bg-background p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <OptimizedImage
              src="/logo.png"
              alt="Lily Waist Line"
              width={40}
              height={40}
              priority
              className="h-10 w-auto object-contain"
            />

            <span className="font-heading text-lg font-semibold tracking-tight">
              Lily Waist Line
            </span>
          </Link>
          <DrawerTitle className="sr-only">
            Navigation Menu
          </DrawerTitle>
        </div>

        <Separator />

        {/* Main Nav */}
        <nav className="flex flex-col py-6">
          {navLinks.map((link) => (
            <DrawerClose asChild key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "px-6 py-4",
                  "font-heading text-xl font-medium",
                  "text-foreground",
                  "transition-colors hover:bg-muted hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            </DrawerClose>
          ))}
        </nav>

        <Separator />

        {/* Utility Nav */}
        <div className="flex flex-col py-6">
          <DrawerClose asChild>
            <Link
              href="/wishlist"
              className="flex items-center gap-4 px-6 py-4 font-sans text-sm font-medium uppercase tracking-wide transition-colors hover:bg-muted hover:text-primary"
            >
              <Heart className="h-5 w-5" />
              Wishlist
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href="/cart"
              className="flex items-center gap-4 px-6 py-4 font-sans text-sm font-medium uppercase tracking-wide transition-colors hover:bg-muted hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              Cart
            </Link>
          </DrawerClose>

          <DrawerClose asChild>
            <Link
              href="/account"
              className="flex items-center gap-4 px-6 py-4 font-sans text-sm font-medium uppercase tracking-wide transition-colors hover:bg-muted hover:text-primary"
            >
              <User className="h-5 w-5" />
              Account
            </Link>
          </DrawerClose>

          {/* Theme Toggle */}
          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="flex items-center gap-4 px-6 py-4 font-sans text-sm font-medium uppercase tracking-wide transition-colors hover:bg-muted hover:text-primary"
          >
            <Sun className="h-5 w-5 dark:hidden" />

            <Moon className="hidden h-5 w-5 dark:block" />

            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}