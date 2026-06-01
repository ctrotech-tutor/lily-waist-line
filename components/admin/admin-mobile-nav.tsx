"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, X, ExternalLink } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes"
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { adminNavItems } from "@/lib/admin-nav";

interface AdminMobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminMobileNav({ open, onOpenChange }: AdminMobileNavProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full max-w-sm border-r border-border bg-sidebar p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="border-b border-sidebar-border px-5 py-4">
            <div className="flex items-center justify-between">
              <Link
                href={ROUTES.ADMIN}
                className="flex items-center gap-3"
                onClick={() => onOpenChange(false)}
              >
                <OptimizedImage
                  src="/logo.png"
                  alt="Lily Waist Line"
                  width={36}
                  height={36}
                  className="h-9 w-auto object-contain"
                  priority
                />
                <SheetTitle className="font-heading text-base font-semibold tracking-tight text-sidebar-foreground">
                  Admin
                </SheetTitle>
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="flex flex-col gap-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === ROUTES.ADMIN
                    ? pathname === ROUTES.ADMIN
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 font-sans text-sm font-medium transition-all",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isActive
                            ? "text-sidebar-primary-foreground"
                            : "text-sidebar-foreground"
                        )}
                      />
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </ScrollArea>

          <Separator className="bg-sidebar-border" />

          {/* Footer */}
          <div className="space-y-4 p-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-start gap-3 px-3 py-2 text-sidebar-foreground hover:text-sidebar-accent-foreground"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="hidden h-5 w-5 dark:block" />
            </Button>

            <Link
              href={ROUTES.HOME}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Back to Store
            </Link>

            <div>
              <p className="font-sans text-xs text-sidebar-foreground/60">
                Lily Waist Line Admin
              </p>
              <p className="mt-1 font-sans text-[10px] uppercase tracking-wider text-sidebar-foreground/40">
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}