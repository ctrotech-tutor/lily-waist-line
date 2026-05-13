"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Heart, ShoppingBag, User, Menu, X, Sun, Moon } from "lucide-react";
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

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className={className}>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full max-w-sm border-r border-border bg-background p-0"
      >
        <SheetHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-3" 
              onClick={() => setOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="Lily Waist Line"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <SheetTitle className="font-heading text-lg font-semibold tracking-tight text-foreground">
                Lily Waist Line
              </SheetTitle>
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <Separator className="bg-border" />

        <nav className="flex flex-col py-6">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="px-6 py-4 font-heading text-xl font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <Separator className="bg-border" />

        <div className="flex flex-col py-6">
          <SheetClose asChild>
            <Link
              href="/wishlist"
              className="flex items-center gap-4 px-6 py-4 font-sans text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <Heart className="h-5 w-5" />
              Wishlist
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/cart"
              className="flex items-center gap-4 px-6 py-4 font-sans text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              Cart
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/account"
              className="flex items-center gap-4 px-6 py-4 font-sans text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <User className="h-5 w-5" />
              Account
            </Link>
          </SheetClose>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-4 px-6 py-4 font-sans text-sm font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-muted hover:text-primary"
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
