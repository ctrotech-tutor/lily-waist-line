"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Settings,
  Sun,
  Moon,
  X,
} from "lucide-react";
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

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/shipping",
    label: "Shipping",
    icon: Truck,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

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
                href="/admin"
                className="flex items-center gap-3"
                onClick={() => onOpenChange(false)}
              >
                <Image
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
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-none px-3 py-3 font-sans text-sm font-medium transition-all",
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
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex w-full items-center gap-3 px-3 py-2 font-sans text-sm font-medium text-sidebar-foreground transition-colors hover:text-sidebar-accent-foreground"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="hidden h-5 w-5 dark:block" />
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

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
