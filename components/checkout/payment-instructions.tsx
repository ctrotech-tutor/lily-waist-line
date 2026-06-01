"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { paymentConfigKeys } from "@/lib/react-query/query-keys";

import { getPaymentConfiguration } from "@/server/actions/payment/get-payment-config";

import type { PaymentConfig } from "@/types/payment";

interface PaymentInstructionsProps {
  method: string | null | undefined;
  className?: string;
}

export function PaymentInstructions({
  method,
  className,
}: PaymentInstructionsProps) {
  const { data: configs, isLoading } = useQuery({
    queryKey: paymentConfigKeys.base(),
    queryFn: async () => {
      const result = await getPaymentConfiguration();
      if (!result.success || !result.data) {
        throw new Error("Failed to load payment configuration");
      }
      return result.data as PaymentConfig[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const config = method
    ? configs?.find(
        (c) => c.paymentMethod.toLowerCase() === method.toLowerCase()
      ) ?? null
    : null;

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

  if (isLoading) {
    return (
      <Card
        className={cn(
          "border border-border bg-muted/30 p-5 md:p-6 rounded-2xl",
          className
        )}
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  const isCashApp = method.toLowerCase() === "cashapp";

  const cashAppHandle = isCashApp
    ? config?.cashAppHandle
    : null;

  const paypalEmail = !isCashApp
    ? config?.paypalEmail
    : null;

  if (isCashApp) {
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
              Cash App Payment
            </h4>

            <Badge
              variant="secondary"
              className="mt-1 bg-primary/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary"
            >
              US Orders Only
            </Badge>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-4 h-px w-full bg-border/50" />

        {/* Instructions */}
        <div className="space-y-4">
          {/* Handle */}
          <div>
            <p className="mb-2 font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Cash App Handle
            </p>

            <div className="flex items-center gap-2 border border-primary/20 bg-card p-3 rounded-lg">
              <span className="font-sans text-lg font-semibold text-primary">
                $
              </span>

              <span className="font-sans text-sm text-foreground">
                {cashAppHandle || "Not Configured"}
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="flex items-start gap-3">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p className="font-sans text-sm leading-relaxed text-foreground">
              Send payment via Cash App after order
              confirmation. You will receive detailed
              instructions via email.
            </p>
          </div>
        </div>
      </Card>
    );
  }

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
              PayPal Payment
            </h4>

          <Badge
            variant="secondary"
            className="mt-1 bg-primary/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary"
          >
            Global Payments
          </Badge>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-4 h-px w-full bg-border/50" />

      {/* Instructions */}
      <div className="space-y-4">
        {/* Email */}
        <div>
          <p className="mb-2 font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
            PayPal Email
          </p>

          <div className="border border-primary/20 bg-card p-3 rounded-lg">
            <span className="font-sans text-sm text-foreground">
              {paypalEmail || "Not Configured"}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <p className="font-sans text-sm leading-relaxed text-foreground">
            You will be redirected to PayPal after placing
            your order. Complete payment securely through
            PayPal&apos;s trusted platform.
          </p>
        </div>
      </div>
    </Card>
  );
}