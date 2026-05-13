"use client";

import { useTheme } from "next-themes";
import { Menu, Sun, Moon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminTopbarProps {
  onMobileMenuClick: () => void;
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

export function AdminTopbar({ onMobileMenuClick }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur-xl md:px-8">
      {/* Left: Mobile Menu + Page Title */}
      <div className="flex items-center gap-4">
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
          <p className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Administrative Panel
          </p>
        </div>
      </div>

      {/* Right: Theme Toggle + Admin Avatar */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="flex items-center gap-3 pl-4">
          <div className="hidden text-right sm:block">
            <p className="font-sans text-sm font-medium">Admin User</p>
            <p className="font-sans text-xs text-muted-foreground">
              administrator
            </p>
          </div>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
