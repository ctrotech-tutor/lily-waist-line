"use client";

import { useState } from "react";
import { CreditCard, CheckCircle, XCircle, FileImage, ZoomIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { OrderDetails, PaymentStatus, PaymentMethod } from "./data";

interface AdminPaymentReviewProps {
  order: OrderDetails;
}

const paymentMethodConfig: Record<PaymentMethod, { label: string; handle: string }> = {
  cashapp: { label: "Cash App", handle: "$LilyWaistLine" },
  paypal: { label: "PayPal", handle: "payments@lilywaistline.com" },
};

const paymentStatusConfig = {
  pending: { label: "Pending Verification", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  verified: { label: "Verified", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function AdminPaymentReview({ order }: AdminPaymentReviewProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setPaymentStatus("verified");
      setIsVerifying(false);
    }, 500);
  };

  const handleReject = () => {
    setIsRejecting(true);
    setTimeout(() => {
      setPaymentStatus("rejected");
      setIsRejecting(false);
    }, 500);
  };

  return (
    <Card className="rounded-none border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#d4af37]" />
          <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
            Payment Review
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Payment Method
            </p>
            <p className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
              {paymentMethodConfig[order.paymentMethod].label}
            </p>
            <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
              {paymentMethodConfig[order.paymentMethod].handle}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Payment Status
            </p>
            <Badge
              variant="outline"
              className={`font-[family-name:var(--font-montserrat)] text-xs ${paymentStatusConfig[paymentStatus].className}`}
            >
              {paymentStatusConfig[paymentStatus].label}
            </Badge>
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-3">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Payment Proof
          </p>
          {order.paymentProof ? (
            <div className="space-y-3">
              <div className="relative aspect-video max-w-sm overflow-hidden border border-border/50 bg-muted/30">
                <img
                  src={order.paymentProof.previewUrl}
                  alt="Payment proof"
                  className="h-full w-full object-cover"
                />
                <button className="absolute bottom-2 right-2 rounded-none bg-black/80 p-1.5 text-white hover:bg-black">
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileImage className="h-4 w-4" />
                <span className="font-[family-name:var(--font-montserrat)] text-xs">
                  {order.paymentProof.fileName} • {order.paymentProof.fileSize} • {order.paymentProof.uploadedAt}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-none border border-amber-500/20 bg-amber-500/5 p-3">
              <FileImage className="h-4 w-4 text-amber-500" />
              <span className="font-[family-name:var(--font-montserrat)] text-xs text-amber-600">
                No payment proof uploaded yet
              </span>
            </div>
          )}
        </div>

        {paymentStatus === "pending" && order.paymentProof && (
          <>
            <Separator className="bg-border/50" />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleVerify}
                disabled={isVerifying || isRejecting}
                className="rounded-none bg-[#d4af37] font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#d4af37]/90"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isVerifying ? "Verifying..." : "Verify Payment"}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isVerifying || isRejecting}
                variant="outline"
                className="rounded-none border-red-500/50 font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-500/10 hover:text-red-700"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isRejecting ? "Rejecting..." : "Reject Payment"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
