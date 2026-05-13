"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaymentProofHeaderProps {
  className?: string;
}

export function PaymentProofHeader({
  className,
}: PaymentProofHeaderProps) {
  return (
    <div className={cn("text-center", className)}>
      {/* Upload Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border-2 border-[#d4af37]/30 bg-[#d4af37]/10">
          <Upload className="w-10 h-10 md:w-12 md:h-12 text-[#d4af37]" />
        </div>
      </div>

      {/* Title */}
      <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-4">
        Upload Payment Proof
      </h1>

      {/* Supporting Copy */}
      <p className="font-sans text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
        Upload your payment screenshot so we can verify and begin processing your order.
      </p>
    </div>
  );
}
