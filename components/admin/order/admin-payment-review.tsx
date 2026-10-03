"use client";

import { useState } from "react";
import { CreditCard, CheckCircle, XCircle, FileImage, ZoomIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { OptimizedImage } from "@/components/shared/optimized-image";
import type { AdminOrderDetail } from "./data";

interface AdminPaymentReviewProps {
  order: AdminOrderDetail;
  onVerify: (orderId: string) => void;
  onReject: (orderId: string, reason: string) => void;
  isVerifying?: boolean;
  isRejecting?: boolean;
}

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending Verification", className: "bg-warning/10 text-warning border-warning/20" },
  PAID: { label: "Verified", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function AdminPaymentReview({ order, onVerify, onReject, isVerifying, isRejecting }: AdminPaymentReviewProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const isCashApp = order.paymentMethod === 'CASH_APP';
  const methodLabel = isCashApp ? 'Cash App' : 'PayPal';
  const methodHandle = order.paymentRecipient;
  const statusConfig = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-secondary" />
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
              {methodLabel}
            </p>
            <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
              {methodHandle || 'Recipient was not captured for this legacy order; verify the customer’s original instructions before approval.'}
            </p>
            {order.paymentUrl && (
              <a href={order.paymentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex text-xs font-medium text-primary underline underline-offset-4">
                Open order payment link
              </a>
            )}
          </div>
          <div className="space-y-1">
            <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Payment Status
            </p>
            <Badge
              variant="outline"
              className={`font-[family-name:var(--font-montserrat)] text-xs ${statusConfig.className}`}
            >
              {statusConfig.label}
            </Badge>
            {order.paymentProof?.rejectionReason && (
              <p className="pt-2 text-xs text-muted-foreground">
                Last rejection reason: {order.paymentProof.rejectionReason}
              </p>
            )}
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
                <OptimizedImage
                  src={order.paymentProof.imageUrl}
                  alt="Payment proof"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 384px"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 bg-background/80 text-foreground hover:bg-background/90"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileImage className="h-4 w-4" />
                <span className="font-[family-name:var(--font-montserrat)] text-xs">
                  {order.paymentProof.uploadedAt}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 border border-warning/20 bg-warning/5 p-3">
              <FileImage className="h-4 w-4 text-warning" />
              <span className="font-[family-name:var(--font-montserrat)] text-xs text-warning">
                No payment proof uploaded yet
              </span>
            </div>
          )}
        </div>

        {order.paymentStatus === 'PENDING' && order.paymentProof && (
          <>
            <Separator className="bg-border/50" />
            <div className="space-y-2">
              <label htmlFor="payment-rejection-reason" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Rejection reason (required to reject)
              </label>
              <Textarea
                id="payment-rejection-reason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                maxLength={500}
                placeholder="Explain what needs to be corrected. The customer will receive this reason."
                disabled={isVerifying || isRejecting}
                className="min-h-24"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => onVerify(order.id)}
                disabled={isVerifying || isRejecting}
                className="bg-secondary font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-secondary/90"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isVerifying ? "Verifying..." : "Verify Payment"}
              </Button>
              <Button
                onClick={() => onReject(order.id, rejectionReason.trim())}
                disabled={isVerifying || isRejecting || !rejectionReason.trim()}
                variant="outline"
                className="border-destructive/50 font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/10 hover:text-destructive"
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