"use client";

import { cn } from "@/lib/utils";

export interface PaymentProofShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PaymentProofShell({
  children,
  className,
}: PaymentProofShellProps) {
  return (
    <div className={cn("min-h-full", className)}>
      {/* Centered Upload Experience */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
