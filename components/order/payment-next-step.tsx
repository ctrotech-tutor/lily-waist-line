"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ArrowRight,
  DollarSign,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPaymentConfiguration } from "@/server/actions/payment/get-payment-config";

export type PaymentMethodType = "cashapp" | "paypal" | null;

export interface PaymentNextStepProps {
  method: PaymentMethodType;
  className?: string;
}

export function PaymentNextStep({
  method,
  className,
}: PaymentNextStepProps) {
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);

  useEffect(() => {
    if (method) {
      setConfigLoading(true);
      getPaymentConfiguration().then((result) => {
        if (result.success && result.data) {
          const config = result.data.find(
            (c: any) => c.paymentMethod === (method === "cashapp" ? "CASH_APP" : "PAYPAL")
          );
          setPaymentConfig(config);
        }
        setConfigLoading(false);
      });
    }
  }, [method]);

  const handleCompletePayment = () => {
    setIsLoading(true);
    // Simulate loading - UI only, no real payment processing
    setTimeout(() => {
      setIsLoading(false);
      setShowInstructions(true);
    }, 1500);
  };

  if (!method) {
    return (
      <Card
        className={cn(
          "p-6 md:p-8 border border-border bg-muted/30",
          className
        )}
      >
        <div className="text-center">
          <p className="font-sans text-sm text-muted-foreground">
            Payment method information will appear here after order placement.
          </p>
        </div>
      </Card>
    );
  }

  if (configLoading) {
    return (
      <Card
        className={cn(
          "p-6 md:p-8 border border-border bg-muted/30",
          className
        )}
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        </div>
      </Card>
    );
  }

  const isCashApp = method === "cashapp";
  const handle = isCashApp ? paymentConfig?.cashAppHandle : null;
  const email = !isCashApp ? paymentConfig?.paypalEmail : null;

  return (
    <Card
      className={cn(
        "p-6 md:p-8 border border-[#d4af37]/30 bg-[#d4af37]/5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/10">
          <CreditCard className="w-5 h-5 text-[#d4af37]" />
        </div>
        <div>
          <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground">
            {isCashApp ? "Cash App Payment" : "PayPal Payment"}
          </h2>
          <Badge
            variant="secondary"
            className="bg-[#d4af37]/20 text-[#d4af37] font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 mt-1"
          >
            {isCashApp ? "US Orders Only" : "Global Payments"}
          </Badge>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border/50 mb-6" />

      {/* Payment Details */}
      <div className="space-y-5 mb-6">
        {/* Handle/Email */}
        <div>
          <p className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {isCashApp ? "Cash App Handle" : "PayPal Email"}
          </p>
          <div className="flex items-center gap-2 p-3 border border-[#d4af37]/20 bg-card">
            {isCashApp ? (
              <>
                <span className="text-[#d4af37] font-sans text-lg font-semibold">
                  $
                </span>
                <span className="font-sans text-sm text-foreground">
                  {handle || "Loading..."}
                </span>
              </>
            ) : (
              <span className="font-sans text-sm text-foreground">
                {email || "Loading..."}
              </span>
            )}
          </div>
        </div>

        {/* Instruction Text */}
        <div className="flex items-start gap-3">
          <ArrowRight className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-foreground leading-relaxed">
            {isCashApp
              ? "Send your payment using the Cash App details below."
              : "Complete your payment securely through PayPal."}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={handleCompletePayment}
        disabled={isLoading || showInstructions}
        className="w-full h-12 bg-[#d4af37] hover:bg-[#d4af37]/90 text-black font-sans text-sm font-semibold uppercase tracking-wider rounded-none transition-all duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : showInstructions ? (
          <>
            <DollarSign className="w-4 h-4 mr-2" />
            Payment Instructions Sent
          </>
        ) : (
          <>
            <ExternalLink className="w-4 h-4 mr-2" />
            Complete Payment
          </>
        )}
      </Button>

      {/* Instructions Panel (shown after button click) */}
      {showInstructions && (
        <div className="mt-6 p-4 border border-[#d4af37]/20 bg-card/50">
          <p className="font-sans text-sm text-foreground leading-relaxed">
            {isCashApp
              ? "Please open your Cash App and send the payment to the handle shown above. Include your order number in the payment note."
              : "You will be redirected to PayPal to complete your payment securely."}
          </p>
        </div>
      )}
    </Card>
  );
}
