"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminUser } from "@/hooks/admin/use-admin-user";
import { adminNavItems } from "@/lib/admin-nav";

interface AdminTopbarProps {
  onMobileMenuClick: () => void;
  onToggleSidebar: () => void;
}

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

function AdminUserDisplay() {
  const { data: user, isLoading, isError } = useAdminUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 pl-4">
        <div className="hidden h-9 w-9 animate-pulse rounded-lg bg-muted sm:block" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex items-center gap-3 pl-4">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 pl-4">
      <div className="hidden text-right sm:block">
        <p className="font-sans text-sm font-medium">{user.fullName}</p>
        <p className="font-sans text-xs text-muted-foreground">
          {user.email}
        </p>
      </div>
      <Avatar className="h-9 w-9 border border-border">
        <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export function AdminTopbar({ onMobileMenuClick, onToggleSidebar }: AdminTopbarProps) {
  const pathname = usePathname();

  const currentPageLabel = adminNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )?.label || "Admin";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-5 md:px-8">
      {/* Left: Sidebar Toggle + Mobile Menu + Page Title */}
      <div className="flex items-center gap-4">
        {/* Desktop sidebar collapse */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </Button>
        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMobileMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:block">
          <p className="font-sans text-sm font-medium text-foreground">
            {currentPageLabel}
          </p>
        </div>
      </div>

      {/* Right: Theme Toggle + Admin User */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AdminUserDisplay />
      </div>
    </header>
  );
}