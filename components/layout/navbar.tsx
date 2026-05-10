"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Heart, ShoppingBag, User, Menu, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className={className}>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm border-r border-border bg-background">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <Image
                src="/logo.png"
                alt="Lily Waist Line"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <SheetTitle className="font-heading text-lg font-semibold tracking-tight">
                Lily Waist Line
              </SheetTitle>
            </Link>
          </div>
        </SheetHeader>

        <Separator className="bg-border" />

        <nav className="flex flex-col gap-1 py-6">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="px-4 py-3 font-heading text-lg font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <Separator className="bg-border" />

        <div className="flex flex-col gap-1 py-6">
          <SheetClose asChild>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-4 py-3 font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Heart className="h-5 w-5" />
              Wishlist
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/cart"
              className="flex items-center gap-3 px-4 py-3 font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              Cart
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/account"
              className="flex items-center gap-3 px-4 py-3 font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <User className="h-5 w-5" />
              Account
            </Link>
          </SheetClose>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-4 py-3 font-sans text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="hidden h-5 w-5 dark:block" />
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-5 md:px-12 lg:px-20">
        <div className="flex items-center gap-6">
          <MobileNav className="lg:hidden" />
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Lily Waist Line"
              width={36}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="hidden font-heading text-base font-semibold tracking-tight sm:inline-block">
              Lily Waist Line
            </span>
          </Link>
        </div>

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

        <div className="flex items-center gap-1">
          <ThemeToggle className="hidden lg:flex" />
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden lg:flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden lg:flex"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden lg:flex"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
