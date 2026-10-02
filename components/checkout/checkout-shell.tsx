"use client";

import { cn } from "@/lib/utils";

export interface CheckoutShellProps {
  children: React.ReactNode;
  summary: React.ReactNode;
  className?: string;
}

export function CheckoutShell({
  children,
  summary,
  className,
}: CheckoutShellProps) {
  return (
    <div className={cn("min-h-full", className)}>
      {/* Main Layout Container */}
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
        {/* Desktop: 2-Column | Mobile: Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Checkout Steps Area */}
          <div className="lg:col-span-2 order-1">
            {children}
          </div>

          {/* Right Column - Summary Panel (Sticky on Desktop) */}
          <div className="lg:col-span-1 order-2 lg:order-2">
            <div className="lg:sticky lg:top-8">
              {summary}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
