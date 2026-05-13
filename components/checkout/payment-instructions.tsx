"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "./payment-method-selector";

interface PaymentInstructionsProps {
  method: PaymentMethod | null;
  className?: string;
}

export function PaymentInstructions({
  method,
  className,
}: PaymentInstructionsProps) {
  if (!method) {
    return (
      <Card
        className={cn(
          "p-5 md:p-6 border border-border bg-muted/30",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <h4 className="font-sans text-sm font-semibold text-foreground mb-1">
              Select a Payment Method
            </h4>
            <p className="font-sans text-sm text-muted-foreground">
              Choose how you would like to pay for your order
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (method === "cashapp") {
    return (
      <Card
        className={cn(
          "p-5 md:p-6 border border-[#d4af37]/30 bg-[#d4af37]/5",
          "transition-all duration-300",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/10">
            <CreditCard className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold text-foreground">
              Cash App Payment
            </h4>
            <Badge
              variant="secondary"
              className="bg-[#d4af37]/20 text-[#d4af37] font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 mt-1"
            >
              US Orders Only
            </Badge>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border/50 mb-4" />

        {/* Instructions */}
        <div className="space-y-4">
          {/* Cash App Handle Placeholder */}
          <div>
            <p className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Cash App Handle
            </p>
            <div className="flex items-center gap-2 p-3 border border-[#d4af37]/20 bg-card">
              <span className="text-[#d4af37] font-sans text-lg font-semibold">
                $
              </span>
              <span className="font-sans text-sm text-muted-foreground">
                (Your handle will appear here)
              </span>
            </div>
          </div>

          {/* Instruction Text */}
          <div className="flex items-start gap-3">
            <ArrowRight className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-foreground leading-relaxed">
              Send payment via Cash App after order confirmation. You will
              receive detailed instructions via email.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // PayPal
  return (
    <Card
      className={cn(
        "p-5 md:p-6 border border-[#d4af37]/30 bg-[#d4af37]/5",
        "transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/10">
          <CreditCard className="w-5 h-5 text-[#d4af37]" />
        </div>
        <div>
          <h4 className="font-heading text-base font-semibold text-foreground">
            PayPal Payment
          </h4>
          <Badge
            variant="secondary"
            className="bg-[#d4af37]/20 text-[#d4af37] font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 mt-1"
          >
            Global Payments
          </Badge>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border/50 mb-4" />

      {/* Instructions */}
      <div className="space-y-4">
        {/* PayPal Email Placeholder */}
        <div>
          <p className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            PayPal Email
          </p>
          <div className="p-3 border border-[#d4af37]/20 bg-card">
            <span className="font-sans text-sm text-muted-foreground">
              (Merchant email will appear here)
            </span>
          </div>
        </div>

        {/* Instruction Text */}
        <div className="flex items-start gap-3">
          <ArrowRight className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-foreground leading-relaxed">
            You will be redirected to PayPal after placing your order. Complete
            payment securely through PayPal&apos;s trusted platform.
          </p>
        </div>
      </div>
    </Card>
  );
}
