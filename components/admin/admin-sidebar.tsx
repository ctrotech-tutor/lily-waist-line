"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ROUTES } from "@/lib/constants/routes";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { adminNavItems } from "@/lib/admin-nav";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-3">
        <OptimizedImage
          src="/logo.png"
          alt="Lily Waist Line"
          width={36}
          height={32}
          className="h-9 w-auto shrink-0 object-contain"
          priority
        />
        {!collapsed && (
          <span className="font-heading text-base font-semibold tracking-tight text-sidebar-foreground">
            Admin
          </span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === ROUTES.ADMIN
                ? pathname === ROUTES.ADMIN
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 font-sans text-sm font-medium transition-all",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive
                      ? "text-sidebar-primary-foreground"
                      : "text-sidebar-foreground"
                  )}
                />
                {!collapsed && item.label}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" className="font-sans text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-sidebar-border" />

      {/* Collapsed mode */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-2 p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={ROUTES.HOME}
                className="flex h-8 w-8 items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                aria-label="Back to Store"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-sans text-xs">
              Back to Store
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="p-4">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors mb-2"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Back to Store
          </Link>
          <p className="font-sans text-xs text-sidebar-foreground/60">
            Lily Waist Line Admin
          </p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-wider text-sidebar-foreground/40">
            v1.0.0
          </p>
        </div>
      )}
    </div>
  );
}