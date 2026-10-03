"use client";

import { AlertCircle, ArrowRight, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getPaymentDestination, type PaymentMethodConfiguration } from "@/lib/services/payment-policy";
import type { UIPaymentMethod } from "@/types/checkout";

interface PaymentInstructionsProps {
  method: UIPaymentMethod | null | undefined;
  configuration?: PaymentMethodConfiguration | null;
  amount: number;
  className?: string;
}

export function PaymentInstructions({
  method,
  configuration,
  amount,
  className,
}: PaymentInstructionsProps) {
  if (!method) {
    return (
      <Card className={cn("border border-border bg-muted/30 p-5 md:p-6 rounded-2xl", className)}>
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <h4 className="mb-1 font-sans text-sm font-semibold text-foreground">Select a Payment Method</h4>
            <p className="font-sans text-sm text-muted-foreground">Available methods depend on your shipping address and current payment settings.</p>
          </div>
        </div>
      </Card>
    );
  }

  const isCashApp = method === "cashapp";
  const paymentMethod = isCashApp ? "CASH_APP" : "PAYPAL";
  const destination = getPaymentDestination(paymentMethod, configuration, amount);

  if (!destination) {
    return (
      <Card className={cn("border border-destructive/30 bg-destructive/5 p-5 md:p-6 rounded-2xl", className)}>
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="font-sans text-sm text-muted-foreground">
            Payment details are temporarily unavailable. Please choose another available method or contact support.
          </p>
        </div>
      </Card>
    );
  }

  const methodLabel = isCashApp ? "Cash App" : "PayPal";
  const isEmailOnlyPayPal = !isCashApp && destination.url === null;

  return (
    <Card className={cn("border border-primary/30 bg-primary/5 p-5 transition-all duration-300 md:p-6 rounded-2xl", className)}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10 rounded-lg">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-heading text-base font-semibold text-foreground">{methodLabel} Payment</h4>
          <Badge variant="secondary" className="mt-1 bg-primary/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary">
            {isCashApp ? "US Orders Only" : "International Orders"}
          </Badge>
        </div>
      </div>

      <div className="mb-4 h-px w-full bg-border/50" />

      <dl className="space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">Send to</dt>
          <dd className="text-right font-semibold text-foreground">{destination.recipient}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">Amount due</dt>
          <dd className="text-right font-semibold text-foreground">${amount.toFixed(2)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-start gap-3 border-t border-border/50 pt-4">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          {isEmailOnlyPayPal
            ? "Open PayPal and send the amount above to this merchant email address. We will email these payment details again after your order is placed."
            : "Use the payment link below after placing your order. We will also email the exact amount and instructions."}
        </p>
      </div>

      {destination.url && (
        <a
          href={destination.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
        >
          Open {methodLabel}
        </a>
      )}
    </Card>
  );
}
