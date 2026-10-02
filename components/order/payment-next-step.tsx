"use client";

import { useState } from "react";
import { CreditCard, ArrowRight, ExternalLink, Loader2, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sendPaymentInstructions } from "@/server/actions/payment/send-payment-instructions";
import { toast } from "sonner";

export type PaymentMethodType = "cashapp" | "paypal" | null;

export interface PaymentNextStepProps {
  method: PaymentMethodType;
  orderId?: string;
  className?: string;
}

export function PaymentNextStep({
  method,
  orderId,
  className,
}: PaymentNextStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleCompletePayment = async () => {
    if (!orderId) {
      toast.error("Order ID is required to send payment instructions");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendPaymentInstructions({ orderId });
      if (result.success) {
        setEmailSent(true);
        setShowInstructions(true);
        toast.success("Payment instructions sent to your email");
      } else {
        toast.error(result.message || "Failed to send payment instructions");
      }
    } catch (error) {
      console.error("Error sending payment instructions:", error);
      toast.error("An error occurred while sending payment instructions");
    } finally {
      setIsLoading(false);
    }
  };

  if (!method) {
    return (
      <Card className={cn("p-6 md:p-8 border border-border bg-muted/30 rounded-lg", className)}>
        <div className="text-center">
          <p className="font-sans text-sm text-muted-foreground">
            Payment method information will appear here after order placement.
          </p>
        </div>
      </Card>
    );
  }

  const isCashApp = method.toLowerCase() === "cashapp";

  return (
    <Card className={cn("p-6 md:p-8 border border-primary/30 bg-primary/[0.03] rounded-lg", className)}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10 rounded-lg">
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground md:text-xl">
            {isCashApp ? "Cash App Payment" : "PayPal Payment"}
          </h2>
          <Badge variant="secondary" className="mt-1 bg-primary/20 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary rounded-lg">
            {isCashApp ? "US Orders Only" : "Global Payments"}
          </Badge>
        </div>
      </div>

      <div className="mb-6 h-px w-full bg-border/50" />

      <div className="mb-6 space-y-5">
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="font-sans text-sm leading-relaxed text-foreground">
            {isCashApp
              ? "Send your payment using the details provided in the email."
              : "Complete your payment using the link sent to your email."}
          </p>
        </div>
      </div>

      <Button
        onClick={handleCompletePayment}
        disabled={isLoading || emailSent}
        className="h-12 w-full bg-primary text-primary-foreground font-sans text-sm font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : emailSent ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Instructions Sent
          </>
        ) : (
          <>
            <ExternalLink className="mr-2 h-4 w-4" />
            Complete Payment
          </>
        )}
      </Button>

      {showInstructions && (
        <div className="mt-6 border border-primary/20 bg-card/50 p-4 rounded-lg">
          <p className="font-sans text-sm leading-relaxed text-foreground">
            {isCashApp
              ? "Please open your Cash App and send the payment to the handle shown above. Include your order number in the payment note."
              : "You will be redirected to PayPal to complete your payment securely."}
          </p>
        </div>
      )}
    </Card>
  );
}