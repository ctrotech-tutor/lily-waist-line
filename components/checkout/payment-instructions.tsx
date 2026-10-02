"use client";

import { CreditCard, ArrowRight, AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

interface PaymentInstructionsProps {
  method: string | null | undefined;
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
          "border border-border bg-muted/30 p-5 md:p-6 rounded-2xl",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

          <div>
            <h4 className="mb-1 font-sans text-sm font-semibold text-foreground">
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

  const isCashApp = method.toLowerCase() === "cashapp";

  return (
    <Card
      className={cn(
        "border border-primary/30 bg-primary/5 p-5 transition-all duration-300 md:p-6 rounded-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10 rounded-lg">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-foreground">
            {isCashApp ? "Cash App Payment" : "PayPal Payment"}
          </h4>

          <Badge
            variant="secondary"
            className="mt-1 bg-primary/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary"
          >
            {isCashApp ? "US Orders Only" : "Global Payments"}
          </Badge>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-4 h-px w-full bg-border/50" />

      {/* Instructions */}
      <div className="flex items-start gap-3">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

        <p className="font-sans text-sm leading-relaxed text-foreground">
          {isCashApp
            ? "Send payment via Cash App after order confirmation. You will receive detailed instructions via email."
            : "You will be redirected to PayPal after placing your order. Complete payment securely through PayPal&apos;s trusted platform."}
        </p>
      </div>
    </Card>
  );
}
