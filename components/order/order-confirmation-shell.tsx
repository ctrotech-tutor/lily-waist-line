"use client";

import { cn } from "@/lib/utils";

export interface OrderConfirmationShellProps {
  children: React.ReactNode;
  className?: string;
}

export function OrderConfirmationShell({
  children,
  className,
}: OrderConfirmationShellProps) {
  return (
    <div className={cn("min-h-full", className)}>
      {/* Centered Success Experience */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
